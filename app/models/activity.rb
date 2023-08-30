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

  # == Handled: Attributes
  attribute :handle, :string, default: -> { generate_handle }

  # == Attributes
  # TODO: Change this to reflect a default from the user's account settings.
  attribute :capacity, :integer, default: 5

  sig { returns(Time) }
  def start = during.begin

  sig { returns(Time) }
  def end = during.end

  sig { returns(Integer) }
  def duration_seconds
    (self.end - start).to_i
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
  after_validation :geocode, if: :location_changed?, unless: :location_is_url?

  # == Google Calendar: Callbacks
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
    tags = if (title = event.title)
      parse_google_event_title(title).last
    else
      []
    end
    if event.status != "cancelled" && tags.include?("open")
      activity = from_google_event(event, owner:)
      activity.save!
      if activity.previously_new_record? && tags.exclude?("silent")
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

  sig { params(title: String).returns([String, T::Array[String]]) }
  def self.parse_google_event_title(title)
    @parsed_titles = T.let(
      @parsed_titles,
      T.nilable(T::Hash[String, [String, T::Array[String]]]),
    )
    @parsed_titles ||= Hash.new do |hash, title|
      raise "Parsed titles hash exceed 100 entries" if hash.size > 100
      hash.delete(hash.keys.first) if hash.size == 100
      name, tags = if (matches = /^(.*) \[(.*)\]$/.match(title))
        name, tags = matches.captures
        tags = if (text = tags)
          text.strip.split(" ").uniq
        end
        [name || "", tags || []]
      else
        [title, []]
      end
      hash[title] = [name, tags]
    end
    @parsed_titles[title.strip]
  end

  sig { params(event: Google::Event, owner: User).returns(Activity) }
  def self.from_google_event(event, owner:)
    activity = find_or_initialize_by(owner:, google_event_id: event.id)
    name, tags = parse_google_event_title(event.title)
    activity.name = name
    activity.tags = tags.excluding("open", "silent")
    activity.description = event.description
    activity.during = event.start_time.to_time..event.end_time.to_time
    activity.location = event.location
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

  sig { returns(T::Boolean) }
  def location_is_url?
    url_regexp = T.let(URI::DEFAULT_PARSER.regexp[:ABS_URI], Regexp)
    url_regexp.match?(location)
  end

  sig { returns(Integer) }
  def openings
    capacity - reservations.count
  end

  sig { params(view_context: ActionView::Base).returns(T.nilable(String)) }
  def description_html(view_context:)
    description = self.description or return
    self.class.parse_description_as_html(description, view_context:)
  end

  private

  # == Helpers
  sig { params(include_open: T::Boolean).returns(T.nilable(String)) }
  def tags_for_google_event_title(include_open: true)
    tags = self.tags.dup
    tags.prepend("open") if include_open
    "[#{tags.join(" ")}]" if tags.present?
  end

  sig { params(include_open_tag: T::Boolean).returns(String) }
  def google_event_title(include_open_tag: true)
    tags = tags_for_google_event_title(include_open: include_open_tag)
    [name, tags].compact_blank.join(" ")
  end

  # == Google Calendar: Callback Handlers
  sig { void }
  def update_google_event
    event = google_event or return
    if previously_new_record?
      event.title = google_event_title
      event.attachments = scoped do
        attachments = event.attachments || []
        attachments << {
          "title" => "OpenCal",
          "fileUrl" => activity_url(self),
          "mimeType" => "text/html",
          "iconLink" => root_url + "logo.png",
        }
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
