# typed: true
# frozen_string_literal: true

module Mutations
  class CreateSubscription < BaseMutation
    # == Payload
    class Payload < T::Struct
      const :subject, User
    end

    # == Fields
    field :subject, Types::UserType

    # == Arguments
    argument :subject_id, ID, loads: Types::UserType

    # == Resolver
    sig { override.params(subject: User).returns(Payload) }
    def resolve(subject:)
      subscriber = current_user!
      subject.subscriptions.create!(subscriber:)
      Payload.new(subject:)
    end
  end
end
