# typed: strict
# frozen_string_literal: true

class SyncGoogleCalendarChannelsJob < ApplicationJob
  # == Configuration
  good_job_control_concurrency_with total_limit: 1

  # == Job
  sig { void }
  def perform
    GoogleCalendarChannel.sync!
  end
end
