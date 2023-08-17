# typed: true
# frozen_string_literal: true

class AddUniquenessConstraintToReservations < ActiveRecord::Migration[7.0]
  def change
    up_only { Reservation.destroy_all }
    add_index :reservations, %i[activity_id email],
              unique: true,
              name: "index_reservations_uniqueness"
  end
end
