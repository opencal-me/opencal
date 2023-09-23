# typed: strict
# frozen_string_literal: true

module Types
  class GroupType < BaseObject
    # == Interfaces
    implements NodeType

    # == Fields
    field :handle, String, null: false
    field :memberships, [GroupMembershipType], null: false
    field :name, String, null: false
    field :url, String, null: false

    # == Resolvers
    sig { returns(String) }
    def url
      group_url(object)
    end

    # == Helpers
    sig { override.returns(Group) }
    def object = super
  end
end
