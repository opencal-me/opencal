# typed: true
# frozen_string_literal: true

class HomepagesController < ApplicationController
  # == Actions
  def show
    render(inertia: "HomePage")
  end
end
