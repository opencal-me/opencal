# typed: strict
# frozen_string_literal: true

class TelnyxClient
  extend T::Sig
  include HTTParty
  include Singleton

  # == Configuration
  base_uri "https://api.telnyx.com/v2"
  headers "Content-Type" => "application/json",
          "Authorization" => lambda { "Bearer #{Telnyx.api_key!}" }

  # == Methods
  sig { params(message: String, to: String).void }
  def send_message(message, to:)
    response = self.class.post("/messages", {
      body: {
        type: "SMS",
        text: message,
        from: Telnyx.number!,
        to: Phonelib.parse(to).to_s,
      }.to_json,
    })
    raise_response_errors(response)
  end

  sig { params(message: String, to: String).void }
  def self.send_message(message, to:)
    instance.send_message(message, to: to)
  end

  private

  # == Helpers
  sig { params(response: T.untyped).void }
  def raise_response_errors(response)
    if (errors = response["errors"])
      errors = T.let(errors, T::Array[T::Hash[String, T.untyped]])
      message = errors.first!.fetch("detail")
      raise "Telnyx error: #{message}"
    end
  end
end
