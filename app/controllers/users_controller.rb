# typed: true
# frozen_string_literal: true

class UsersController < ApplicationController
  # == Filters
  before_action :set_user

  # == Actions
  def show
    user = T.must(@user)
    authorize!(user, to: :show?)
    data = query!("UserPageQuery", { user_id: user.to_gid.to_s })
    render(inertia: "UserPage", props: { data: })
  end

  private

  # == Filter Handlers
  sig { void }
  def set_user
    @user = T.let(@user, T.nilable(User))
    @user = User.friendly.find(params[:id])
  end
end
