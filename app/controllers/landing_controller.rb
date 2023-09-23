# typed: true
# frozen_string_literal: true

class LandingController < ApplicationController
  skip_before_action :store_user_location!

  # == Actions
  def show
    render(inertia: "LandingPage")
  end
end
