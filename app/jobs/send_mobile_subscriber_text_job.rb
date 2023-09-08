# typed: strict
# frozen_string_literal: true

class SendMobileSubscriberTextJob < ApplicationJob
  # == Job
  sig { params(subscriber: MobileSubscriber, message: String).void }
  def perform(subscriber, message)
    subscriber.send_text(message)
  end
end
