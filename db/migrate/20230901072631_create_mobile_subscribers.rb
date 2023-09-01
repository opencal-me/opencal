# typed: true
# frozen_string_literal: true

class CreateMobileSubscribers < ActiveRecord::Migration[7.0]
  def change
    create_table :mobile_subscribers, id: :uuid do |t|
      t.string :phone, index: { unique: true }

      t.timestamps
    end
  end
end
