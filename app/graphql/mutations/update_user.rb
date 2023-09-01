# typed: true
# frozen_string_literal: true

module Mutations
  class UpdateUser < BaseMutation
    # == Payload
    class Payload < T::Struct
      const :user, T.nilable(User)
      const :errors, T.nilable(InputFieldErrors)
    end

    # == Fields
    field :errors, [Types::InputFieldErrorType]
    field :user, Types::UserType

    # == Arguments
    argument :bio, String, required: false
    argument :user_id, ID, loads: Types::UserType

    # == Resolver
    sig { override.params(user: User, attributes: T.untyped).returns(Payload) }
    def resolve(user:, **attributes)
      authorize!(user, to: :update?)
      if user.update_without_password(**attributes)
        Payload.new(user:)
      else
        Payload.new(errors: user.input_field_errors)
      end
    end
  end
end
