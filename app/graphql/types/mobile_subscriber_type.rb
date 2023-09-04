# typed: strict
# frozen_string_literal: true

module Types
  class MobileSubscriberType < BaseObject
    # == Interfaces
    implements NodeType

    # == Fields
    field :phone, String, null: false, method: :formatted_phone

    # == Helpers
    sig { override.returns(MobileSubscriber) }
    def object = super
  end
end
