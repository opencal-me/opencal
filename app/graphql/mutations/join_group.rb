# typed: strict
# frozen_string_literal: true

module Mutations
  class JoinGroup < BaseMutation
    # == Payload
    class Payload < T::Struct
      const :membership, T.nilable(GroupMembership)
      const :errors, T.nilable(InputFieldErrors)
    end

    # == Fields
    field :errors, [Types::InputFieldErrorType]
    field :membership, Types::GroupMembershipType

    # == Arguments
    argument :group_id, ID, loads: Types::GroupType

    # == Resolver
    sig { override.params(group: Group).returns(Payload) }
    def resolve(group:)
      member = current_user!
      membership = group.memberships.build(member:)
      if membership.save
        Payload.new(membership:)
      else
        Payload.new(errors: group.input_field_errors)
      end
    end
  end
end
