# typed: true
# frozen_string_literal: true

class ReservationMailer < ApplicationMailer
  sig { params(reservation: Reservation).returns(Mail::Message) }
  def created_email(reservation)
    reservation_id = reservation.to_gid.to_s
    activity = reservation.activity!
    data = query!("ReservationCreatedEmailQuery", { reservation_id: })
    mail(
      inertia: "ReservationCreatedEmail",
      props: { data: },
      to: activity.owner!.email_with_name,
      subject: "#{reservation.name} would like to come to #{activity.name}",
    )
  end
end
