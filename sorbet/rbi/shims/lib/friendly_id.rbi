# typed: strong

module FriendlyId
  include Base
end

module FriendlyId::Slugged
  sig { returns(T::Boolean) }
  def should_generate_new_friendly_id?; end
end
