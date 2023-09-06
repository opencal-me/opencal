# typed: strict
# frozen_string_literal: true

module Mutations
  class CreateActivity < BaseMutation
    # == Payload
    class Payload < T::Struct
      const :activity, Activity
    end

    # == Fields
    field :activity, Types::ActivityType, null: false

    # == Arguments
    argument :description, String, required: false
    argument :duration_seconds, Integer
    argument :location, String, required: false
    argument :name, String
    argument :start, Types::DateTimeType

    # == Resolver
    sig do
      override.params(
        name: String,
        start: Time,
        duration_seconds: Integer,
        location: T.nilable(String),
        description: T.nilable(String),
      ).returns(Payload)
    end
    def resolve(
      name:,
      start:,
      duration_seconds:,
      location: nil,
      description: nil
    )
      owner = current_user!
      google_event = owner.create_google_event!(
        title: [name, "[open]"].join(" "),
        during: start..(start + duration_seconds),
        location: location.presence,
        description: description.presence,
      )
      activity = Activity.from_google_event(google_event, owner:)
      begin
        activity.save!
      rescue
        google_event.delete
        raise
      end
      Payload.new(activity:)
    end
  end
end
