# typed: true
# frozen_string_literal: true

class GroupsController < ApplicationController
  # == Filters
  before_action :set_group

  # == Actions
  def show
    group = T.must(@group)
    data = query!("GroupPageQuery", { group_id: group.to_gid.to_s })
    render(inertia: "GroupPage", props: { data: })
  end

  private

  # == Filter Handlers
  sig { void }
  def set_group
    @group = T.let(@group, T.nilable(Group))
    @group = Group.friendly.find(params[:id])
  end
end
