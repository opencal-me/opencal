# typed: true
# frozen_string_literal: true

class ActivitiesController < ApplicationController
  class << self
    sig { returns(Mutex) }
    def activity_story_image_semaphore
      @activity_story_image_semaphore = T.let(@activity_story_image_semaphore,
                                              T.nilable(Mutex))
      @activity_story_image_semaphore ||= Mutex.new
    end
  end

  # == Filters
  before_action :set_activity

  # == Actions
  def show
    activity = T.must(@activity)
    if params[:id] == activity.to_param
      authorize!(activity, to: :show?)
      data = query!("ActivityPageQuery", { activity_id: activity.to_gid.to_s })
      render(inertia: "ActivityPage", props: { data: })
    else
      redirect_to(activity_path(activity))
    end
  end

  # == Actions
  def story
    activity = T.must(@activity)
    respond_to do |format|
      format.html do
        data = query!("ActivityStoryPageQuery", {
          activity_id: activity.to_gid.to_s,
        })
        render(inertia: "ActivityStoryPage", props: { data: })
      end
      format.png do
        data = activity_story_image(activity)
        send_data(
          data,
          filename: "#{activity.to_param}.png",
          type: "image/png",
          disposition: "inline",
        )
      end
    end
  end

  private

  # == Helpers
  sig { returns(Selenium::WebDriver::Chrome::Driver) }
  def webdriver
    @webdriver = T.let(@webdriver,
                       T.nilable(Selenium::WebDriver::Chrome::Driver))
    @webdriver ||= Selenium::WebDriver.for(
      :chrome,
      options: Selenium::WebDriver::Chrome::Options.new.tap do |options|
        options = T.let(options, Selenium::WebDriver::Chrome::Options)
        options.add_argument("--headless")
        options.add_argument("--window-size=1080,1920")
        options.add_argument("--kiosk-printing")
        options.add_argument("--force-device-scale-factor=1.0")
        if OS.linux?
          options.add_argument("--no-sandbox")
          options.add_argument("--disable-dev-shm-usage")
        end
      end,
    )
  end

  sig { params(activity: Activity).returns(T.untyped) }
  def activity_story_image(activity)
    self.class.activity_story_image_semaphore.synchronize do
      require "selenium-webdriver"
      driver = webdriver
      driver.get(story_activity_url(activity))
      Selenium::WebDriver::Wait.new.until do
        driver.execute_script(
          "return window.performance.timing.loadEventEnd > 0",
        ) && driver.execute_script(
          'return window.performance.getEntriesByType("paint").length > 0',
        )
      end
      driver.screenshot_as(:png)
    end
  end

  # == Filter Handlers
  sig { void }
  def set_activity
    @activity = T.let(@activity, T.nilable(Activity))
    @activity = scoped do
      id = params[:id].split("--").last
      Activity.friendly.find(id)
    end
  end
end
