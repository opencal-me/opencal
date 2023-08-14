# typed: true
# frozen_string_literal: true

class AddHandleToActivity < ActiveRecord::Migration[7.0]
  def change
    add_column :activities, :handle, :string, null: false
    add_index :activities, :handle, unique: true
  end
end
