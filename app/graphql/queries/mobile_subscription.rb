# typed: strict
# frozen_string_literal: true

module Queries
  class MobileSubscription < BaseQuery
    include AllowsFailedLoads

    # == Type
    type Types::MobileSubscriptionType, null: true

    # == Arguments
    argument :id, ID, loads: Types::MobileSubscriptionType, as: :subscription

    # == Resolver
    sig do
      params(subscription: T.nilable(::MobileSubscription))
        .returns(T.nilable(::MobileSubscription))
    end
    def resolve(subscription:)
      return unless subscription
      subscription if allowed_to?(:show?, subscription)
    end
  end
end
