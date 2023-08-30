# typed: true
# frozen_string_literal: true

class AddGoogleCalendarTokensToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :google_calendar_next_sync_token, :string
    add_column :users, :google_calendar_next_page_token, :string
    rename_column :users,
                  :google_calendar_last_imported_at,
                  :google_calendar_last_synced_at
  end
end
