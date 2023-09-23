# typed: true
# frozen_string_literal: true

class GroupPolicy < ApplicationPolicy
  # == Rules
  def index? = false

  def show?
    user = authenticate!
    group = T.cast(record, Group)
    membership = group.memberships.find_by!(member: user)
    membership.admin?
  end

  # == Aliases
  alias_rule :manage?, to: :show?

  # == Scopes
  relation_scope do |relation|
    if (user = active_user)
      relation.merge(user.groups)
    else
      relation.none
    end
  end
end
