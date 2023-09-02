# typed: strict
# frozen_string_literal: true

module Types
  class GoogleEventType < BaseObject
    # == Fields
    field :activity, ActivityType
    field :description_html, String
    field :duration_seconds, Integer, null: false
    field :end, DateTimeType, null: false, method: :end_time
    field :id, String, null: false
    field :is_organized_by_viewer, Boolean, null: false
    field :is_recurring, Boolean, null: false
    field :location, String
    field :start, DateTimeType, null: false, method: :start_time
    field :title, String

    # == Resolvers
    sig { returns(T.nilable(Activity)) }
    def activity
      Activity.find_by(google_event_id: object.id)
    end

    sig { returns(T.nilable(String)) }
    def description_html
      description = object.description or return
      Activity.parse_description_as_html(
        description,
        view_context: controller!.view_context,
      )
    end

    sig { returns(Integer) }
    def duration_seconds
      object.duration.to_i
    end

    sig { returns(T::Boolean) }
    def is_organized_by_viewer # rubocop:disable Naming/PredicateName
      Activity.google_event_organized_by_user?(object, current_user!)
    end

    sig { returns(T::Boolean) }
    def is_recurring # rubocop:disable Naming/PredicateName
      object.recurring_event_id.present?
    end

    # == Helpers
    sig { override.returns(Google::Event) }
    def object = super
  end
end
