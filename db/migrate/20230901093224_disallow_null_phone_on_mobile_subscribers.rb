# typed: true
# frozen_string_literal: true

class DisallowNullPhoneOnMobileSubscribers < ActiveRecord::Migration[7.0]
  def change
    change_column_null :mobile_subscribers, :phone, false
  end
end
