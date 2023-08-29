# typed: true
# frozen_string_literal: true

class AddHandleToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :handle, :string
    add_index :users, :handle, unique: true
    up_only { User.find_each(&:save!) }
    change_column_null :users, :handle, false
  end
end
