# typed: true
# frozen_string_literal: true

class AddGoogleUidToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :google_uid, :string,
               null: false,
               index: { unique: true }
  end
end
