# typed: true
# frozen_string_literal: true

module Types
  class ActivityType < BaseObject
    # == Interfaces
    implements NodeType

    # == Fields
    field :address, String
    field :coordinates, CoordinatesType
    field :description, String
    field :end, DateTimeType, null: false, resolver_method: :resolve_end
    field :google_event_id, String, null: false
    field :location, String
    field :owner, UserType, null: false
    field :start, DateTimeType, null: false
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
    def description
      if (doc = description_doc)
        texts = doc.search("//text()").map do |node|
          node.text.split("\n").map(&:strip).join("\n").gsub(/(\n{2,})/, "\n\n")
        end
        texts.join("\n")
      end
    end

    sig { returns(Time) }
    def resolve_end = object.end

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
        Nokogiri::HTML(description)
      end
    end
  end
end
