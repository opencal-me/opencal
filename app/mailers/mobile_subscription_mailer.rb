# typed: strict
# frozen_string_literal: true

class MobileSubscriptionMailer < ApplicationMailer
  sig { params(subscription: MobileSubscription).returns(Mail::Message) }
  def created_email(subscription)
    subject_id = subscription.subject!.to_gid.to_s
    data = query!("MobileSubscribtionCreatedEmail", { subject_id: })
    mail(
      inertia: "MobileSubscriptionCreatedEmail",
      props: {
        "data" => data,
        "subscriberPhone" => subscription.subscriber!.phone,
      },
      to: notifications_email,
      subject: "Mobile subscriber added",
    )
  end
end
