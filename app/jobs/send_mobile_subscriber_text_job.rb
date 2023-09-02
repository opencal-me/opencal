# typed: strict
# frozen_string_literal: true

class SendMobileSubscriberTextJob < ApplicationJob
  # == Job
  sig do
    params(
      subscriber: MobileSubscriber,
      message: String,
      options: T.untyped,
    ).void
  end
  def perform(subscriber, message, **options)
    subscriber.send_text(message, **options.compact)
  end
end
