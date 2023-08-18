# typed: true
# frozen_string_literal: true

module Google
  class Calendar
    def save_event(event)
      method = event.new_event? ? :post : :put
      body = event.use_quickadd? ? nil : event.to_json
      params = {
        "supportsAttachments" => true,
        "sendNotifications" => event.send_notifications?,
      }
      query_string = if event.use_quickadd?
        "/quickAdd?#{params.to_query}&text=#{event.title}"
      elsif event.new_event?
        "?#{params.to_query}"
      else # update existing event.
        "/#{event.id}?#{params.to_query}"
      end
      send_events_request(query_string, method, body)
    end
  end

  class Event
    attr_accessor :attachments

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

    def attachments_attributes
      return [] unless @attachments
      attachments = @attachments.map do |attachment|
        attachment.slice("fileUrl")
      end
      { "attachments" => attachments }
    end
  end
end
