# typed: true
# frozen_string_literal: true

class AddGoogleRefreshTokenToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :google_refresh_token, :string, null: false
  end
end
