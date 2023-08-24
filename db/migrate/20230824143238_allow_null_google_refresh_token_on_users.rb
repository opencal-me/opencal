# typed: true
# frozen_string_literal: true

class AllowNullGoogleRefreshTokenOnUsers < ActiveRecord::Migration[7.0]
  def change
    change_column_null :users, :google_refresh_token, true
  end
end
