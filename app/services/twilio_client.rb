# typed: strict
# frozen_string_literal: true

class TwilioClient
  extend T::Sig
  include Singleton

  # == Initializer
  sig { void }
  def initialize
    @client = T.let(Twilio::REST::Client.new, Twilio::REST::Client)
  end

  # == Methods
  sig { params(message: String, to: String).void }
  def send_message(message, to:)
    @client.messages.create(
      from: Twilio.number!,
      to: Phonelib.parse(to).to_s,
      body: message,
    )
  end

  sig { params(message: String, to: String).void }
  def self.send_message(message, to:)
    instance.send_message(message, to: to)
  end
end
