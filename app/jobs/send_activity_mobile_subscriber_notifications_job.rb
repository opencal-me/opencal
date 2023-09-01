# typed: strict
# frozen_string_literal: true

class SendActivityMobileSubscriberNotificationsJob < ApplicationJob
  # == Configuration
  good_job_control_concurrency_with(
    key: -> {
      T.bind(self, SendActivityMobileSubscriberNotificationsJob)
      activity = T.let(arguments.first!, Activity)
      "#{self.class.name}(#{activity.to_gid})"
    },
    total_limit: 1,
  )

  # == Job
  sig { params(activity: Activity).void }
  def perform(activity)
    activity.send_mobile_subscriber_notifications
  end
end
