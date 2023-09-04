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
  after_create_commit :send_welcome_text_later

  # == Finders
  sig { params(phone: String).returns(T.nilable(MobileSubscriber)) }
  def self.find_by_phone(phone)
    find_by(phone: normalize_phone(phone))
  end

  sig { params(phone: String).returns(MobileSubscriber) }
  def self.find_by_phone!(phone)
    find_by!(phone: normalize_phone(phone))
  end

  sig { params(phone: String).returns(MobileSubscriber) }
  def self.find_or_initialize_by_phone(phone)
    find_or_initialize_by(phone: Phonelib.parse(phone).to_s)
  end

  # == Notifications
  sig { returns(String) }
  def welcome_text_message
    message =
      "Hey, this is OpenCal. Save this #, we'll text you when your friends " \
        "are up to stuff."
    disclaimer = "Msg and data rates may apply. Msg frequency varies. Reply " \
      "HELP for help, STOP to cancel."
    [message, disclaimer].join("\n\n")
  end

  sig { void }
  def send_welcome_text
    send_text(welcome_text_message, lowercase: false)
  end

  sig { void }
  def send_welcome_text_later
    send_text_later(welcome_text_message, lowercase: false)
  end

  # == Methods
  sig { params(message: String, lowercase: T::Boolean).void }
  def send_text(message, lowercase: true)
    message = message.downcase if lowercase
    TwilioClient.send_message(message, to: phone)
  end

  sig { params(message: String, lowercase: T::Boolean).void }
  def send_text_later(message, lowercase: true)
    SendMobileSubscriberTextJob.perform_later(self, message, lowercase:)
  end

  # == Phone
  sig { params(phone: String).returns(String) }
  def self.normalize_phone(phone)
    Phonelib.parse(phone).to_s
  end

  private

  # == Normalization Handlers
  sig { void }
  def normalize_phone
    if (phone = self.phone)
      self.phone = self.class.normalize_phone(phone)
    end
  end
end
