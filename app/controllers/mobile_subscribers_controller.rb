# typed: true
# frozen_string_literal: true

class MobileSubscribersController < ApplicationController
  # == Filters
  before_action :set_subscriber
  before_action :import_activities if Rails.env.development?

  # == Actions
  def activities
    subscriber = T.must(@subscriber)
    authorize!(subscriber, to: :show?)
    data = query!(
      "MobileSubscriberActivitiesPageQuery",
      { subscriber_id: subscriber.to_gid.to_s },
    )
    render(inertia: "MobileSubscriberActivitiesPage", props: { data: })
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

  def import_activities
    Activity.import_for_user!(current_user!)
  end
end
