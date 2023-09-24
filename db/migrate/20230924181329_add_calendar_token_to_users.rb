# rubocop:disable Rails/SkipsModelValidations
# typed: true
# frozen_string_literal: true

class AddCalendarTokenToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :calendar_token, :string
    User.find_each do |user|
      user.update_column("calendar_token", Devise.friendly_token)
    end
    change_column_null :users, :calendar_token, false
  end
end
