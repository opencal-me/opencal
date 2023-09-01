# typed: true
# frozen_string_literal: true

# == Schema Information
#
# Table name: activities
#
#  id              :uuid             not null, primary key
#  capacity        :integer
#  coordinates     :geography        point, 4326
#  description     :string
#  during          :tstzrange        not null
#  handle          :string           not null
#  location        :string
#  name            :string           default(""), not null
#  tags            :string           default([]), not null, is an Array
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
#  index_activities_on_tags             (tags)
#
# Foreign Keys
#
#  fk_rails_...  (owner_id => users.id)
#
class Activity < ApplicationRecord
  include Identifiable
  include Handled
  include FriendlyIdentifiable

  # == Constants
  URL_REGEXP = T.let(URI::DEFAULT_PARSER.regexp[:ABS_URI], Regexp)
  COODINATES_REGEXP = /^-?[0-9]+(\.[0-9]+)?, ?-?[0-9]+(\.[0-9]+)?$/

  # == Attributes
  attribute :handle, :string, default: -> { generate_handle }

  sig { returns(Time) }
  def start = during.begin

  sig { returns(Time) }
  def end = during.end

  sig { returns(Integer) }
  def duration_seconds
    (self.end - start).to_i
  end

  sig { returns(Integer) }
  def capacity_or_default
    capacity || 5
  end

  sig { returns(T::Boolean) }
  def location_is_url?
    URL_REGEXP.match?(location)
  end

  sig { returns(T::Boolean) }
  def location_is_coordinates?
    COODINATES_REGEXP.match?(location)
  end

  sig { returns(T::Boolean) }
  def location_is_address?
    !location_is_url? && !location_is_coordinates?
  end

  # == FriendlyIdentifiable
  friendly_id :handle, slug_limit: 32

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
    result = results.first or next
    result = T.cast(result, Geocoder::Result::Here)
    district = T.let(result.data.dig("address", "district"), T.nilable(String))
    activity.coordinates = coordinates_factory.point(
      result.longitude,
      result.latitude,
    )
    activity.build_address(
      full_address: result.address,
      street_address: [result.street_number, result.route].compact.join(" "),
      neighbourhood: district,
      city: result.city,
      country: result.country,
      province: result.province,
      postal_code: result.postal_code,
    )
    activity
  end

  # == Callbacks
  after_validation :geocode, if: %i[location_changed? location_is_address?]
  after_commit :update_google_event, on: %i[create destroy]

  # == Scopes
  scope :hidden, -> {
    T.bind(self, PrivateRelation)
    where.contains(tags: ["hidden"])
  }

  # == Routing
  sig { returns(String) }
  def to_param
    prefix = FriendlyId::Candidates.new(self, name).first
    [prefix, handle].join("--")
  end

  # == Emails
  sig { void }
  def send_created_email
    ActivityMailer.created_email(self).deliver_later
  end

  # == Importing
  sig { params(event: Google::Event, owner: User).void }
  def self.import_event!(event, owner:)
    if (attendees = event.attendees)
      owner_attendee = attendees.find do |attendee|
        attendee["email"] == owner.email
      end
      return unless owner_attendee && owner_attendee["organizer"]
    end
    title = if (title = event.title)
      GoogleEventTitle.parse(title)
    else
      GoogleEventTitle.blank
    end
    if google_event_is_activity?(event, title:)
      activity = _from_google_event(event, owner:, title:)
      activity.save!
      if activity.previously_new_record? && title.tags.exclude?("silent")
        activity.send_created_email
      end
    elsif (activity = find_by(google_event_id: event.id, owner:))
      activity.destroy!
    end
  end

  sig { params(user: User).void }
  def self.import_for_user!(user)
    user.sync_google_calendar { |event| import_event!(event, owner: user) }
  rescue User::GoogleAuthorizationError
    nil
  end

  sig { params(user: User).void }
  def self.import_for_user_later(user)
    ImportActivitiesForUserJob.perform_later(user)
  end

  sig { params(max_users: Integer).void }
  def self.import(max_users: 10)
    User.google_calendar_ready.merge(User.google_calendar_out_of_sync)
      .limit(max_users).each do |user|
        import_for_user_later(user)
      end
  end

  sig { params(max_users: T.nilable(Integer)).void }
  def self.import_later(max_users: nil)
    ImportActivitiesJob.perform_later(max_users:)
  end

  sig { void }
  def import!
    event = google_event!
    title = GoogleEventTitle.parse(event.title)
    _set_attributes_from_google_event(event, title:)
    save!
  end

  # == Google Event
  sig { returns(T::Boolean) }
  def google_event? = google_event_id?

  sig { returns(T.nilable(Google::Event)) }
  def google_event
    owner!.google_event(google_event_id)
  end

  sig { returns(Google::Event) }
  def google_event!
    owner!.google_event!(google_event_id)
  end

  sig { params(event: Google::Event, owner: User).returns(Activity) }
  def self.from_google_event(event, owner:)
    title = GoogleEventTitle.parse(event.title)
    _from_google_event(event, owner:, title:)
  end

  # == Google Event: Helpers
  sig do
    params(event: Google::Event, title: GoogleEventTitle).void
  end
  def _set_attributes_from_google_event(event, title:)
    self.name = title.name
    self.tags = title.tags
    self.description = event.description
    self.during = event.start_time.to_time..event.end_time.to_time
    self.location = event.location
    self.capacity = title.capacity
  end

  private_class_method def self.google_event_is_activity?(event, title:)
    !!(event.status != "cancelled" &&
        title.open? &&
        event.recurring_event_id.nil?)
  end

  sig do
    params(event: Google::Event, owner: User, title: GoogleEventTitle)
      .returns(Activity)
  end
  private_class_method def self._from_google_event(event, owner:, title:)
    activity = find_or_initialize_by(owner:, google_event_id: event.id)
    activity._set_attributes_from_google_event(event, title:)
    activity
  end

  # == Methods
  sig do
    params(description: String, view_context: ActionView::Base)
      .returns(String)
  end
  def self.parse_description_as_html(description, view_context:)
    if description.start_with?("<")
      doc = Nokogiri::HTML.parse(description)
      html = doc.search("//body").inner_html
      view_context.sanitize(html)
    else
      html = view_context.simple_format(description)
      view_context.auto_link(html, html_options: { target: "_blank" })
    end
  end

  sig { returns(Integer) }
  def openings
    capacity_or_default - reservations.count
  end

  sig { params(view_context: ActionView::Base).returns(T.nilable(String)) }
  def description_html(view_context:)
    description = self.description or return
    self.class.parse_description_as_html(description, view_context:)
  end

  private

  # == Helpers
  sig { params(include_open_tag: T::Boolean).returns(String) }
  def google_event_title(include_open_tag: true)
    tags = self.tags.dup
    tags.prepend("open") if include_open_tag
    tags.append("/#{capacity}") if capacity.present?
    tags = "[#{tags.join(" ")}]" if tags.present?
    [name, tags].compact_blank.join(" ")
  end

  sig { returns(T::Boolean) }
  def google_event_attributes_previously_changed?
    name_previously_changed? ||
      tags_previously_changed? ||
      capacity_previously_changed?
  end

  # == Callback Handlers
  sig { void }
  def update_google_event
    event = google_event or return
    if persisted? && google_event_attributes_previously_changed?
      event.title = google_event_title
      event.attachments = scoped do
        attachments = event.attachments || []
        opencal_attachments, other_attachments =
          attachments.partition do |attachment|
            attachment["title"] == "OpenCal"
          end
        opencal_attachment = opencal_attachments.first
        opencal_attachment ||= { "title" => "OpenCal" }
        opencal_attachment["fileUrl"] = activity_url(self)
        opencal_attachment["mimeType"] = "text/html"
        opencal_attachment["iconLink"] = root_url + "logo.png"
        [opencal_attachment, *other_attachments]
      end
      event.save
    elsif destroyed?
      if event.status != "cancelled"
        event.title = google_event_title(include_open_tag: false)
        if (attachments = event.attachments)
          attachments.delete_if do |attachment|
            attachment["title"] == "OpenCal"
          end
        end
        event.save
      end
    end
  end
end
