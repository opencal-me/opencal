# typed: true
# frozen_string_literal: true

class ReservationPolicy < ApplicationPolicy
  # == Rules
  def index? = false

  def manage?
    user = authenticate!
    reservation = T.cast(record, Reservation)
    reservation.activity!.owner! == user
  end
end
