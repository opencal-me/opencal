# typed: strict
# frozen_string_literal: true

module Mutations
  class CreateReservation < BaseMutation
    # == Payload
    class Payload < T::Struct
      const :reservation, T.nilable(Reservation)
      const :errors, T.nilable(InputFieldErrors)
    end

    # == Fields
    field :errors, [Types::InputFieldErrorType]
    field :reservation, Types::ReservationType

    # == Arguments
    argument :activity_id, ID, loads: Types::ActivityType
    argument :email, String
    argument :name, String
    argument :phone, String, required: false

    # == Resolver
    sig do
      override
        .params(activity: Activity, attributes: T.untyped)
        .returns(Payload)
    end
    def resolve(activity:, **attributes)
      reservation = activity.reservations.build(**attributes)
      if reservation.save
        Payload.new(reservation:)
      else
        Payload.new(errors: reservation.input_field_errors)
      end
    end
  end
end
