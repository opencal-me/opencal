# typed: true

# DO NOT EDIT MANUALLY
# This is an autogenerated file for dynamic methods in `SendMobileSubscriberTextJob`.
# Please instead update this file by running `bin/tapioca dsl SendMobileSubscriberTextJob`.

class SendMobileSubscriberTextJob
  class << self
    sig do
      params(
        subscriber: ::MobileSubscriber,
        message: ::String,
        options: T.untyped
      ).returns(T.any(SendMobileSubscriberTextJob, FalseClass))
    end
    def perform_later(subscriber, message, **options); end

    sig { params(subscriber: ::MobileSubscriber, message: ::String, options: T.untyped).void }
    def perform_now(subscriber, message, **options); end
  end
end