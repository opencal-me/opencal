# typed: true
# frozen_string_literal: true

class AddDefaultValueToTitleOnActivities < ActiveRecord::Migration[7.0]
  def change
    change_column_default :activities, :title, from: nil, to: ""
  end
end
