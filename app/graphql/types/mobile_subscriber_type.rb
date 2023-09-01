# typed: strict
# frozen_string_literal: true

module Types
  class MobileSubscriberType < BaseObject
    # == Interfaces
    implements NodeType

    # == Fields
    field :phone, String, null: false

    # == Resolvers
    sig { returns(String) }
    def phone
      Phonelib.parse(object.phone).international
    end

    # == Helpers
    sig { override.returns(MobileSubscriber) }
    def object = super
  end
end
