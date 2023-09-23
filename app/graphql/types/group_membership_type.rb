# typed: strict
# frozen_string_literal: true

module Types
  class GroupMembershipType < BaseObject
    # == Interfaces
    implements NodeType

    # == Fields
    field :group, GroupType, null: false
    field :is_admin, Boolean, null: false, method: :admin?
    field :member, UserType, null: false

    # == Helpers
    sig { override.returns(GroupMembership) }
    def object = super
  end
end
