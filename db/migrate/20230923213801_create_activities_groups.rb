# typed: true
# frozen_string_literal: true

class CreateActivitiesGroups < ActiveRecord::Migration[7.0]
  def change
    create_table :activities_groups, id: :uuid do |t|
      t.belongs_to :group, null: false, foreign_key: true, type: :uuid
      t.belongs_to :activity, null: false, foreign_key: true, type: :uuid
      t.index %i[group_id activity_id],
              unique: true,
              name: "index_activities_groups_uniqueness"
    end
  end
end
