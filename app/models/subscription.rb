# typed: strict
# frozen_string_literal: true

# == Schema Information
#
# Table name: subscriptions
#
#  id            :uuid             not null, primary key
#  status        :string           not null
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  subject_id    :uuid             not null
#  subscriber_id :uuid             not null
#
# Indexes
#
#  index_subscriptions_on_subject_id     (subject_id)
#  index_subscriptions_on_subscriber_id  (subscriber_id)
#  index_subscriptions_uniqueness        (subscriber_id,subject_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (subject_id => users.id)
#  fk_rails_...  (subscriber_id => users.id)
#
class Subscription < ApplicationRecord
  # == Attributes
  enumerize :status, in: %i[requested approved rejected], default: :requested

  # == Associations
  belongs_to :subscriber, class_name: "User"
  belongs_to :subject, class_name: "User"

  # == Validations
  validates :subscriber,
            uniqueness: { scope: :subject, message: "already subscribed" }
end
