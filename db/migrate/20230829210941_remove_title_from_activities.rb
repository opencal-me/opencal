# typed: true
# frozen_string_literal: true

class RemoveTitleFromActivities < ActiveRecord::Migration[7.0]
  def change
    remove_column :activities, :title, :string
  end
end
