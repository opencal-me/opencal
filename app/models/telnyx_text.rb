# typed: strict
# frozen_string_literal: true

module TelnyxText
  class << self
    extend T::Sig

    # == Methods
    sig { params(message: String, to: String).void }
    def send(message, to:)
      response = HTTParty.post(
        "https://api.telnyx.com/v2/messages",
        default_request_options.deep_merge({
          headers: {
            "Content-Type" => "application/json",
          },
          body: {
            type: "SMS",
            text: message,
            from: Telnyx.number!,
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
      { headers: { "Authorization" => "Bearer #{Telnyx.api_key!}" } }
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
