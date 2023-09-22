# typed: true
# frozen_string_literal: true

class CreateGroups < ActiveRecord::Migration[7.0]
  def change
    create_table :groups, id: :uuid do |t|
      t.string :name, null: false
      t.string :handle, null: false, index: { unique: true }
      t.belongs_to :owner,
                   type: :uuid,
                   foreign_key: {
                     to_table: "users",
                   },
                   null: false

      t.timestamps
    end
  end
end
