# typed: strict
# frozen_string_literal: true

class NotifyActivityMobileSubscribersJob < ApplicationJob
  # == Configuration
  good_job_control_concurrency_with(
    key: -> {
      T.bind(self, NotifyActivityMobileSubscribersJob)
      activity = T.let(arguments.first!, Activity)
      "#{self.class.name}(#{activity.to_gid})"
    },
    total_limit: 1,
  )

  # == Job
  sig { params(activity: Activity).void }
  def perform(activity)
    activity.notify_mobile_subscribers
  end
end
