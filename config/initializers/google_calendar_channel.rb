# typed: true
# frozen_string_literal: true

Rails.application.configure do
  if Rails.server?
    config.after_initialize do
      GoogleCalendarChannel.sync_later
    end
  end
end
