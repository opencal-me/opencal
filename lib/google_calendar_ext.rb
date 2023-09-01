# typed: true
# frozen_string_literal: true

module Google
  class Calendar
    extend T::Sig

    # == Methods
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

    # == Attributes
    sig { returns(T.nilable(String)) }
    attr_accessor :recurring_event_id

    sig { returns(T.nilable(T::Array[T::Hash[String, T.untyped]])) }
    attr_accessor :attachments

    # == Initializer
    sig { params(params: T::Hash[Symbol, T.untyped]).void }
    def initialize(params = {})
      %i[id status raw html_link title location calendar quickadd
         attendees description reminders recurrence start_time end_time color_id
         extended_properties guests_can_invite_others
         guests_can_see_other_guests send_notifications
         attachments recurring_event_id].each do |attribute|
           instance_variable_set("@#{attribute}", params[attribute])
         end

      self.visibility   = params[:visibility]
      self.transparency = params[:transparency]
      self.all_day      = params[:all_day] if params[:all_day]
      self.creator_name = params[:creator]["displayName"] if params[:creator]
      self.new_event_with_id_specified = !!params[:new_event_with_id_specified]
    end

    # == Builders
    sig { params(e: T.untyped, calendar: Calendar).returns(Event) }
    def self.new_from_feed(e, calendar)
      params = {}
      %w[id status description location creator transparency updated reminders
         attendees visibility attachments recurringEventId].each do |p|
           params[p.underscore.to_sym] = e[p]
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

    # == Serialization
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
