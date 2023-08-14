# typed: true
# frozen_string_literal: true

class CreateActivities < ActiveRecord::Migration[7.0]
  def change
    create_table :activities, id: :uuid do |t|
      t.string :title, null: false
      t.string :description
      t.string :google_event_id, null: false
      t.belongs_to :owner,
                   null: false,
                   foreign_key: { to_table: "users" },
                   type: :uuid
      t.tstzrange :during, null: false
      t.string :where
      t.st_point :location, geographic: true

      t.timestamps
    end
    add_index :activities, :google_event_id, unique: true
    add_index :activities, :location, using: :gist
  end
end
