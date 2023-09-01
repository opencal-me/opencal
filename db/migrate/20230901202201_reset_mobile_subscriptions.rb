# typed: true
# frozen_string_literal: true

class ResetMobileSubscriptions < ActiveRecord::Migration[7.0]
  def up
    MobileSubscription.destroy_all
  end
end
