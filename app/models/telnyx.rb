# typed: strict
# frozen_string_literal: true

module Telnyx
  class << self
    extend T::Sig

    sig { returns(T.nilable(String)) }
    def api_key
      ENV["TELNYX_API_KEY"]
    end

    sig { returns(String) }
    def api_key!
      api_key or raise "Telnyx API key not set"
    end

    sig { returns(T.nilable(String)) }
    def app_id
      ENV["TELNYX_APP_ID"]
    end

    sig { returns(String) }
    def app_id!
      app_id or raise "Telnyx app ID not set"
    end

    sig { returns(T.nilable(String)) }
    def number
      return @number if defined?(@number)
      @number = T.let(@number, T.nilable(String))
      @number = if (number = ENV["TELNYX_NUMBER"])
        Phonelib.parse(number).to_s
      end
    end

    sig { returns(String) }
    def number!
      number or raise "Telnyx number not set"
    end

    sig { params(message: String, to: String).void }
    def send_message(message, to:)
      response = HTTParty.post(
        "https://api.telnyx.com/v2/messages",
        default_request_options.deep_merge({
          headers: {
            "Content-Type" => "application/json",
          },
          body: {
            type: "SMS",
            text: message.downcase,
            from: number!,
            to: Phonelib.parse(to).to_s,
          }.to_json,
        }),
      )
      handle_response_errors(response)
    end

    private

    # == Helpers
    sig { returns(T::Hash[Symbol, T.untyped]) }
    def default_request_options
      { headers: { "Authorization" => "Bearer #{api_key}" } }
    end

    sig { params(response: T.untyped).returns(NilClass) }
    def handle_response_errors(response)
      if (errors = response["errors"])
        errors = T.let(errors, T::Array[T::Hash[String, T.untyped]])
        message = errors.first!.fetch("detail")
        raise "Telnyx error: #{message}"
      end
    end
  end
end
