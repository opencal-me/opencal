# typed: strong

class Activity
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
