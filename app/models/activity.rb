# typed: true
# frozen_string_literal: true

# == Schema Information
#
# Table name: activities
#
#  id              :uuid             not null, primary key
#  capacity        :integer          not null
#  coordinates     :geography        point, 4326
#  description     :string
#  during          :tstzrange        not null
#  handle          :string           not null
#  location        :string
#  title           :string           not null
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  google_event_id :string           not null
#  owner_id        :uuid             not null
#
# Indexes
#
#  index_activities_on_coordinates      (coordinates) USING gist
#  index_activities_on_google_event_id  (google_event_id) UNIQUE
#  index_activities_on_handle           (handle) UNIQUE
#  index_activities_on_owner_id         (owner_id)
#
# Foreign Keys
#
#  fk_rails_...  (owner_id => users.id)
#
class Activity < ApplicationRecord
  include Identifiable
  include Handled
  include FriendlyIdentifiable

  # == Handled: Attributes
  attribute :handle, :string, default: -> { generate_handle }

  # == Attributes
  # TODO: Change this to reflect a default from the user's account settings.
  attribute :capacity, :integer, default: 5

  sig { returns(Time) }
  def start = during.begin

  sig { returns(Time) }
  def end = during.end

  # == FriendlyIdentifiable
  friendly_id :handle, slug_limit: 32

  # == Params
  sig { returns(String) }
  def to_param
    prefix = FriendlyId::Candidates.new(self, title).first
    [prefix, handle].join("--")
  end

  # == Associations
  belongs_to :owner, class_name: "User"
  has_one :address, dependent: :destroy
  has_many :reservations, dependent: :destroy

  sig { returns(User) }
  def owner!
    owner or raise ActiveRecord::RecordNotFound, "Missing owner"
  end

  # == Normalizations
  before_validation :normalize_title

  # == Geocoding
  sig { returns(RGeo::Geographic::Factory) }
  def self.coordinates_factory
    RGeo::Geographic.spherical_factory(srid: 4326)
  end

  sig { returns(RGeo::Geographic::Factory) }
  def coordinates_factory = self.class.coordinates_factory

  geocoded_by :location do |activity, results|
    if (result = results.first)
      result = T.cast(result, Geocoder::Result::Nominatim)
      quarter = T.let(result.data.dig("address", "quarter"), T.nilable(String))
      activity.coordinates = coordinates_factory.point(
        result.longitude,
        result.latitude,
      )
      activity.build_address(
        full_address: result.address,
        street_address: [result.house_number, result.street].compact.join(" "),
        neighbourhood: result.neighbourhood || quarter,
        city: result.city,
        country: result.country,
        province: result.province,
        postal_code: result.postal_code,
      )
      activity
    end
  end

  # == Callbacks
  before_validation :geocode, if: :location_changed?, unless: :location_is_url?

  # == Callbacks
  after_commit :update_google_event, on: %i[create destroy]

  # == Emails
  sig { void }
  def send_created_email
    ActivityMailer.created_email(self).deliver_later
  end

  # == Importing
  sig { params(user: User).void }
  def self.import_for_user!(user)
    transaction do
      user.changed_google_events.each do |event|
        if (attendees = event.attendees)
          owner_attendee = attendees.find do |attendee|
            attendee["email"] == user.email
          end
          next unless owner_attendee && owner_attendee["organizer"]
        end
        if event.status != "cancelled" && event.title&.end_with?(" [open]")
          activity = from_google_event(event, owner: user)
          activity.save!
          activity.send_created_email if activity.previously_new_record?
        elsif (activity = find_by(google_event_id: event.id, owner: user))
          activity.destroy!
        end
      end
      user.update_google_calendar_last_imported_at!
    end
  end

  sig { params(user: User).void }
  def self.import_for_user_later(user)
    ImportActivitiesForUserJob.perform_later(user)
  end

  sig { params(max_users: Integer).void }
  def self.import(max_users: 10)
    users = if Rails.env.production?
      User.where(google_calendar_last_imported_at: nil)
        .or(User.where("google_calendar_last_imported_at < ?", 5.minutes.ago))
    else
      User.all
    end
    users.limit(max_users).each { |user| import_for_user_later(user) }
  end

  sig { params(max_users: T.nilable(Integer)).void }
  def self.import_later(max_users: nil)
    ImportActivitiesJob.perform_later(max_users:)
  end

  # == Google Event
  sig { returns(T::Boolean) }
  def google_event? = google_event_id?

  sig { returns(Google::Event) }
  def google_event!
    owner!.google_event(google_event_id)
  end

  sig { params(event: Google::Event).void }
  def set_attributes_from_google_event(event) # rubocop:disable Naming/AccessorMethodName, Layout/LineLength
    self.title = event.title
    self.description = event.description
    self.during = (event.start_time.to_time..event.end_time.to_time)
    self.location = event.location
  end

  sig { params(event: Google::Event, owner: User).returns(Activity) }
  def self.from_google_event(event, owner:)
    activity = find_or_initialize_by(owner:, google_event_id: event.id)
    activity.set_attributes_from_google_event(event)
    activity
  end

  # == Methods
  sig { returns(T::Boolean) }
  def location_is_url?
    url_regexp = T.let(URI::DEFAULT_PARSER.regexp[:ABS_URI], Regexp)
    url_regexp.match?(location)
  end

  sig { returns(Integer) }
  def openings
    capacity - reservations.count
  end

  private

  # == Normalization handlers
  def normalize_title
    unless self[:title]&.end_with?(" [open]")
      self.title += " [open]"
    end
  end

  # == Callback handlers
  sig { void }
  def update_google_event
    event = google_event!
    if previously_new_record?
      event.title = title
      event.attachments = [{ "fileUrl" => activity_url(self) }]
      event.save
    elsif destroyed?
      if event.status != "cancelled"
        event.title.delete_suffix!(" [open]")
        event.attachments = []
        event.save
      end
    end
  end
end
