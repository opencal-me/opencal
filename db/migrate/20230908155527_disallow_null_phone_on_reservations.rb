# typed: true
# frozen_string_literal: true

class DisallowNullPhoneOnReservations < ActiveRecord::Migration[7.0]
  def change
    Reservation
      .where(phone: nil)
      .update_all(phone: Reservation::MISSING_PHONE_VALUE) # rubocop:disable Rails/SkipsModelValidations, Layout/LineLength
    change_column_null :reservations, :phone, false
  end
end
