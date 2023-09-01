# typed: true
# frozen_string_literal: true

class AllowNullCapacityOnActivities < ActiveRecord::Migration[7.0]
  def change
    change_column_null :activities, :capacity, true
    Activity.update_all(capacity: nil) # rubocop:disable Rails/SkipsModelValidations, Layout/LineLength
  end
end
