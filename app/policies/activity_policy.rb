# typed: true
# frozen_string_literal: true

class ActivityPolicy < ApplicationPolicy
  # == Aliases
  alias_rule :show?, to: :manage?

  # == Rules
  def index? = false

  def manage?
    user = authenticate!
    activity = T.cast(record, Activity)
    activity.owner! == user
  end
end
