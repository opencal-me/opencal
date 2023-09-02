# typed: strict
# frozen_string_literal: true

module TwilioText
  class << self
    extend T::Sig

    # == Methods
    sig { params(message: String, to: String).void }
    def send(message, to:)
      client.messages.create(
        from: Twilio.number!,
        to: Phonelib.parse(to).to_s,
        body: message,
      )
    end

    private

    # == Helpers
    sig { returns(Twilio::REST::Client) }
    def client
      @client = T.let(@client, T.nilable(Twilio::REST::Client))
      @client ||= Twilio::REST::Client.new
    end
  end
end
