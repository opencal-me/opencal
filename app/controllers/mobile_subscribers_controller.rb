# typed: true
# frozen_string_literal: true

class MobileSubscribersController < ApplicationController
  # == Filters
  before_action :set_subscriber

  # == Actions
  def activities
    subscriber = T.must(@subscriber)
    render(plain: "should show activities for #{subscriber.formatted_phone}")
  end

  private

  # == Filter Handlers
  sig { void }
  def set_subscriber
    @subscriber = T.let(@subscriber, T.nilable(MobileSubscriber))
    if (phone = params[:id])
      @subscriber = MobileSubscriber.find_by_phone!(phone)
    end
  end
end
