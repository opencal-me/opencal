# typed: true
# frozen_string_literal: true

class CreateMobileSubscriptions < ActiveRecord::Migration[7.0]
  def change
    create_table :mobile_subscriptions, id: :uuid do |t|
      t.belongs_to :subscriber,
                   null: false,
                   foreign_key: { to_table: "mobile_subscribers" },
                   type: :uuid
      t.belongs_to :subject,
                   null: false,
                   foreign_key: { to_table: "users" },
                   type: :uuid

      t.timestamptz :created_at, null: false
    end
  end
end
