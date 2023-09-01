# typed: true
# frozen_string_literal: true

# == Schema Information
#
# Table name: mobile_subscribers
#
#  id         :uuid             not null, primary key
#  phone      :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_mobile_subscribers_on_phone  (phone) UNIQUE
#
class MobileSubscriber < ApplicationRecord
  include Identifiable

  # == Associations
  has_many :subscriptions,
           class_name: "MobileSubscription",
           inverse_of: :subscriber,
           foreign_key: :subscriber_id,
           dependent: :destroy
  has_many :subscribes_to, through: :subscriptions, source: :subject

  # == Normalizations
  before_validation :normalize_phone

  # == Validations
  validates :phone, presence: true, phone: { possible: true }

  # == Finders
  sig { params(phone: String).returns(MobileSubscriber) }
  def self.find_or_initialize_by_phone(phone)
    find_or_initialize_by(phone: Phonelib.parse(phone).to_s)
  end

  private

  # == Normalization Handlers
  sig { void }
  def normalize_phone
    if (phone = self.phone)
      self.phone = Phonelib.parse(phone).to_s
    end
  end
end
