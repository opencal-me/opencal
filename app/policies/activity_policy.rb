# typed: true
# frozen_string_literal: true

class ActivityPolicy < ApplicationPolicy
  # == Rules
  def index? = false

  def manage?
    user = authenticate!
    activity = T.cast(record, Activity)
    activity.owner! == user
  end
end
