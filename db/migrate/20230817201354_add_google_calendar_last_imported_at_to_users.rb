# typed: true
# frozen_string_literal: true

class AddGoogleCalendarLastImportedAtToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :google_calendar_last_imported_at, :timestamptz
    add_index :users, :google_calendar_last_imported_at
  end
end
