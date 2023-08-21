# typed: true
# frozen_string_literal: true

class AddCallbackUrlToGoogleCalendarChannels < ActiveRecord::Migration[7.0]
  def change
    add_column :google_calendar_channels, :callback_url, :string
    up_only do
      GoogleCalendarChannel.find_each do |channel|
        callback_url = Rails.application.routes.url_helpers
          .callback_google_calendar_channel_url(channel)
        channel.update!(callback_url:)
      end
    end
    change_column_null :google_calendar_channels, :callback_url, false
  end
end
