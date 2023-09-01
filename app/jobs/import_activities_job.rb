# typed: strict
# frozen_string_literal: true

class ImportActivitiesJob < ApplicationJob
  # == Configuration
  good_job_control_concurrency_with total_limit: 1

  # == Job
  sig { params(max_users: T.nilable(Integer)).void }
  def perform(max_users: nil)
    options = { max_users: }
    Activity.import(**options.compact)
  end
end
