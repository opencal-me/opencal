# typed: strict
# frozen_string_literal: true

module Types
  class MobileSubscriberType < BaseObject
    # == Interfaces
    implements NodeType

    # == Fields
    field :activities, [ActivityType], null: false
    field :phone, String, null: false, method: :formatted_phone

    # == Resolvers
    sig { returns(T::Enumerable[Activity]) }
    def activities
      Activity
        .where(owner: object.subscribes_to)
        .merge(Activity.hidden.invert_where)
        .where("UPPER(during) >= ?", Time.current)
        .where("LOWER(during) < ?", 1.day.from_now)
        .order(:during)
    end

    # == Helpers
    sig { override.returns(MobileSubscriber) }
    def object = super
  end
end
