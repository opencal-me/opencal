# typed: true
# frozen_string_literal: true

class AddUniquenessIndicesToSubscriptions < ActiveRecord::Migration[7.0]
  def change
    add_index :subscriptions, %i[subscriber_id subject_id],
              unique: true,
              name: "index_subscriptions_uniqueness"
    add_index :mobile_subscriptions, %i[subscriber_id subject_id],
              unique: true,
              name: "index_mobile_subscriptions_uniqueness"
  end
end
