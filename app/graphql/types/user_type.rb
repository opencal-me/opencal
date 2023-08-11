# typed: true
# frozen_string_literal: true

module Types
  class UserType < BaseObject
    # == Interfaces
    implements NodeType

    # == Fields
    field :avatar_url, String
    field :email, String, null: false
    field :first_name, String, null: false
    field :is_admin, Boolean, null: false, method: :admin?
    field :last_name, String
    field :name, String, null: false

    # == Helpers
    sig { override.returns(User) }
    def object = super
  end
end
