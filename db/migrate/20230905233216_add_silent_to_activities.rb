# typed: true
# frozen_string_literal: true

class AddSilentToActivities < ActiveRecord::Migration[7.0]
  def change
    add_column :activities, :silent, :boolean
    Activity.update_all(silent: false) # rubocop:disable Rails/SkipsModelValidations, Layout/LineLength
    change_column_null :activities, :silent, false
  end
end
