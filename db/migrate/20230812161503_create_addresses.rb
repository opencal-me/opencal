# typed: true
# frozen_string_literal: true

class CreateAddresses < ActiveRecord::Migration[7.0]
  def change
    create_table :addresses, id: :uuid do |t|
      t.belongs_to :activity, null: false, foreign_key: true, type: :uuid
      t.string :city
      t.string :country, null: false
      t.string :province, null: false
      t.string :postal_code
      t.string :neighbourhood
      t.string :formatted_address, null: false
      t.timestamptz :created_at, null: false
    end
  end
end
