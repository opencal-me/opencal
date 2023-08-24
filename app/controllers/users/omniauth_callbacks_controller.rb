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

    # GET|POST /user/auth/google/callback
    def google
      user = User.from_google_auth!(auth)
      if user.google_refresh_token?
        set_flash_message(:notice, :success, kind: "Google")
        sign_in_and_redirect(user)
      else
        redirect_to(new_user_session_path(refresh: true))
      end
    end

    protected

    # == Helpers
    sig { override.params(scope: T.untyped).returns(String) }
    def after_omniauth_failure_path_for(scope)
      root_path(scope)
    end

    private

    # == Helpers
    sig { params(resource_or_scope: T.untyped).returns(String) }
    def after_sign_in_path_for(resource_or_scope)
      home_path
    end

    sig { returns(OmniAuth::AuthHash) }
    def auth
      request.env.fetch("omniauth.auth")
    end
  end
end
