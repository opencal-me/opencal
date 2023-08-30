# typed: true
# frozen_string_literal: true

class RemoveSilentTagFromActivities < ActiveRecord::Migration[7.0]
  def up
    Activity.where.contains(tags: ["silent"])
      .update_all("tags = ARRAY_REMOVE(tags, 'silent')") # rubocop:disable Rails/SkipsModelValidations, Layout/LineLength
  end
end
