# typed: true
# frozen_string_literal: true

class CreateSubscriptions < ActiveRecord::Migration[7.0]
  def change
    create_table :subscriptions, id: :uuid do |t|
      t.belongs_to :subscriber,
                   null: false,
                   foreign_key: { to_table: "users" },
                   type: :uuid
      t.belongs_to :subject,
                   null: false,
                   foreign_key: { to_table: "users" },
                   type: :uuid
      t.string :status, null: false

      t.timestamps
    end
  end
end
