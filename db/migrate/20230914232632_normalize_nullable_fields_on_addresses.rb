# rubocop:disable Rails/SkipsModelValidations
# typed: true
# frozen_string_literal: true

class NormalizeNullableFieldsOnAddresses < ActiveRecord::Migration[7.0]
  def change
    Address.where(city: "").update_all(city: nil)
    Address.where(neighbourhood: "").update_all(neighbourhood: nil)
    Address.where(place_name: "").update_all(place_name: nil)
    Address.where(postal_code: "").update_all(postal_code: nil)
    Address.where(street_address: "").update_all(street_address: nil)
  end
end
