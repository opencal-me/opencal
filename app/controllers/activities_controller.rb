# typed: true
# frozen_string_literal: true

class ActivitiesController < ApplicationController
  # == Filters
  before_action :set_activity
  before_action :import_activity if Rails.env.development?

  # == Actions
  def show
    activity = T.must(@activity)
    if allowed_to?(:manage?, activity)
      data = query!("ActivityPageQuery", { activity_id: activity.to_gid.to_s })
      render(inertia: "ActivityPage", props: { data: })
    else
      redirect_to(join_activity_path(activity.friendly_id))
    end
  end

  def join
    activity = T.must(@activity)
    if params[:id] == activity.friendly_id
      authorize!(activity, to: :show?)
      data = query!(
        "ActivityJoinPageQuery",
        { activity_id: activity.to_gid.to_s },
      )
      render(inertia: "ActivityJoinPage", props: { data: })
    else
      redirect_to(join_activity_path(activity.friendly_id))
    end
  end

  def share
    activity = T.must(@activity)
    authorize!(activity, to: :show?)
    data = query!(
      "ActivitySharePageQuery",
      { activity_id: activity.to_gid.to_s },
    )
    render(inertia: "ActivitySharePage", props: { data: })
  end

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

  # == Helpers
  sig { returns(Mutex) }
  def self.activity_story_image_semaphore
    @activity_story_image_semaphore ||= T.let(Mutex.new, T.nilable(Mutex))
  end

  private

  # == Helpers
  sig do
    returns(T.all(Selenium::WebDriver::Chrome::Driver,
                  Selenium::WebDriver::DriverExtensions::HasCDP))
  end
  def webdriver
    @webdriver ||= T.let(
      Selenium::WebDriver.for(
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
      ),
      T.nilable(T.all(Selenium::WebDriver::Chrome::Driver,
                      Selenium::WebDriver::DriverExtensions::HasCDP)),
    )
  end

  sig { params(activity: Activity).returns(T.untyped) }
  def activity_story_image(activity)
    self.class.activity_story_image_semaphore.synchronize do
      driver = webdriver
      driver.execute_cdp(
        "Emulation.setTimezoneOverride",
        "timezoneId" => activity.time_zone.name,
      )
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

  sig { void }
  def import_activity
    activity = T.must(@activity)
    activity.import!
  end
end
