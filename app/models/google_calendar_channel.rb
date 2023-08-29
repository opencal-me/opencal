# typed: true
# frozen_string_literal: true

# == Schema Information
#
# Table name: google_calendar_channels
#
#  id           :uuid             not null, primary key
#  callback_url :string           not null
#  expires_at   :datetime         not null
#  token        :string           not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  calendar_id  :string           not null
#  owner_id     :uuid             not null
#  resource_id  :string           not null
#
# Indexes
#
#  index_google_calendar_channels_on_calendar_id  (calendar_id) UNIQUE
#  index_google_calendar_channels_on_owner_id     (owner_id)
#  index_google_calendar_channels_on_resource_id  (resource_id) UNIQUE
#  index_google_calendar_channels_on_token        (token) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (owner_id => users.id)
#
class GoogleCalendarChannel < ApplicationRecord
  include Identifiable

  # == Attributes
  attribute :token, :string, default: -> { Devise.friendly_token }

  sig { returns(T::Boolean) }
  def expired?
    expires_at <= 5.seconds.from_now
  end

  # == Associations
  belongs_to :owner, class_name: "User"

  sig { returns(User) }
  def owner!
    owner or raise ActiveRecord::RecordNotFound, "Missing owner"
  end

  sig { returns(Google::Calendar) }
  def google_calendar!
    owner!.google_calendar!
  end

  # == Callbacks
  before_destroy :stop

  # == Removal: Scopes
  scope :to_remove, -> {
    T.bind(self, PrivateRelation)
    prefix = Rails.application.routes.url_helpers.root_url
    sanitized_prefix = ActiveRecord::Base.sanitize_sql_like(prefix)
    joins(:owner).merge(User.with_google_calendar_ready).and(
      where("callback_url NOT LIKE ?", sanitized_prefix + "%").or(
        where("expires_at <= ?", 6.hours.from_now),
      ),
    )
  }

  # == Sync
  sig { void }
  def self.sync!
    to_remove.find_each do |channel|
      channel.transaction do
        channel.destroy!
      end
    end
    users_to_register.find_each do |user|
      GoogleCalendarChannel.register_for_user!(user)
    end if registerable?
  end

  sig { void }
  def self.sync_later
    SyncGoogleCalendarChannelsJob.perform_later
  end

  # == Registration
  sig { returns(T::Boolean) }
  def self.registerable?
    Rails.application.routes.default_url_options[:host] != "localhost"
  end

  sig { returns(User::PrivateRelation) }
  def self.users_to_register
    User
      .where.not(google_refresh_token: nil)
      .where.not(email: GoogleCalendarChannel.select(:calendar_id))
  end

  sig { params(user: User).returns(GoogleCalendarChannel) }
  def self.register_for_user!(user)
    channel = GoogleCalendarChannel.new(owner: user, calendar_id: user.email)
    channel.register
    begin
      channel.tap(&:save!)
    rescue => error
      channel.stop
      raise error
    end
  end

  sig { params(user: User).void }
  def self.register_for_user_later(user)
    RegisterGoogleCalendarChannelForUserJob.perform_later(user)
  end

  sig { void }
  def register
    if default_url_options[:host] == "localhost"
      raise "Cannot register channel in localhost"
    end
    id = SecureRandom.uuid
    address = callback_google_calendar_channel_url(id)
    channel = google_calendar!.watch_events(
      id:,
      token:,
      address:,
    )
    self.id = id
    self.callback_url = address
    self.resource_id = channel["resourceId"]
    self.expires_at = Time.zone.at(channel["expiration"].to_i / 1000)
  end

  # == Stopping
  sig { void }
  def stop
    unless expired?
      google_calendar!.stop_channel(id: T.must(id), resource_id:)
    end
  end
end
