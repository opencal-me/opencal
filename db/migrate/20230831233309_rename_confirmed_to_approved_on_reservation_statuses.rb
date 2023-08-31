# typed: true
# frozen_string_literal: true

class RenameConfirmedToApprovedOnReservationStatuses < ActiveRecord::Migration[7.0] # rubocop:disable Layout/LineLength
  def up
    Reservation.where(status: "confirmed").update_all(status: "approved") # rubocop:disable Rails/SkipsModelValidations, Layout/LineLength
  end
end
