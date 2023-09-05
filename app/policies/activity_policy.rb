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

  # == Scopes
  relation_scope do |relation|
    if (user = active_user)
      relation.where(owner: user)
    else
      relation.merge(Activity.publicly_visible)
    end
  end
end
