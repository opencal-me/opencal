# typed: strong

class Activity
  include FriendlyId::Model

  sig { returns(T.nilable(ActiveSupport::Duration)) }
  def self.notifications_delay; end

  sig do
    params(value: T.nilable(ActiveSupport::Duration)).
      returns(T.nilable(ActiveSupport::Duration))
  end
  def self.notifications_delay=(value); end

  sig { returns(T.nilable(ActiveSupport::Duration)) }
  def notifications_delay; end

  sig do
    params(value: T.nilable(ActiveSupport::Duration)).
      returns(T.nilable(ActiveSupport::Duration))
  end
  def notifications_delay=(value); end

  sig { returns(RGeo::Geographic::SphericalPointImpl) }
  def coordinates; end

  sig do
    params(value: RGeo::Geographic::SphericalPointImpl)
      .returns(RGeo::Geographic::SphericalPointImpl)
  end
  def coordinates=(value); end

  sig { returns(T::Range[Time]) }
  def during; end

  sig { params(value: T::Range[Time]).returns(T::Range[Time]) }
  def during=(value); end
end
