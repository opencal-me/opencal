# typed: strict
# frozen_string_literal: true

module Queries
  class BootedAt < BaseQuery
    # == Configuration
    description "When the server was booted."

    # == Type
    type Types::DateTimeType, null: false

    # == Resolver
    sig { returns(T.nilable(Time)) }
    def resolve
      OpenCal.application.booted_at
    end
  end
end
