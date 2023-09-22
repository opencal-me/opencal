# typed: strict
# frozen_string_literal: true

# == Schema Information
#
# Table name: group_memberships
#
#  id         :uuid             not null, primary key
#  admin      :boolean          not null
#  created_at :datetime         not null
#  group_id   :uuid             not null
#  member_id  :uuid             not null
#
# Indexes
#
#  index_group_memberships_on_group_id   (group_id)
#  index_group_memberships_on_member_id  (member_id)
#  index_group_memberships_uniqueness    (group_id,member_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (group_id => groups.id)
#  fk_rails_...  (member_id => users.id)
#
class GroupMembership < ApplicationRecord
  include Identifiable

  # == Attributes
  attribute :admin, :boolean, default: false

  # == Associations
  belongs_to :group, inverse_of: :memberships
  belongs_to :member, class_name: "User"
end
