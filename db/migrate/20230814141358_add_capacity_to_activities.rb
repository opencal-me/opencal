# typed: true
# frozen_string_literal: true

class AddCapacityToActivities < ActiveRecord::Migration[7.0]
  def change
    add_column :activities, :capacity, :integer
    Activity.update_all(capacity: 5) # rubocop:disable Rails/SkipsModelValidations, Layout/LineLength
    change_column_null :activities, :capacity, false
  end
end
