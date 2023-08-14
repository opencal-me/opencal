# typed: true
# frozen_string_literal: true

class ActivitiesController < ApplicationController
  # == Filters
  before_action :set_activity

  # == Actions
  def show
    activity = T.must(@activity)
    if params[:id] == activity.to_param
      authorize!(activity, to: :show?)
      data = query!("ActivityPageQuery", { activity_id: activity.to_gid.to_s })
      render(inertia: "ActivityPage", props: { data: })
    else
      redirect_to(activity_path(activity))
    end
  end

  private

  # == Filter Handlers
  sig { void }
  def set_activity
    @activity = T.let(@activity, T.nilable(Activity))
    @activity = scoped do
      id = params[:id].split("--").last
      Activity.friendly.find(id)
    end
  end
end
