# typed: true
# frozen_string_literal: true

module Types
  class ActivityType < BaseObject
    # == Interfaces
    implements NodeType

    # == Fields
    field :address, String
    field :coordinates, CoordinatesType
    field :description_html, String
    field :end, DateTimeType, null: false, resolver_method: :resolve_end
    field :google_event_id, String, null: false
    field :handle, String, null: false, method: :to_param
    field :location, String
    field :openings, Integer, null: false
    field :owner, UserType, null: false
    field :reservations, [ReservationType], null: false
    field :start, DateTimeType, null: false
    field :story_image_url, String, null: false
    field :title, String, null: false
    field :url, String, null: false

    # == Resolvers
    sig { returns(T.nilable(String)) }
    def address
      if (address = object.address)
        address.values_at(:street_address, :city, :country).compact.join(", ")
      end
    end

    sig { returns(T.nilable(String)) }
    def description_html
      if (doc = description_doc)
        doc.search("//body").inner_html
      end
    end

    sig { returns(Time) }
    def resolve_end = object.end

    sig { returns(String) }
    def story_image_url
      story_activity_url(object, format: :png)
    end

    sig { returns(String) }
    def title
      object.title.delete_suffix(" [open]")
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
      if (description = object.description)
        Nokogiri::HTML.parse(description)
      end
    end
  end
end
