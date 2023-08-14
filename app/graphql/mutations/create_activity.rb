# typed: true
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
    sig { override.params(attributes: T.untyped).returns(Payload) }
    def resolve(**attributes)
      user = current_user!
      activity = user.activities.build(**attributes)
      if activity.save
        Payload.new(activity:)
      else
        Payload.new(errors: activity.input_field_errors)
      end
    end
  end
end
