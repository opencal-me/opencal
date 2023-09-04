# typed: true
# frozen_string_literal: true

class HomepagesController < ApplicationController
  # == Filters
  before_action :authenticate_user!
  before_action :import_activities if Rails.env.development?

  # == Actions
  def show
    render(inertia: "HomePage")
  end

  private

  # == Filter Handlers
  def import_activities
    Activity.import_for_user!(current_user!)
  end
end
