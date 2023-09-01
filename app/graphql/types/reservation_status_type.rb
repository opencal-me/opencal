# typed: strict
# frozen_string_literal: true

module Types
  class ReservationStatusType < BaseEnum
    # == Values
    value "PENDING", value: :pending
    value "CONFIRMED", value: :confirmed
    value "REJECTED", value: :rejected
  end
end
