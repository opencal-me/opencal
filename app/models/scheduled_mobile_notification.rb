# frozen_string_literal: true

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
#
# Foreign Keys
#
#  fk_rails_...  (activity_id => activities.id)
#  fk_rails_...  (subscriber_id => mobile_subscribers.id)
#

class ScheduledMobileNotification < ApplicationRecord
  include Identifiable

  # == Associations
  belongs_to :activity
  belongs_to :subscriber
end
