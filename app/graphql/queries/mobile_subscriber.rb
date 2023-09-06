# typed: strict
# frozen_string_literal: true

module Queries
  class MobileSubscriber < BaseQuery
    include AllowsFailedLoads

    # == Type
    type Types::MobileSubscriberType, null: true

    # == Arguments
    argument :id, ID, loads: Types::MobileSubscriberType, as: :subscriber

    # == Resolver
    sig do
      params(subscriber: T.nilable(::MobileSubscriber))
        .returns(T.nilable(::MobileSubscriber))
    end
    def resolve(subscriber:)
      return unless subscriber
      subscriber if allowed_to?(:show?, subscriber)
    end
  end
end
