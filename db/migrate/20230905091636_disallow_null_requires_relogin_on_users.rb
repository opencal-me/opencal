# typed: true
# frozen_string_literal: true

class DisallowNullRequiresReloginOnUsers < ActiveRecord::Migration[7.0]
  def change
    User.where(requires_relogin: nil).update_all(requires_relogin: false) # rubocop:disable Rails/SkipsModelValidations, Layout/LineLength
    change_column_null :users, :requires_relogin, false
  end
end
