# typed: strict
# frozen_string_literal: true

# == Schema Information
#
# Table name: reservations
#
#  id          :uuid             not null, primary key
#  email       :string           not null
#  name        :string           not null
#  phone       :string
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

  # == Attributes
  enumerize :status, in: %i[requested approved rejected], default: :approved

  # == Associations
  belongs_to :activity

  sig { returns(Activity) }
  def activity!
    activity or raise ActiveRecord::RecordNotFound, "Missing activity"
  end

  sig { returns(Google::Event) }
  def google_event!
    activity!.google_event!
  end

  # == Normalizations
  removes_blank :phone
  before_validation :normalize_phone

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
  validates :phone, phone: { possible: true }, allow_nil: true

  # == Callbacks
  after_create_commit :update_google_event
  after_create_commit :send_created_email_later

  # == Emails
  sig { void }
  def send_created_email_later
    ReservationMailer.created_email(self).deliver_later
  end

  # == Methods
  sig { returns(T::Hash[String, T.untyped]) }
  def as_attendee_json
    { "email" => email, "responseStatus" => "needsAction" }
  end

  private

  # == Normalization Handlers
  sig { void }
  def normalize_phone
    if (phone = self.phone)
      self.phone = Phonelib.parse(phone).to_s
    end
  end

  # == Callback Handlers
  sig { void }
  def update_google_event
    event = google_event!
    event.attendees ||= []
    unless event.attendees.any? { |attendee| attendee["email"] == email }
      event.attendees << as_attendee_json
      event.send_notifications = true
      event.save
    end
  end
end
