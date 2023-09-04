# typed: true
# frozen_string_literal: true

class AddNoteToReservations < ActiveRecord::Migration[7.0]
  def change
    add_column :reservations, :note, :text
  end
end
