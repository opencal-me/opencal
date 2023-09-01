# typed: strict
# frozen_string_literal: true

module Queries
  class Reservation < BaseQuery
    include AllowsFailedLoads

    # == Type
    type Types::ReservationType, null: true

    # == Arguments
    argument :id, ID, loads: Types::ReservationType, as: :reservation

    # == Resolver
    sig do
      params(reservation: T.nilable(::Reservation))
        .returns(T.nilable(::Reservation))
    end
    def resolve(reservation:)
      return unless reservation
      reservation if allowed_to?(:show?, reservation)
    end
  end
end
