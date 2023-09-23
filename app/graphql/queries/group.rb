# typed: strict
# frozen_string_literal: true

module Queries
  class Group < BaseQuery
    include AllowsFailedLoads

    # == Type
    type Types::GroupType, null: true

    # == Arguments
    argument :id, ID, loads: Types::GroupType, as: :group

    # == Resolver
    sig do
      params(group: T.nilable(::Group)).returns(T.nilable(::Group))
    end
    def resolve(group:)
      return unless group
      group if allowed_to?(:show?, group)
    end
  end
end
