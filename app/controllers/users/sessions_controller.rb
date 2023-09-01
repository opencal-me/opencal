# typed: true
# frozen_string_literal: true

module Users
  class SessionsController < Devise::SessionsController
    # == Actions
    # GET /<resource>/login
    def new
      if request.referer&.start_with?(root_url)
        render(
          inertia: "UserLoginPage",
          props: {
            "authorizeAction" =>
              user_google_omniauth_authorize_path(prompt: "consent"),
          },
        )
      else
        redirect_to(root_path)
      end
    end

    # POST /<resource>/login
    def create
      self.resource = warden.authenticate!(auth_options)
      sign_in(resource_name, resource)
      set_flash_message!(:notice, :signed_in)
      redirect_to(after_sign_in_path_for(resource))
    end

    # == Helpers
    # sig { override.params(resource_or_scope: T.untyped).returns(String) }
    # def after_sign_out_path_for(resource_or_scope)
    #   stored_location_for(resource_or_scope) || super
    # end

    protected

    # == Helpers
    sig { override.returns(T.nilable(User)) }
    def resource = super
  end
end
