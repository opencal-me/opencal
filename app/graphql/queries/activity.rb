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
      if activity
        activity if allowed_to?(:show?, activity)
      end
    end
  end
end
