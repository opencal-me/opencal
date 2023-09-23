# typed: strict
# frozen_string_literal: true

module Mutations
  class UpdateGroup < BaseMutation
    # == Payload
    class Payload < T::Struct
      const :group, T.nilable(Group)
      const :errors, T.nilable(InputFieldErrors)
    end

    # == Fields
    field :errors, [Types::InputFieldErrorType]
    field :group, Types::GroupType

    # == Arguments
    argument :group_id, ID, loads: Types::GroupType
    argument :name, String

    # == Resolver
    sig do
      override.params(group: Group, attributes: T.untyped).returns(Payload)
    end
    def resolve(group:, **attributes)
      authorize!(group, to: :update?)
      if group.update(**attributes)
        Payload.new(group:)
      else
        Payload.new(errors: group.input_field_errors)
      end
    end
  end
end
