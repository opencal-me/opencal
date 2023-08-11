# typed: true
# frozen_string_literal: true

module Users
  # See: https://github.com/heartcombo/devise#omniauth
  class OmniauthCallbacksController < Devise::OmniauthCallbacksController
    extend T::Sig

    # == Filters
    before_action :authenticate_user!

    def initialize(*args)
      super
      @user = T.let(@user, T.nilable(User))
    end

    # GET /user/auth/google/callback
    def google
      user = User.from_google_auth!(auth)
      set_flash_message(:notice, :success, kind: "Google")
      sign_in_and_redirect(user)
    end

    private

    # == Helpers
    sig { returns(OmniAuth::AuthHash) }
    def auth
      request.env.fetch("omniauth.auth")
    end
  end
end
