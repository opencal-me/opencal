# typed: strict
# frozen_string_literal: true

# == Schema Information
#
# Table name: activities
#
#  id                 :uuid             not null, primary key
#  capacity           :integer
#  coordinates        :geography        point, 4326
#  description        :string
#  during             :tstzrange        not null
#  location           :string
#  name               :string           default(""), not null
#  silent             :boolean          not null
#  slug               :string           not null
#  tags               :string           default([]), not null, is an Array
#  time_zone_override :string
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  google_event_id    :string           not null
#  owner_id           :uuid             not null
#
# Indexes
#
#  index_activities_on_coordinates      (coordinates) USING gist
#  index_activities_on_google_event_id  (google_event_id) UNIQUE
#  index_activities_on_owner_id         (owner_id)
#  index_activities_on_slug             (slug) UNIQUE
#  index_activities_on_tags             (tags)
#
# Foreign Keys
#
#  fk_rails_...  (owner_id => users.id)
#
class Activity < ApplicationRecord
  extend FriendlyId
  include Identifiable
  include Slugged

  # == Constants
  URL_REGEXP = T.let(URI::DEFAULT_PARSER.regexp[:ABS_URI], Regexp)
  COODINATES_REGEXP = /^-?[0-9]+(\.[0-9]+)?, ?-?[0-9]+(\.[0-9]+)?$/

  # == Configuration
  class_attribute :notifications_delay, default: 10.seconds

  # == Attributes
  attribute :slug, :string, default: -> { generate_slug }

  sig { returns(Time) }
  def start_time
    during.begin
  end

  sig { returns(T::Boolean) }
  def started?
    start_time.past?
  end

  sig { returns(Time) }
  def end_time
    during.end
  end

  sig { returns(T::Boolean) }
  def ended?
    end_time.past?
  end

  sig { returns(Integer) }
  def duration_seconds
    (end_time - start_time).to_i
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

  sig { returns(T::Array[String]) }
  def mentions
    groups.pluck(:handle).map { |handle| "@#{handle}" }
  end

  # == FriendlyId
  friendly_id :slug, slug_limit: 32

  sig { override.returns(String) }
  def friendly_id
    prefix = FriendlyId::Candidates.new(self, name).first
    [prefix, slug].join("--")
  end

  # == Routing
  sig { override.returns(String) }
  def to_param
    slug
  end

  # == Associations
  belongs_to :owner, class_name: "User"
  has_one :address, dependent: :destroy
  has_many :reservations, dependent: :destroy
  has_many :scheduled_mobile_notifications, dependent: :destroy
  has_and_belongs_to_many :groups

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
    activity.coordinates = coordinates_factory
      .point(result.longitude, result.latitude)
    activity.build_address(
      place_name: result.data["title"],
      full_address: result.address,
      street_address: [result.street_number, result.route].compact.join(" "),
      neighbourhood: result.data.dig("address", "district"),
      city: result.city,
      country: result.country,
      province: result.province,
      postal_code: result.postal_code,
    )
    activity
  end

  # == Callbacks
  after_validation :geocode, if: %i[location_changed? location_is_address?]
  after_update :update_mobile_notifications, if: :saved_change_to_during?
  after_commit :update_google_event
  after_create_commit :schedule_mobile_notifications,
                      if: :send_mobile_notifications?

  # == Scopes
  scope :publicly_visible, -> {
    T.bind(self, PrivateRelation)
    where("? = ANY(tags)", "public").merge(Activity.hidden.invert_where)
  }

  scope :hidden, -> {
    T.bind(self, PrivateRelation)
    where("? = ANY(tags)", "hidden")
  }

  # == Emails
  sig { void }
  def schedule_created_email
    ActivityMailer.created_email(self).deliver_later(wait: notifications_delay)
  end

  # == Mobile Notifications
  sig { returns(T::Boolean) }
  def send_mobile_notifications?
    !silent? && groups.empty?
  end

  sig { void }
  def schedule_mobile_notifications
    owner!.mobile_subscribers.find_each do |subscriber|
      scheduled_mobile_notifications.create!(
        subscriber:,
        deliver_after: morning_of,
      )
    end unless ended?
  end

  sig { void }
  def schedule_mobile_notifications_later
    ScheduleActivityMobileNotificationsJob
      .set(wait: notifications_delay)
      .perform_later(self)
  end

  sig { void }
  def update_mobile_notifications
    notifications = scheduled_mobile_notifications.pending_delivery
    if ended?
      notifications.destroy_all
    else
      notifications.find_each do |notification|
        notification.deliver_after = morning_of
        notification.save! if notification.changed?
      end
    end
  end

  # == Importing
  sig { params(event: Google::Event, owner: User).returns(T.nilable(Activity)) }
  def self.import_event!(event, owner:)
    title = if (title = event.title)
      GoogleEventTitle.parse(title)
    else
      GoogleEventTitle.blank
    end
    if _google_event_is_activity?(event, owner:, title:)
      activity = transaction do |; activity| # rubocop:disable Layout/SpaceAroundBlockParameters, Layout/LineLength
        activity = _from_google_event(event, owner:, title:)
        activity.save! if activity.changed?
        activity
      end
      if activity.previously_new_record? && !activity.silent?
        activity.schedule_created_email
      end
      activity
    elsif (activity = find_by(google_event_id: event.id, owner:))
      activity.destroy!
      activity
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

  sig { params(include_open_tag: T::Boolean).returns(String) }
  def google_event_title(include_open_tag: true)
    modifiers = mentions + tags
    modifiers.prepend("open") if include_open_tag
    modifiers.append("/#{capacity}") if capacity.present?
    modifiers = "[#{modifiers.join(" ")}]" if modifiers.present?
    [name, modifiers].compact_blank.join(" ")
  end

  # sig { returns(String) }
  # def google_event_description
  #   url = join_activity_url(friendly_id)
  #   cta = "<a href=\"#{url}\" target=\"_blank\">join on opencal</a>"
  #   if (description = description.presence)
  #     description + "<br /><br />---<br />#{cta}"
  #   else
  #     cta
  #   end
  # end

  sig { params(event: Google::Event, user: User).returns(T::Boolean) }
  def self.google_event_organized_by_user?(event, user)
    if (attendees = event.attendees)
      owner_attendee = attendees.find do |attendee|
        attendee["email"] == user.email
      end
      !!(owner_attendee && owner_attendee["organizer"])
    else
      true
    end
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
    self.silent = title.silent
    self.description = event.description
    self.during = event.start_time.to_time..event.end_time.to_time
    self.location = event.location
    self.capacity = title.capacity
    self.time_zone_override = event.time_zone
    self.groups = scoped do
      handles = title.mentions.map { |mention| mention.delete_prefix("@") }
      owner!.groups.where(handle: handles)
    end
    if (attendees = event.attendees.presence)
      reservations.where.not(email: attendees.pluck("email")).destroy_all
    end
  end

  sig do
    params(event: Google::Event, owner: User, title: GoogleEventTitle)
      .returns(T::Boolean)
  end
  private_class_method def self._google_event_is_activity?(
    event,
    owner:,
    title:
  )
    !!(title.open? &&
        event.status != "cancelled" &&
        event.recurring_event_id.nil? &&
        google_event_organized_by_user?(event, owner))
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

  # == iCalendar
  sig { params(event: Icalendar::Event).void }
  def save_to_icalendar_event(event)
    # event.uid = id
    event.dtstart = start_time
    event.dtend = end_time
    event.summary = google_event_title
    event.description = description
    event.location = location
    reservations.find_each do |reservation|
      attendee = Icalendar::Values::CalAddress.new(
        "mailto:#{reservation.email}",
        cn: reservation.name,
      )
      event.append_attendee(attendee)
    end
    attachment = Icalendar::Values::Uri.new(
      join_activity_url(friendly_id),
      "fmttype" => "text/html",
    )
    event.append_attach(attachment)
  end

  # == Demo
  sig { returns(T::Boolean) }
  def demo?
    tags.include?("demo")
  end

  sig { void }
  def self.destroy_demo_activity!
    where("? = ANY(tags)", "demo").where("created_at < ?", 15.minutes.ago)
      .find_each do |activity|
        activity.owner!.delete_google_event!(activity.google_event!)
        activity.destroy!
      end
  end

  sig { void }
  def self.destroy_demo_activity_later
    DestroyDemoActivitiesJob.perform_later
  end

  # == Description
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

  sig { params(view_context: ActionView::Base).returns(T.nilable(String)) }
  def description_html(view_context:)
    description = self.description or return
    self.class.parse_description_as_html(description, view_context:)
  end

  # == Methods
  sig { returns(Integer) }
  def openings
    capacity_or_default - reservations.count
  end

  sig { returns(ActiveSupport::TimeZone) }
  def time_zone
    if (time_zone = time_zone_override)
      ActiveSupport::TimeZone.new(time_zone)
    else
      owner!.time_zone
    end
  end

  sig { returns(ActiveSupport::TimeWithZone) }
  def morning_of
    start_time = self.start_time.in_time_zone(time_zone)
    beginning_of_day = start_time.beginning_of_day
    beginning_of_day -= 1.day if start_time.hour < 8
    beginning_of_day + 8.hours - 1.second
  end

  private

  # == Helpers
  sig { returns(T::Boolean) }
  def google_event_attributes_previously_changed?
    name_previously_changed? ||
      tags_previously_changed? ||
      silent_previously_changed? ||
      capacity_previously_changed?
  end

  # == Callback Slugrs
  sig { void }
  def update_google_event
    event = google_event or return
    activity_url = activity_url(self)
    if persisted? && google_event_attributes_previously_changed?
      event.title = google_event_title
      # event.description = google_event_description
      event.attachments = [{ "fileUrl" => activity_url }]
      event.save
    elsif destroyed?
      if event.status != "cancelled"
        event.title = google_event_title(include_open_tag: false)
        event.attachments = []
        event.save
      end
    end
  end
end
