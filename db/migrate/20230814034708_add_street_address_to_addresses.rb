# typed: true
# frozen_string_literal: true

class AddStreetAddressToAddresses < ActiveRecord::Migration[7.0]
  def change
    add_column :addresses, :street_address, :string
    rename_column :addresses, :formatted_address, :full_address
  end
end
