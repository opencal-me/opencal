# typed: strict
# frozen_string_literal: true

module Mutations
  class AddMobileSubscriber < BaseMutation
    # == Payload
    class Payload < T::Struct
      const :subscriber, T.nilable(MobileSubscriber)
      const :errors, T.nilable(InputFieldErrors)
    end

    # == Fields
    field :errors, [Types::InputFieldErrorType]
    field :subscriber, Types::MobileSubscriberType

    # == Arguments
    argument :phone, String
    argument :subject_id, ID, loads: Types::UserType

    # == Resolver
    sig do
      override.params(subject: User, phone: String).returns(Payload)
    end
    def resolve(subject:, phone:)
      subscriber = MobileSubscriber.find_or_initialize_by_phone(phone)
      unless subscriber.save
        return Payload.new(errors: subscriber.input_field_errors)
      end
      begin
        subject.mobile_subscriptions.create!(subscriber:)
      rescue ActiveRecord::RecordInvalid => error
        if (error = error.record.errors.group_by_attribute[:subscriber].first)
          if error.type == :taken
            subscriber.errors.add(:phone, :taken, message: error.message)
            return Payload.new(errors: subscriber.input_field_errors)
          end
        end
        super
      end
      Payload.new(subscriber:)
    end
  end
end
