# typed: true
# frozen_string_literal: true

# == Schema Information
#
# Table name: reservations
#
#  id          :uuid             not null, primary key
#  email       :string           not null
#  name        :string           not null
#  status      :string           not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  activity_id :uuid             not null
#
# Indexes
#
#  index_reservations_on_activity_id  (activity_id)
#
# Foreign Keys
#
#  fk_rails_...  (activity_id => activities.id)
#
class Reservation < ApplicationRecord
  include Identifiable

  # == Associations
  belongs_to :activity

  sig { returns(Activity) }
  def activity!
    activity or raise ActiveRecord::RecordNotFound, "Missing activity"
  end

  sig { returns(Google::Event) }
  def google_event!
    activity!.google_event!
  end

  # == Validations
  validates :name, presence: true, length: { maximum: 129 }
  validates :email, presence: true, length: { maximum: 100 }, email: true
end
