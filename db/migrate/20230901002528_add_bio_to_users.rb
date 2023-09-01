# typed: true
# frozen_string_literal: true

class AddBioToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :bio, :text
  end
end
