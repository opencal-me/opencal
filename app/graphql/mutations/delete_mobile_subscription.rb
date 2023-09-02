# typed: strict
# frozen_string_literal: true

module Mutations
  class DeleteMobileSubscription < BaseMutation
    # == Payload
    class Payload < T::Struct
      const :subject, User
    end

    # == Fields
    field :subject, Types::UserType, null: false

    # == Arguments
    argument :subscription_id, ID, loads: Types::MobileSubscriptionType

    # == Resolver
    sig do
      override.params(subscription: MobileSubscription).returns(Payload)
    end
    def resolve(subscription:)
      subject = subscription.subject!
      subscription.destroy!
      Payload.new(subject:)
    end
  end
end
