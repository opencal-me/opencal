# typed: true
# frozen_string_literal: true

class LandingpagesController < ApplicationController
  # == Actions
  def show
    render(inertia: "LandingPage")
  end
end
