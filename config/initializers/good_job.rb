# typed: strict
# frozen_string_literal: true

Rails.application.configure do
  config.good_job.tap do |config|
    config.poll_interval = ENV.fetch("GOOD_JOB_POLL_INTERVAL", 30).to_i
    config.max_threads = ENV.fetch("GOOD_JOB_MAX_THREADS", 2).to_i

    # == Cron Jobs
    config.enable_cron = true
    config.cron = {
      "active_storage/cleanup_blobs": {
        class: "ActiveStorage::CleanupBlobsJob",
        description: "Schedule purging of unattached ActiveStorage blobs.",
        cron: "0 */6 * * *",
      },
      "import_activities": {
        class: "ImportActivitiesJob",
        description: "Import activities from Google Calendar.",
        cron: "* * * * *",
      },
      "sync_google_calendar_channels": {
        class: "SyncGoogleCalendarChannelsJob",
        description: "Sync Google Calendar channels.",
        cron: "0 * * * *",
      },
    }

    # == Errors
    config.on_thread_error = ->(error) do
      error = T.let(error, Exception)
      Rails.error.report(error, handled: false)
    end
  end
end
