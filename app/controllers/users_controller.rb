# typed: true
# frozen_string_literal: true

class UsersController < ApplicationController
  # == Filters
  before_action :set_user
  before_action :import_activities if Rails.env.development?

  # == Actions
  def show
    user = T.must(@user)
    authorize!(user, to: :show?)
    data = query!("UserPageQuery", { user_id: user.to_gid.to_s })
    render(inertia: "UserPage", props: { data: })
  end

  def calendar
    user = T.must(@user)
    respond_to do |format|
      format.ics do
        raise "Invalid token" if user.calendar_token != params[:token]
        cal = Icalendar::Calendar.new
        cal.append_custom_property("x_wr_calname", "opencal")
        cal.source = calendar_user_url(
          user,
          format: :ics,
          token: user.calendar_token,
        )
        cal.refresh_interval = 1.hour.iso8601
        user.all_activities.includes(:reservations).find_each do |activity|
          cal.event do |event|
            activity.save_to_icalendar_event(event)
          end
        end
        cal.publish
        render(plain: cal.to_ical)
      end
    end
  end

  private

  # == Filter Handlers
  sig { void }
  def set_user
    @user = T.let(@user, T.nilable(User))
    @user = User.friendly.find(params[:id])
  end

  sig { void }
  def import_activities
    user = @user or return
    Activity.import_for_user!(user)
  end
end
