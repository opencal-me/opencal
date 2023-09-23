# typed: strict
# frozen_string_literal: true

module Mutations
  class DeleteGroup < BaseMutation
    # == Payload
    class Payload < T::Struct; end

    # == Arguments
    argument :group_id, ID, loads: Types::GroupType

    # == Resolver
    sig { override.params(group: Group).returns(Payload) }
    def resolve(group:)
      authorize!(group, to: :Delete?)
      group.destroy!
      Payload.new
    end
  end
end
