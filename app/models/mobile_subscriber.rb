# typed: strict
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

  # == Attributes
  sig { returns(String) }
  def formatted_phone
    Phonelib.parse(phone).international
  end

  # == Routing
  sig { override.returns(String) }
  def to_param
    phone
  end

  # == Associations
  has_many :subscriptions,
           class_name: "MobileSubscription",
           inverse_of: :subscriber,
           foreign_key: :subscriber_id,
           dependent: :destroy
  has_many :subscribes_to, through: :subscriptions, source: :subject
  has_many :scheduled_notifications,
           class_name: "ScheduledMobileNotification",
           inverse_of: :subscriber,
           foreign_key: :subscribe_id,
           dependent: :destroy

  # == Normalizations
  after_validation :normalize_phone

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

  # == Texts
  sig { returns(String) }
  def welcome_text_message
    message =
      "hey, this is opencal. save this #, we'll text you when your friends " \
        "are up to stuff."
    disclaimer = "Msg and data rates may apply. Msg frequency varies. Reply " \
      "HELP for help, STOP to cancel."
    [message, disclaimer].join("\n\n")
  end

  sig { void }
  def send_welcome_text
    send_text(welcome_text_message)
  end

  sig { void }
  def send_welcome_text_later
    send_text_later(welcome_text_message)
  end

  # == Texting
  sig { params(message: String).void }
  def send_text(message)
    TwilioClient.send_message(message, to: phone)
  rescue Twilio::REST::RestError => error
    if error.code == 21614 # user has unsubscribed by texting 'STOP' to Twilio
      destroy!
    else
      raise
    end
  end

  sig { params(message: String).void }
  def send_text_later(message)
    SendMobileSubscriberTextJob.perform_later(self, message)
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
    self.phone = self.class.normalize_phone(phone)
  end
end
