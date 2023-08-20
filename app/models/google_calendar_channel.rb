# typed: true
# frozen_string_literal: true

# == Schema Information
#
# Table name: google_calendar_channels
#
#  id          :uuid             not null, primary key
#  expires_at  :datetime         not null
#  token       :string           not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  calendar_id :string           not null
#  owner_id    :uuid             not null
#  resource_id :string           not null
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

  # == Associations
  belongs_to :owner, class_name: "User"

  sig { returns(User) }
  def owner!
    owner or raise ActiveRecord::RecordNotFound, "Missing owner"
  end

  # == Callbacks
  before_destroy :stop

  # == Methods: Registration
  sig { returns(T::Boolean) }
  def self.registerable?
    Rails.application.routes.default_url_options[:host] != "localhost"
  end

  sig { void }
  def self.sync!
    if registerable?
      User
        .where.not(email: GoogleCalendarChannel.select(:calendar_id))
        .find_each do |user|
          channel = GoogleCalendarChannel.new(
            owner: user,
            calendar_id: user.email,
          )
          channel.register
          begin
            channel.save!
          rescue => error
            channel.stop
            raise error
          end
        end
    else
      GoogleCalendarChannel.destroy_all
    end
  end

  sig { void }
  def self.sync_later
    SyncGoogleCalendarChannelsJob.perform_later
  end

  sig { returns(TrueClass) }
  def register
    if default_url_options[:host] == "localhost"
      raise "Cannot register channel in localhost"
    end
    id = SecureRandom.uuid
    channel = owner!.google_calendar.watch_events(
      id:,
      token:,
      address: notify_google_calendar_channel_url(id),
    )
    self.id = id
    self.resource_id = channel["resourceId"]
    self.expires_at = Time.zone.at(channel["expiration"].to_i / 1000)
    true
  end

  sig { void }
  def stop
    owner!.google_calendar.stop_channel(id: T.must(id), resource_id:)
  end
end
