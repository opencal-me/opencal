# typed: true
# frozen_string_literal: true

module Types
  class UserType < BaseObject
    # == Interfaces
    implements NodeType

    # == Fields
    field :activities, [ActivityType], null: false do
      argument :show_hidden, Boolean, required: false
      argument :show_recently_ended, Boolean, required: false
    end
    field :avatar_url, String
    field :email, String, null: false
    field :first_name, String, null: false
    field :google_events, [GoogleEventType], null: false do
      argument :query, String, required: false
    end
    field :initials, String, null: false
    field :is_admin, Boolean, null: false, method: :admin?
    field :is_viewer, Boolean, null: false
    field :last_name, String
    field :name, String, null: false
    field :url, String, null: false

    # == Resolvers
    sig do
      params(
        show_hidden: T.nilable(T::Boolean),
        show_recently_ended: T.nilable(T::Boolean),
      ).returns(T::Enumerable[Activity])
    end
    def activities(show_hidden: nil, show_recently_ended: nil)
      cutoff = Time.current
      cutoff -= 12.hours if show_recently_ended
      activities = object.activities.where("UPPER(during) >= ?", cutoff)
      unless show_hidden
        activities = activities.merge(Activity.hidden.invert_where)
      end
      activities.order(:during)
    end

    sig { params(query: T.nilable(String)).returns(T::Array[Google::Event]) }
    def google_events(query: nil)
      object.google_events!(query:)
    end

    sig { returns(T::Boolean) }
    def is_viewer # rubocop:disable Naming/PredicateName
      object == current_user
    end

    sig { returns(String) }
    def url
      user_url(object)
    end

    # == Helpers
    sig { override.returns(User) }
    def object = super
  end
end
