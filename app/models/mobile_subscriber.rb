# typed: true
# frozen_string_literal: true

# == Schema Information
#
# Table name: mobile_subscribers
#
#  id         :uuid             not null, primary key
#  phone      :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_mobile_subscribers_on_phone  (phone) UNIQUE
#
class MobileSubscriber < ApplicationRecord
  include Identifiable

  # == Associations
  has_many :subscriptions,
           class_name: "MobileSubscription",
           inverse_of: :subscriber,
           foreign_key: :subscriber_id,
           dependent: :destroy
  has_many :subscribes_to, through: :subscriptions, source: :subject

  # == Normalizations
  before_validation :normalize_phone

  # == Validations
  validates :phone, presence: true, phone: { possible: true }

  # == Callbacks
  after_create_commit :send_welcome_notification_later

  # == Finders
  sig { params(phone: String).returns(MobileSubscriber) }
  def self.find_or_initialize_by_phone(phone)
    find_or_initialize_by(phone: Phonelib.parse(phone).to_s)
  end

  # == Notifications
  sig { returns(String) }
  def welcome_notification_message
    "Hey, this is OpenCal. Save this #, we'll text you when your friends are " \
      "doing something and would like you to join them.\n\nReply STOP to " \
      "unsubscribe."
  end

  sig { void }
  def send_welcome_notification
    send_message(welcome_notification_message)
  end

  sig { void }
  def send_welcome_notification_later
    send_message_later(welcome_notification_message)
  end

  # == Methods
  sig { params(message: String).void }
  def send_message(message)
    Telnyx.send_message(message, to: phone)
  end

  sig { params(message: String).void }
  def send_message_later(message)
    SendMobileSubscriberMessageJob.perform_later(self, message)
  end

  private

  # == Normalization Handlers
  sig { void }
  def normalize_phone
    if (phone = self.phone)
      self.phone = Phonelib.parse(phone).to_s
    end
  end
end
