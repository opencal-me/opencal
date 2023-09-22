# typed: true
# frozen_string_literal: true

class CreateGroupMemberships < ActiveRecord::Migration[7.0]
  def change
    create_table :group_memberships, id: :uuid do |t|
      t.belongs_to :group, null: false, foreign_key: true, type: :uuid
      t.belongs_to :member,
                   null: false,
                   foreign_key: { to_table: "users" },
                  type: :uuid
      t.boolean :admin, null: false

      t.timestamptz :created_at, null: false
      t.index %i[group_id member_id],
              name: "index_group_memberships_uniqueness",
              unique: true
    end
  end
end
