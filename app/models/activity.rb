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

  # == Initialization
  after_initialize :set_attributes_from_google_event,
                   if: %i[new_record? google_event_id?]

  # == Handled: Attributes
  attribute :handle, :string, default: -> { generate_handle }

  # == Attributes
  # TODO: Change this to reflect a default from the user's account settings.
  attribute :capacity, :integer, default: 5

  sig { returns(Time) }
  def start = during.begin

  sig { returns(Time) }
  def end = during.end

  sig { returns(T::Boolean) }
  def google_event? = google_event_id?

  sig { returns(Google::Event) }
  def google_event!
    owner!.google_event(google_event_id)
  end

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

  # == Methods
  sig { returns(T::Boolean) }
  def location_is_url?
    url_regexp = T.let(URI::DEFAULT_PARSER.regexp[:ABS_URI], Regexp)
    url_regexp.match?(location)
  end

  private

  # == Callback Handlers
  sig { void }
  def set_attributes_from_google_event
    event = google_event!
    self.title = event.title
    self.description = event.description
    self.during = (event.start_time.to_time..event.end_time.to_time)
    self.location = event.location
  end
end
