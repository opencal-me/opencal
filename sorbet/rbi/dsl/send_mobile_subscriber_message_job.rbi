# typed: true

# DO NOT EDIT MANUALLY
# This is an autogenerated file for dynamic methods in `SendMobileSubscriberMessageJob`.
# Please instead update this file by running `bin/tapioca dsl SendMobileSubscriberMessageJob`.

class SendMobileSubscriberMessageJob
  class << self
    sig do
      params(
        subscriber: ::MobileSubscriber,
        message: ::String
      ).returns(T.any(SendMobileSubscriberMessageJob, FalseClass))
    end
    def perform_later(subscriber, message); end

    sig { params(subscriber: ::MobileSubscriber, message: ::String).void }
    def perform_now(subscriber, message); end
  end
end
