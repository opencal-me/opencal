# typed: true
# frozen_string_literal: true

class RetryGeocodingActivities < ActiveRecord::Migration[7.0]
  def up
    Activity.where.missing(:address).find_each do |address|
      address.reverse_geocode
      address.save!
    end
  end
end
