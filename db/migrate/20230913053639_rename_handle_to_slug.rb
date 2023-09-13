# typed: true
# frozen_string_literal: true

class RenameHandleToSlug < ActiveRecord::Migration[7.0]
  def change
    rename_column :activities, :handle, :slug
    rename_column :users, :handle, :slug
  end
end
