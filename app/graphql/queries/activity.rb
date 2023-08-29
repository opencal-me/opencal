# typed: true
# frozen_string_literal: true

module Queries
  class Activity < BaseQuery
    include AllowsFailedLoads

    # == Type
    type Types::ActivityType, null: true

    # == Arguments
    argument :id, ID, loads: Types::ActivityType, as: :activity

    # == Resolver
    sig do
      params(activity: T.nilable(::Activity)).returns(T.nilable(::Activity))
    end
    def resolve(activity:)
      return unless activity
      return unless allowed_to?(:show?, activity)
      if Rails.env.development?
        ::Activity.import_event!(activity.google_event!, owner: activity.owner!)
      end
      activity
    end
  end
end
