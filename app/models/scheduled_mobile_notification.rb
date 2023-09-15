# typed: strict
# frozen_string_literal: true

# rubocop:disable Layout/LineLength
#
# == Schema Information
#
# Table name: scheduled_mobile_notifications
#
#  id            :uuid             not null, primary key
#  deliver_after :datetime         not null
#  delivered_at  :datetime
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  activity_id   :uuid             not null
#  subscriber_id :uuid             not null
#
# Indexes
#
#  index_scheduled_mobile_notifications_on_activity_id    (activity_id)
#  index_scheduled_mobile_notifications_on_deliver_after  (deliver_after)
#  index_scheduled_mobile_notifications_on_subscriber_id  (subscriber_id)
#  index_scheduled_mobile_notifications_uniqueness        (activity_id,subscriber_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (activity_id => activities.id)
#  fk_rails_...  (subscriber_id => mobile_subscribers.id)
#
# rubocop:enable Layout/LineLength
class ScheduledMobileNotification < ApplicationRecord
  include Identifiable

  # == Attributes
  sig { returns(T::Boolean) }
  def delivered?
    delivered_at?
  end

  # == Associations
  belongs_to :activity
  belongs_to :subscriber,
             class_name: "MobileSubscriber",
             inverse_of: :scheduled_notifications

  sig { returns(Activity) }
  def activity!
    activity or raise ActiveRecord::RecordNotFound, "Missing activity"
  end

  sig { returns(MobileSubscriber) }
  def subscriber!
    subscriber or raise ActiveRecord::RecordNotFound, "Missing subscriber"
  end

  # == Scopes
  scope :pending_delivery, -> {
    T.bind(self, PrivateRelation)
    where(delivered_at: nil)
  }

  scope :to_deliver, -> {
    T.bind(self, PrivateRelation)
    where(delivered_at: nil).where("NOW() > deliver_after")
      .includes(:subscriber, :activity)
      .references(:activity)
      .order("activities.during")
  }

  # == Texts
  sig { void }
  def self.send_texts
    notifications = to_deliver.to_a.group_by(&:subscriber!)
    notifications.each do |subscriber, notifications|
      send_subscriber_text(subscriber, notifications)
      transaction do
        notifications.each do |notification|
          notification.update!(delivered_at: Time.current)
        end
      end
    end
  end

  sig { void }
  def self.send_texts_later
    SendScheduledMobileNotificationTextsJob.perform_later
  end

  sig { void }
  def send_text
    activity = activity!
    owner = activity.owner!
    time_zone = owner.time_zone
    start_time = activity.start_time.in_time_zone(time_zone)
    description =
      "heyo! #{owner.first_name.downcase} is starting #{activity.name} at "\
        "#{start_time.strftime("%-l:%M %p")}"
    cta = "wanna join? go to: #{join_activity_url(activity.friendly_id)}"
    subscriber!.send_text([description, cta].join("\n\n"))
  end

  private

  # == Helpers
  sig do
    params(
      subscriber: MobileSubscriber,
      notifications: T::Array[ScheduledMobileNotification],
    ).void
  end
  private_class_method def self.send_subscriber_text(subscriber, notifications)
    subscriber.send_text(subscriber_text_message(subscriber, notifications))
  end

  sig do
    params(
      subscriber: MobileSubscriber,
      notifications: T::Array[ScheduledMobileNotification],
    ).returns(String)
  end
  private_class_method def self.subscriber_text_message(
    subscriber,
    notifications
  )
    activities_url = Rails.application.routes.url_helpers
      .activities_mobile_subscriber_url(subscriber)
    description = if notifications.many?
      multi_activity_description(notifications)
    else
      single_activity_description(notifications.first!)
    end
    cta = "wanna join? go to: #{activities_url}"
    [description, cta].join("\n\n")
  end

  sig do
    params(notifications: T::Array[ScheduledMobileNotification])
      .returns(String)
  end
  private_class_method def self.multi_activity_description(notifications)
    activities = notifications.map(&:activity!)
    owners = User.where(id: activities.map(&:owner_id).uniq)
    owner_names = owners.map { |owner| owner.first_name.downcase }
    intro = [
      "heyo! #{owner_names.to_sentence}",
      owners.one? ? "has" : "have",
      "some things planned for today:",
    ].join(" ")
    activities = notifications.map do |notification|
      activity = notification.activity!
      time_zone = activity.owner!.time_zone
      start_time = activity.start_time.in_time_zone(time_zone)
      "  - #{activity.name} #{start_time.strftime("%-l:%M %p")}"
    end
    [intro, *activities].join("\n")
  end

  sig { params(notification: ScheduledMobileNotification).returns(String) }
  private_class_method def self.single_activity_description(notification)
    activity = notification.activity!
    owner = activity.owner!
    time_zone = owner.time_zone
    start_time = activity.start_time.in_time_zone(time_zone)
    "heyo! #{owner.first_name.downcase} is starting #{activity.name} at " \
      "#{start_time.strftime("%-l:%M %p")}"
  end
end
