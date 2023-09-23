# typed: strict
# frozen_string_literal: true

module Mutations
  class CreateGroup < BaseMutation
    # == Payload
    class Payload < T::Struct
      const :group, T.nilable(Group)
      const :errors, T.nilable(InputFieldErrors)
    end

    # == Fields
    field :errors, [Types::InputFieldErrorType]
    field :group, Types::GroupType

    # == Arguments
    argument :handle, String
    argument :name, String

    # == Resolver
    sig { override.params(attributes: T.untyped).returns(Payload) }
    def resolve(**attributes)
      owner = current_user!
      group = owner.owned_groups.build(**attributes)
      if group.save
        Payload.new(group:)
      else
        Payload.new(errors: group.input_field_errors)
      end
    end
  end
end
