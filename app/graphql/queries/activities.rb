# typed: strict
# frozen_string_literal: true

module Queries
  class Activities < BaseQuery
    # == Type
    type [Types::ActivityType], null: false

    # == Resolver
    sig do
      returns(T::Enumerable[::Activity])
    end
    def resolve
      ::Activity.publicly_visible
        .where("UPPER(during) >= NOW()")
        .order(:during)
    end
  end
end
