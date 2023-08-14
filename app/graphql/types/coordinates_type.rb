# typed: true
# frozen_string_literal: true

module Types
  class CoordinatesType < BaseObject
    # == Fields
    field :latitude, Float, null: false
    field :longitude, Float, null: false

    # == Helpers
    sig { override.returns(RGeo::Geographic::SphericalPointImpl) }
    def object = super
  end
end
