# typed: true
# frozen_string_literal: true

class CreateScheduledMobileNotifications < ActiveRecord::Migration[7.0]
  def change
    create_table :scheduled_mobile_notifications, id: :uuid do |t|
      t.belongs_to :activity, null: false, foreign_key: true, type: :uuid
      t.belongs_to :subscriber,
                   null: false,
                   foreign_key: { to_table: "mobile_subscribers" },
                   type: :uuid
      t.timestamptz :deliver_after, null: false, index: true
      t.timestamptz :delivered_at

      t.timestamps
    end
  end
end
