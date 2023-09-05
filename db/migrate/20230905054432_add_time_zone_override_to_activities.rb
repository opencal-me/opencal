# typed: true
# frozen_string_literal: true

class AddTimeZoneOverrideToActivities < ActiveRecord::Migration[7.0]
  def change
    add_column :activities, :time_zone_override, :string
  end
end
