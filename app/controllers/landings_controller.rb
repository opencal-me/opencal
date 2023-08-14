# typed: true
# frozen_string_literal: true

class LandingsController < ApplicationController
  # == Actions
  def show
    render(inertia: "LandingPage")
  end
end
