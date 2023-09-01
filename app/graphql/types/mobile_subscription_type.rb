# typed: strict
# frozen_string_literal: true

module Types
  class MobileSubscriptionType < BaseObject
    # == Interfaces
    implements NodeType

    # == Fields
    field :subject, UserType, null: false
    field :subscriber, MobileSubscriberType, null: false

    # == Helpers
    sig { override.returns(MobileSubscription) }
    def object = super
  end
end
