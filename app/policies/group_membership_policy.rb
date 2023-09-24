# typed: true
# frozen_string_literal: true

class GroupMembershipPolicy < ApplicationPolicy
  # == Rules
  def index? = false
  def show? = false

  # == Scopes
  relation_scope do |relation|
    relation
    # if (user = active_user)
    #   relation.where(group: user.groups)
    # else
    #   relation.none
    # end
  end
end
