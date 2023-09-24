# typed: strict
# frozen_string_literal: true

module Types
  class GroupType < BaseObject
    # == Interfaces
    implements NodeType

    # == Fields
    field :activities, [ActivityType], null: false, authorized_scope: true
    field :handle, String, null: false
    field :is_joined_by_viewer, Boolean, null: false
    field :is_managed_by_viewer, Boolean, null: false
    field :memberships, [GroupMembershipType],
          null: false,
          authorized_scope: true
    field :name, String, null: false
    field :url, String, null: false

    # == Resolvers
    sig { returns(T::Enumerable[Activity]) }
    def activities
      activities = object.activities.where("UPPER(during) >= ?", 12.hours.ago)
      activities.order(:during)
    end

    sig { returns(T::Boolean) }
    def is_joined_by_viewer # rubocop:disable Naming/PredicateName
      if (user = active_user)
        object.memberships.exists?(member: user)
      else
        false
      end
    end

    sig { returns(T::Boolean) }
    def is_managed_by_viewer # rubocop:disable Naming/PredicateName
      if (user = active_user)
        object.memberships.exists?(member: user, admin: true)
      else
        false
      end
    end

    sig { returns(String) }
    def url
      group_url(object)
    end

    # == Helpers
    sig { override.returns(Group) }
    def object = super
  end
end
