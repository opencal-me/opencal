# typed: true
# frozen_string_literal: true

class MobileSubscriptionPolicy < ApplicationPolicy
  # == Rules
  def show? = false
  def index? = false
end
