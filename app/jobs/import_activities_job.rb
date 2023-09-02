# typed: strict
# frozen_string_literal: true

class ImportActivitiesJob < ApplicationJob
  # == Configuration
  good_job_control_concurrency_with total_limit: 1

  # == Job
  sig { params(options: T.untyped).void }
  def perform(**options)
    Activity.import(**options.compact)
  end
end
