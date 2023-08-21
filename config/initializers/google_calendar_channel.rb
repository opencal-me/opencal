# typed: true
# frozen_string_literal: true

Rails.application.configure do
  if Rails.server?
    config.after_initialize do
      puts "=> Syncing Google Calendar channels" # rubocop:disable Rails/Output
      GoogleCalendarChannel.sync_later
      if Rails.env.development?
        at_exit { GoogleCalendarChannel.find_each(&:destroy!) }
      end
    end
  end
end
