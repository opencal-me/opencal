# typed: strict
# frozen_string_literal: true

require "application_system_test_case"

class LandingPageTest < ApplicationSystemTestCase
  test "renders" do
    visit(root_path)
    assert_text("opencal")
  end
end
