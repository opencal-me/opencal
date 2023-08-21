# typed: true
# frozen_string_literal: true

class GoogleCalendarChannelsController < ApplicationController
  # == Filters
  protect_from_forgery with: :null_session
  before_action :set_channel

  # == Actions
  def callback
    channel = T.must(@channel)
    if request.headers["X-Goog-Channel-Token"] != channel.token
      raise "Invalid token"
    end
    if request.headers["X-Goog-Resource-State"] == "sync"
      head(:no_content) and return
    end
    Activity.import_for_user_later(channel.owner!)
    head(:no_content)
  end

  private

  # == Filter Handlers
  sig { void }
  def set_channel
    @channel = T.let(@channel, T.nilable(GoogleCalendarChannel))
    @channel = GoogleCalendarChannel.find(params[:id])
  end
end
