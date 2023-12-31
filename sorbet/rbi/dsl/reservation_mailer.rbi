# typed: true

# DO NOT EDIT MANUALLY
# This is an autogenerated file for dynamic methods in `ReservationMailer`.
# Please instead update this file by running `bin/tapioca dsl ReservationMailer`.

class ReservationMailer
  class << self
    sig { params(reservation: ::Reservation).returns(::ActionMailer::MessageDelivery) }
    def created_email(reservation); end

    sig { returns(::ActionMailer::MessageDelivery) }
    def current_user; end

    sig { returns(::ActionMailer::MessageDelivery) }
    def url_helpers; end
  end
end
