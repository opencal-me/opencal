# typed: true
# frozen_string_literal: true

class CreateGoogleCalendarChannels < ActiveRecord::Migration[7.0]
  def change
    create_table :google_calendar_channels, id: :uuid do |t|
      t.belongs_to :owner,
                   null: false,
                   foreign_key: { to_table: "users" },
                   type: :uuid
      t.string :calendar_id, null: false, index: { unique: true }
      t.string :resource_id, null: false, index: { unique: true }
      t.string :token, null: false, index: { unique: true }
      t.timestamptz :expires_at, null: false

      t.timestamps
    end
  end
end
