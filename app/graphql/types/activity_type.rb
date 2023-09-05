# typed: strict
# frozen_string_literal: true

module Types
  class ActivityType < BaseObject
    include ActionView::Helpers::SanitizeHelper

    # == Interfaces
    implements NodeType

    # == Fields
    field :address, String
    field :address_place_name, String
    field :coordinates, CoordinatesType
    field :description_html, String
    field :duration_seconds, Integer, null: false
    field :end, DateTimeType, null: false, resolver_method: :resolve_end
    field :google_event_id, String, null: false
    # field :handle, String, null: false, method: :to_param
    field :is_owned_by_viewer, Boolean, null: false
    field :join_url, String, null: false
    field :location, String
    field :name, String, null: false
    field :openings, Integer, null: false
    field :owner, UserType, null: false
    field :reservations, [ReservationType], null: false, authorized_scope: true
    field :share_url, String, null: false
    field :start, DateTimeType, null: false
    field :story_image_url, String, null: false
    field :tags, [String], null: false
    field :url, String, null: false

    # == Resolvers
    sig { returns(T.nilable(String)) }
    def address
      address = object.address or return
      address.values_at(:street_address, :city, :country).compact.join(", ")
    end

    sig { returns(T.nilable(String)) }
    def address_place_name
      object.address&.place_name
    end

    sig { returns(T.nilable(String)) }
    def description_html
      object.description_html(view_context: controller!.view_context)
    end

    sig { returns(T::Boolean) }
    def is_owned_by_viewer # rubocop:disable Naming/PredicateName
      object.owner == current_user
    end

    sig { returns(T.untyped) }
    def join_url
      join_activity_url(object)
    end

    sig { returns(T::Enumerable[Reservation]) }
    def reservations
      object.reservations.chronological
    end

    sig { returns(Time) }
    def resolve_end = object.end

    sig { returns(String) }
    def story_image_url
      story_activity_url(object, format: :png)
    end

    sig { returns(String) }
    def share_url
      share_activity_url(object)
    end

    sig { returns(String) }
    def url
      activity_url(object)
    end

    # == Helpers
    sig { override.returns(Activity) }
    def object = super

    private

    # == Helpers
    sig { returns(T.nilable(Nokogiri::HTML::Document)) }
    def description_doc
      description = object.description or return
      Nokogiri::HTML.parse(description)
    end
  end
end
