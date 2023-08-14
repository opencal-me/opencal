# typed: true
# frozen_string_literal: true

class CreateReservations < ActiveRecord::Migration[7.0]
  def change
    create_table :reservations, id: :uuid do |t|
      t.belongs_to :activity, null: false, foreign_key: true, type: :uuid
      t.string :name, null: false
      t.string :email, null: false
      t.string :status, null: false

      t.timestamps
    end
  end
end
