# typed: strict
# frozen_string_literal: true

class TelnyxClient
  extend T::Sig
  include HTTParty
  include Singleton

  # == Configuration
  base_uri "https://api.telnyx.com/v2"
  headers "Content-Type" => "application/json"

  # == Current
  sig { returns(TelnyxClient) }
  def self.current = instance

  # == Methods
  sig { params(message: String, to: String).void }
  def send_message(message, to:)
    response = HTTParty.post(
      "https://api.telnyx.com/v2/messages",
      request_options({
        body: {
          type: "SMS",
          text: message,
          from: Telnyx.number!,
          to: Phonelib.parse(to).to_s,
        }.to_json,
      }),
    )
    raise_response_errors(response)
  end

  private

  # == Helpers
  sig { returns(T::Hash[Symbol, T.untyped]) }
  def default_request_options
    { headers: { "Authorization" => "Bearer #{Telnyx.api_key!}" } }
  end

  sig do
    params(options: T::Hash[Symbol, T.untyped])
      .returns(T::Hash[Symbol, T.untyped])
  end
  def request_options(options = {})
    default_request_options.deep_merge(options)
  end

  sig { params(response: T.untyped).void }
  def raise_response_errors(response)
    if (errors = response["errors"])
      errors = T.let(errors, T::Array[T::Hash[String, T.untyped]])
      message = errors.first!.fetch("detail")
      raise "Telnyx error: #{message}"
    end
  end
end
