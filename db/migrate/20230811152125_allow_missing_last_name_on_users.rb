# typed: true
# frozen_string_literal: true

class AllowMissingLastNameOnUsers < ActiveRecord::Migration[7.0]
  def change
    change_column_null :users, :last_name, true
  end
end
