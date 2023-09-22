# typed: strict
# frozen_string_literal: true

# == Schema Information
#
# Table name: groups
#
#  id         :uuid             not null, primary key
#  handle     :string           not null
#  name       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  owner_id   :uuid             not null
#
# Indexes
#
#  index_groups_on_handle    (handle) UNIQUE
#  index_groups_on_owner_id  (owner_id)
#
# Foreign Keys
#
#  fk_rails_...  (owner_id => users.id)
#
class Group < ApplicationRecord
  extend FriendlyId
  include Identifiable

  # == FriendlyId
  friendly_id :name, slug_column: :handle

  # == Associations
  belongs_to :owner, class_name: "User"
  has_many :memberships, class_name: "GroupMembership", dependent: :destroy
  has_many :members, through: :memberships
end
