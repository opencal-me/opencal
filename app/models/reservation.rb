# typed: strict
# frozen_string_literal: true

# == Schema Information
#
# Table name: reservations
#
#  id          :uuid             not null, primary key
#  email       :string           not null
#  name        :string           not null
#  note        :text
#  phone       :string           not null
#  status      :string           not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  activity_id :uuid             not null
#
# Indexes
#
#  index_reservations_on_activity_id  (activity_id)
#  index_reservations_uniqueness      (activity_id,email) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (activity_id => activities.id)
#
class Reservation < ApplicationRecord
  include Identifiable

  # == Constants
  MISSING_PHONE_VALUE = "MISSING_PHONE_NUMBER"

  # == Attributes
  enumerize :status, in: %i[requested approved rejected], default: :approved

  sig { returns(T.nilable(String)) }
  def formatted_phone
    return MISSING_PHONE_VALUE if phone == MISSING_PHONE_VALUE
    Phonelib.parse(phone).international
  end

  sig { returns(String) }
  def name_with_phone
    "#{name} (#{formatted_phone})"
  end

  # == Associations
  belongs_to :activity

  sig { returns(Activity) }
  def activity!
    activity or raise ActiveRecord::RecordNotFound, "Missing activity"
  end

  # == Normalizations
  removes_blank :note
  after_validation :normalize_phone

  # == Validations
  validates :name, presence: true, length: { maximum: 129 }
  validates :email,
            presence: true,
            length: { maximum: 100 },
            email: true,
            uniqueness: {
              scope: :activity,
              message: "already added",
            }
  validates :phone, presence: true, phone: { possible: true }

  # == Callbacks
  after_create_commit :update_google_event
  after_create_commit :send_created_email_later

  # == Emails
  sig { void }
  def send_created_email_later
    ReservationMailer.created_email(self).deliver_later
  end

  # == Methods
  sig { returns(String) }
  def email_with_name
    ActionMailer::Base.email_address_with_name(email, name)
  end

  sig { returns(T::Hash[String, T.untyped]) }
  def as_attendee_json
    {
      "email" => email,
      "displayName" => name_with_phone,
      "responseStatus" => "needsAction",
    }.compact
  end

  private

  # == Normalization Handlers
  sig { void }
  def normalize_phone
    self.phone = Phonelib.parse(phone).to_s
  end

  # == Callback Handlers
  sig { void }
  def update_google_event
    activity = activity!
    owner = activity.owner!
    event = activity.google_event!
    event.attendees ||= [{
      "email" => owner.email,
      "displayName" => owner.name,
      "organizer" => true,
      "responseStatus" => "accepted",
    }]
    unless event.attendees.any? { |attendee| attendee["email"] == email }
      event.attendees << as_attendee_json
      event.send_notifications = true
      event.save
    end
  end
end
