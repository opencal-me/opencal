# typed: strict
# frozen_string_literal: true

module Mutations
  class CreateGroupMembership < BaseMutation
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
    argument :member_id, ID, loads: Types::UserType

    # == Resolver
    sig { override.params(group: Group, member: User).returns(Payload) }
    def resolve(group:, member:)
      authorize!(group, to: :manage?)
      membership = group.memberships.build(member:)
      if membership.save
        Payload.new(membership:)
      else
        Payload.new(errors: group.input_field_errors)
      end
    end
  end
end
