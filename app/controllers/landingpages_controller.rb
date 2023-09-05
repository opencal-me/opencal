# typed: true
# frozen_string_literal: true

class LandingpagesController < ApplicationController
  skip_before_action :store_user_location!

  # == Actions
  def show
    render(inertia: "LandingPage")
  end
end
