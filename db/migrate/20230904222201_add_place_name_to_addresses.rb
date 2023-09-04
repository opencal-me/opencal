# typed: true
# frozen_string_literal: true

class AddPlaceNameToAddresses < ActiveRecord::Migration[7.0]
  def change
    add_column :addresses, :place_name, :string
  end
end
