# typed: strict
# frozen_string_literal: true

module Mutations
  class CreateMobileSubscription < BaseMutation
    # == Payload
    class Payload < T::Struct
      const :subscription, T.nilable(MobileSubscription)
      const :errors, T.nilable(InputFieldErrors)
    end

    # == Fields
    field :errors, [Types::InputFieldErrorType]
    field :subscription, Types::MobileSubscriptionType

    # == Arguments
    argument :subject_id, ID, loads: Types::UserType
    argument :subscriber_phone, String

    # == Resolver
    sig do
      override.params(subject: User, subscriber_phone: String).returns(Payload)
    end
    def resolve(subject:, subscriber_phone:)
      subscriber = MobileSubscriber
        .find_or_initialize_by_phone(subscriber_phone)
      unless subscriber.save
        errors = InputFieldErrors.new
        subscriber.errors.group_by_attribute[:phone]&.each do |error|
          next unless error.attribute == :phone
          errors << InputFieldError.new(
            field: "subscriberPhone",
            message: error.full_message,
          )
        end
        return Payload.new(errors:)
      end
      subscription = subject.mobile_subscriptions.build(subscriber:)
      if subscription.save
        Payload.new(subscription:)
      else
        errors = InputFieldErrors.new
        subscription.errors.group_by_attribute[:subscriber]&.each do |error|
          errors << InputFieldError.new(
            field: "subscriberPhone",
            message: error.message,
          )
        end
        Payload.new(errors:)
      end
    end
  end
end
