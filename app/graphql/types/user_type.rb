# typed: true
# frozen_string_literal: true

module Types
  class UserType < BaseObject
    # == Interfaces
    implements NodeType

    # == Fields
    field :activities, [ActivityType], null: false
    field :avatar_url, String
    field :email, String, null: false
    field :first_name, String, null: false
    field :google_events, [GoogleEventType], null: false do
      argument :query, String, required: false
    end
    field :is_admin, Boolean, null: false, method: :admin?
    field :last_name, String
    field :name, String, null: false

    # == Resolvers
    sig { returns(Activity::PrivateAssociationRelation) }
    def activities
      object.activities.where("LOWER(during) >= NOW()")
    end

    sig { params(query: T.nilable(String)).returns(T::Array[Google::Event]) }
    def google_events(query: nil)
      object.google_events(query:)
    end

    # == Helpers
    sig { override.returns(User) }
    def object = super
  end
end
