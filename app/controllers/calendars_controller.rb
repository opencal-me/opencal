# typed: true
# frozen_string_literal: true

class CalendarsController < ApplicationController
  # == Filters
  before_action :authenticate_user!

  # == Actions
  def show
    user = current_user!
    respond_to do |format|
      format.ics do
        cal = Icalendar::Calendar.new
        cal.ip_name = "opencal"
        user.activities.includes(:reservations).find_each do |activity|
          cal.event do |event|
            activity.save_to_icalendar_event(event)
          end
        end
        user.groups.includes(activities: :reservations).find_each do |group|
          group.activities.find_each do |activity|
            cal.event do |event|
              activity.save_to_icalendar_event(event)
            end
          end
        end
        cal.publish
        render(plain: cal.to_ical)
      end
    end
  end
end
