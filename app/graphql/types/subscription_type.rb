# typed: strict
# frozen_string_literal: true

module Types
  class SubscriptionType < BaseObject
    # == Subscriptions
    field :activity_status, subscription: Subscriptions::ActivityStatus
    field :test_subscription, subscription: Subscriptions::TestSubscription
  end
end
