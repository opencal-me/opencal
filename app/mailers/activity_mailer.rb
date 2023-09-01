# typed: strict
# frozen_string_literal: true

class ActivityMailer < ApplicationMailer
  sig { params(activity: Activity).returns(Mail::Message) }
  def created_email(activity)
    activity_id = activity.to_gid.to_s
    data = query!("ActivityCreatedEmailQuery", { activity_id: })
    mail(
      inertia: "ActivityCreatedEmail",
      props: { data: },
      to: activity.owner!.email_with_name,
      bcc: notifications_email,
      subject: "Activity created from calendar",
    )
  end
end
