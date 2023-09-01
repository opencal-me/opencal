# typed: strict
# frozen_string_literal: true

class SendMobileSubscriberMessageJob < ApplicationJob
  # == Job
  sig { params(subscriber: MobileSubscriber, message: String).void }
  def perform(subscriber:, message:)
    subscriber.send_message(message)
  end
end
