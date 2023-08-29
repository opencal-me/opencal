# typed: true
# frozen_string_literal: true

class AddNameAndTagsToActivities < ActiveRecord::Migration[7.0]
  def change
    add_column :activities, :name, :string, default: ""
    add_column :activities, :tags, :string, array: true, default: []
    add_index :activities, :tags
    up_only do
      Activity.find_each do |activity|
        name, tags = Activity.parse_title(activity.title)
        activity.update!(name:, tags:)
      end
    end
    change_column_null :activities, :name, false
    change_column_null :activities, :tags, false
  end
end
