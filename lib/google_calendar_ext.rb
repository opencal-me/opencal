# typed: true
# frozen_string_literal: true

module Google
  class Calendar
    extend T::Sig

    sig { params(event: Event).returns(T.untyped) }
    def save_event(event)
      method = event.new_event? ? :post : :put
      body = event.use_quickadd? ? nil : event.to_json
      params = { "supportsAttachments" => true }
      params["sendUpdates"] = "all" if event.send_notifications?
      query_string = if event.use_quickadd?
        "/quickAdd?#{params.to_query}&text=#{event.title}"
      elsif event.new_event?
        "?#{params.to_query}"
      else # update existing event.
        "/#{event.id}?#{params.to_query}"
      end
      send_events_request(query_string, method, body)
    end

    sig { params(event: Event).returns(T.untyped) }
    def delete_event(event)
      params = {}
      params["sendUpdates"] = "all" if event.send_notifications?
      send_events_request("/#{event.id}?#{params.to_query}", :delete)
    end

    sig do
      params(options: T::Hash[T.any(String, Symbol), T.untyped])
        .returns(T.untyped)
    end
    def watch_events(options)
      content = { "type" => "webhook", **options }
      response = send_events_request("/watch", :post, content.to_json)
      JSON.parse(response.body)
    end

    sig { params(id: String, resource_id: String).returns(T.untyped) }
    def stop_channel(id:, resource_id:)
      content = { "id" => id, "resourceId" => resource_id }
      @connection.send("/channels/stop", :post, content.to_json) # rubocop:disable Performance/StringIdentifierArgument, Layout/LineLength
    end
  end

  class Event
    extend T::Sig

    sig { returns(T.nilable(T::Array[T::Hash[String, T.untyped]])) }
    attr_accessor :attachments

    sig { params(e: T.untyped, calendar: Calendar).returns(Event) }
    def self.new_from_feed(e, calendar)
      params = {}
      %w(id status description location creator transparency updated reminders
         attendees visibility attachments).each do |p|
           params[p.to_sym] = e[p]
         end

      params[:raw] = e
      params[:calendar] = calendar
      params[:title] = e["summary"]
      params[:color_id] = e["colorId"]
      params[:extended_properties] = e["extendedProperties"]
      params[:guests_can_invite_others] = e["guestsCanInviteOthers"]
      params[:guests_can_see_other_guests] = e["guestsCanSeeOtherGuests"]
      params[:html_link] = e["htmlLink"]
      params[:start_time] = Event.parse_json_time(e["start"])
      params[:end_time] = Event.parse_json_time(e["end"])
      params[:recurrence] = Event.parse_recurrence_rule(e["recurrence"])

      Event.new(params)
    end

    sig { returns(String) }
    def to_json
      attributes = {
        "summary" => title,
        "visibility" => visibility,
        "transparency" => transparency,
        "description" => description,
        "location" => location,
        "start" => time_or_all_day(start_time),
        "end" => time_or_all_day(end_time),
        "reminders" => reminders_attributes,
        "guestsCanInviteOthers" => guests_can_invite_others,
        "guestsCanSeeOtherGuests" => guests_can_see_other_guests,
      }
      if id
        attributes["id"] = id
      end
      if timezone_needed?
        attributes["start"].merge!(local_timezone_attributes)
        attributes["end"].merge!(local_timezone_attributes)
      end
      attributes.merge!(recurrence_attributes)
      attributes.merge!(color_attributes)
      attributes.merge!(attendees_attributes)
      attributes.merge!(attachments_attributes)
      attributes.merge!(extended_properties_attributes)
      JSON.generate(attributes)
    end

    sig { returns(T::Hash[String, T.untyped]) }
    def attachments_attributes
      return {} unless @attachments
      attachments = @attachments.map do |attachment|
        attachment.slice("fileUrl")
      end
      { "attachments" => attachments }
    end
  end
end
