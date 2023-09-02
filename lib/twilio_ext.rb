# typed: strict
# frozen_string_literal: true

module Twilio
  class << self
    extend T::Sig

    # == Accessors
    sig { returns(T.nilable(String)) }
    def number
      return @number if defined?(@number)
      @number = T.let(@number, T.nilable(String))
      @number = if (number = ENV["TWILIO_NUMBER"])
        Phonelib.parse(number).to_s
      end
    end

    sig { returns(String) }
    def number!
      number or raise "Twilio number not set"
    end
  end
end
