# typed: strict
# frozen_string_literal: true

class ImportActivitiesForUserJob < ApplicationJob
  # == Configuration
  good_job_control_concurrency_with(
    key: -> {
      T.bind(self, ImportActivitiesForUserJob)
      user = T.let(arguments.first!, User)
      "#{self.class.name}(#{user.to_gid})"
    },
    total_limit: 1,
  )

  # == Job
  sig { params(user: User).void }
  def perform(user)
    Activity.import_for_user!(user)
  end
end
