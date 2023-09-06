# typed: true
# frozen_string_literal: true

class AddUniqueIndexToScheduledMobileNotifications < ActiveRecord::Migration[7.0] # rubocop:disable Layout/LineLength
  def change
    add_index :scheduled_mobile_notifications,
              %i[activity_id subscriber_id],
              unique: true,
              name: "index_scheduled_mobile_notifications_uniqueness"
  end
end
