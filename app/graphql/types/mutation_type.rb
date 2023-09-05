# typed: strict
# frozen_string_literal: true

module Types
  class MutationType < BaseObject
    # == Mutations
    field :test_mutation, mutation: Mutations::TestMutation

    # field :request_user_email_verification,
    #       mutation: Mutations::RequestUserEmailVerification
    # field :request_user_password_reset,
    #       mutation: Mutations::RequestUserPasswordReset
    # field :update_user_email, mutation: Mutations::UpdateUserEmail
    field :update_user, mutation: Mutations::UpdateUser

    field :create_mobile_subscription,
          mutation: Mutations::CreateMobileSubscription
    field :delete_mobile_subscription,
          mutation: Mutations::DeleteMobileSubscription

    field :convert_google_event, mutation: Mutations::ConvertGoogleEvent
    field :create_activity, mutation: Mutations::CreateActivity
    field :create_reservation, mutation: Mutations::CreateReservation
  end
end
