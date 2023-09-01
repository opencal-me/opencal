# typed: strict
# frozen_string_literal: true

module Types
  class ReservationType < BaseObject
    # == Interfaces
    implements NodeType

    # == Fields
    field :activity, ActivityType, null: false
    field :created_at, DateTimeType, null: false
    field :email, String, null: false
    field :name, String, null: false
    field :phone, String
    field :status, ReservationStatusType, null: false

    # == Resolvers
    sig { returns(Symbol) }
    def status
      object.status.to_sym
    end

    # == Helpers
    sig { override.returns(Reservation) }
    def object = super
  end
end
