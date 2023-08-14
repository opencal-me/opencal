# typed: true
# frozen_string_literal: true

class RenameLocationToCoordinatesOnActivities < ActiveRecord::Migration[7.0]
  def change
    rename_column :activities, :location, :coordinates
    rename_column :activities, :where, :location
  end
end
