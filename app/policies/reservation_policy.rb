# typed: true
# frozen_string_literal: true

class ReservationPolicy < ApplicationPolicy
  # == Aliases
  alias_method :show?, :manage?

  # == Rules
  def index? = false

  def manage?
    user = authenticate!
    reservation = T.cast(record, Reservation)
    reservation.activity!.owner! == user
  end

  # == Scopes
  relation_scope do |relation|
    if (user = active_user)
      relation.where(activity: user.activities)
    else
      relation.none
    end
  end
end
