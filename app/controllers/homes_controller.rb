# typed: true
# frozen_string_literal: true

class HomesController < ApplicationController
  # == Filters
  before_action :authenticate_user!

  # == Actions
  def show
    render(inertia: "HomePage")
  end
end
