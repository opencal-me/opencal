# typed: strict
# frozen_string_literal: true

module Mutations
  class CreateActivity < BaseMutation
    # == Payload
    class Payload < T::Struct
      const :activity, T.nilable(Activity)
      const :errors, T.nilable(InputFieldErrors)
    end

    # == Fields
    field :activity, Types::ActivityType
    field :errors, [Types::InputFieldErrorType]

    # == Arguments
    argument :google_event_id, String

    # == Resolver
    sig { override.params(google_event_id: String).returns(Payload) }
    def resolve(google_event_id:)
      owner = current_user!
      event = owner.google_event!(google_event_id)
      activity = Activity.from_google_event(event, owner:)
      if activity.save
        Payload.new(activity:)
      else
        Payload.new(errors: activity.input_field_errors)
      end
    end
  end
end
