# typed: true
# frozen_string_literal: true

module Types
  class UserType < BaseObject
    # == Interfaces
    implements NodeType

    # == Fields
    field :activities, [ActivityType], null: false do
      argument :show_recently_ended, Boolean, required: false
      argument :timezone, String
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
        timezone: String,
        show_recently_ended: T.nilable(T::Boolean),
      ).returns(Activity::PrivateAssociationRelation)
    end
    def activities(timezone:, show_recently_ended: nil)
      cutoff = if show_recently_ended
        Time.current.in_time_zone(timezone).beginning_of_day
      else
        Time.current.in_time_zone(timezone)
      end
      object.activities.where("UPPER(during) >= ?", cutoff)
    end

    sig { params(query: T.nilable(String)).returns(T::Array[Google::Event]) }
    def google_events(query: nil)
      events = object.google_events!(query:)
      Activity.import_events!(events, owner: object) if Rails.env.development?
      events
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
