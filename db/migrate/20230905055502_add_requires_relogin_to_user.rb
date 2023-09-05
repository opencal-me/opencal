# typed: true
# frozen_string_literal: true

class AddRequiresReloginToUser < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :requires_relogin, :boolean
    User.update_all(requires_relogin: true) # rubocop:disable Rails/SkipsModelValidations, Layout/LineLength
  end
end
