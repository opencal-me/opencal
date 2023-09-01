# typed: strict
# frozen_string_literal: true

class ApplicationMailer < ActionMailer::Base
  extend T::Sig
  extend T::Helpers
  include GraphQL::Querying

  # == Configuration
  default from: :default_sender, reply_to: ENV["RAILS_MAILER_REPLY_TO"]
  layout "mailer"

  # == Querying
  sig { override.returns(T.nilable(T.any(User, Symbol))) }
  def current_user = :system

  private

  # == Helpers
  sig { params(value: T.untyped).returns(T.untyped) }
  def compute_default(value)
    value.is_a?(Symbol) ? send(value) : super
  end

  sig { returns(String) }
  def default_sender
    ENV["RAILS_MAILER_FROM"] or raise "Missing default from address"
  end

  sig { returns(String) }
  def notifications_email
    Notifications.email!
  end
end
