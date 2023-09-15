# typed: strict
# frozen_string_literal: true

# == Schema Information
#
# Table name: addresses
#
#  id             :uuid             not null, primary key
#  city           :string
#  country        :string           not null
#  full_address   :string           not null
#  neighbourhood  :string
#  place_name     :string
#  postal_code    :string
#  province       :string           not null
#  street_address :string
#  created_at     :datetime         not null
#  activity_id    :uuid             not null
#
# Indexes
#
#  index_addresses_on_activity_id  (activity_id)
#
# Foreign Keys
#
#  fk_rails_...  (activity_id => activities.id)
#
class Address < ApplicationRecord
  include Identifiable

  # == Associations
  belongs_to :activity

  # == Validations
  removes_blank :city, :neighbourhood, :place_name, :postal_code,
                :street_address
end
