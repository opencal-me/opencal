# typed: true
# frozen_string_literal: true

class ReservationPolicy < ApplicationPolicy
  # == Rules
  def index? = false

  def manage?
    user = authenticate!
    reservation = T.cast(record, Reservation)
    reservation.activity!.owner! == user
  end

  # == Aliases
  alias_method :show?, :manage?

  # == Scopes
  relation_scope do |relation|
    if (user = active_user)
      relation.where(activity: user.activities)
    else
      relation.none
    end
  end
end
