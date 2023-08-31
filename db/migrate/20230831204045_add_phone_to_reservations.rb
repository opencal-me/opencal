# typed: true
# frozen_string_literal: true

class AddPhoneToReservations < ActiveRecord::Migration[7.0]
  def change
    add_column :reservations, :phone, :string
  end
end
