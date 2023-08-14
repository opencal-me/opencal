# typed: true
# frozen_string_literal: true

module Types
  class GoogleEventType < BaseObject
    # == Fields
    field :description, String
    # field :description_html, String
    field :activity, ActivityType
    field :duration_seconds, Integer, null: false
    field :end, DateTimeType, null: false, method: :end_time
    field :id, String, null: false
    field :location, String
    field :start, DateTimeType, null: false, method: :start_time
    field :title, String, null: false
    field :viewer_is_organizer, Boolean, null: false

    # == Resolvers
    sig { returns(T.nilable(Activity)) }
    def activity
      Activity.find_by(google_event_id: object.id)
    end

    sig { returns(T.nilable(String)) }
    def description
      if (doc = description_doc)
        texts = doc.search("//text()").map do |node|
          node.text.split("\n").map(&:strip).join("\n").gsub("\n\n", "\n")
        end
        texts.join("\n")
      end
    end

    sig { returns(Integer) }
    def duration_seconds
      object.duration.to_i
    end

    sig { returns(T::Boolean) }
    def viewer_is_organizer
      if (attendees = object.attendees)
        attendees.any? { |attendee| attendee["organizer"] }
      else
        true
      end
    end

    # sig { returns(T.nilable(String)) }
    # def description_html
    #   description_doc&.to_html
    # end

    # == Helpers
    sig { override.returns(Google::Event) }
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
