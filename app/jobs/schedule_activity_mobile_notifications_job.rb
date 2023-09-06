# typed: strict
# frozen_string_literal: true

class ScheduleActivityMobileNotificationsJob < ApplicationJob
  # == Configuration
  good_job_control_concurrency_with(
    key: -> {
      T.bind(self, ScheduleActivityMobileNotificationsJob)
      activity = T.let(arguments.first!, Activity)
      "#{self.class.name}(#{activity.to_gid})"
    },
    total_limit: 1,
  )

  # == Job
  sig { params(activity: Activity).void }
  def perform(activity)
    activity.schedule_mobile_notifications
  end
end
