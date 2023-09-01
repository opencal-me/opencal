# typed: strict
# frozen_string_literal: true

module Types
  class QueryType < BaseObject
    # Add `node` and `nodes` fields.
    include GraphQL::Types::Relay::HasNodeField
    include GraphQL::Types::Relay::HasNodesField

    # == Queries
    field :test_echo, resolver: Queries::TestEcho

    field :activity_status, resolver: Queries::ActivityStatus
    field :announcement, resolver: Queries::Announcement
    field :booted_at, resolver: Queries::BootedAt
    field :contact_email, resolver: Queries::ContactEmail
    field :image_by_signed_id, resolver: Queries::ImageBySignedId
    field :password_strength, resolver: Queries::PasswordStrength

    field :activity, resolver: Queries::Activity
    field :mobile_subscription, resolver: Queries::MobileSubscription
    field :reservation, resolver: Queries::Reservation
    field :user, resolver: Queries::User
    field :viewer, resolver: Queries::Viewer
  end
end
