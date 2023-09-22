# typed: strict
# frozen_string_literal: true

# rubocop: disable Layout/LineLength
#
# == Schema Information
#
# Table name: mobile_subscriptions
#
#  id            :uuid             not null, primary key
#  created_at    :datetime         not null
#  subject_id    :uuid             not null
#  subscriber_id :uuid             not null
#
# Indexes
#
#  index_mobile_subscriptions_on_subject_id     (subject_id)
#  index_mobile_subscriptions_on_subscriber_id  (subscriber_id)
#  index_mobile_subscriptions_uniqueness        (subscriber_id,subject_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (subject_id => users.id)
#  fk_rails_...  (subscriber_id => mobile_subscribers.id)
#
# rubocop:enable Layout/LineLength
class MobileSubscription < ApplicationRecord
  include Identifiable

  # == Associations
  belongs_to :subscriber,
             class_name: "MobileSubscriber",
             inverse_of: :subscriptions
  belongs_to :subject, class_name: "User"

  sig { returns(MobileSubscriber) }
  def subscriber!
    subscriber or raise ActiveRecord::RecordNotFound, "Subscriber not found"
  end

  sig { returns(User) }
  def subject!
    subject or raise ActiveRecord::RecordNotFound, "Subject not found"
  end

  # == Validations
  validates :subscriber,
            uniqueness: { scope: :subject, message: "already subscribed" }

  # == Callbacks
  after_create_commit :send_created_email_later

  # == Emails
  sig { void }
  def send_created_email_later
    MobileSubscriptionMailer.created_email(self).deliver_later
  end
end
