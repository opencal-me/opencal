# typed: strict
# frozen_string_literal: true

class MobileSubscriptionMailer < ApplicationMailer
  sig { params(subscription: MobileSubscription).returns(Mail::Message) }
  def created_email(subscription)
    subscription_id = subscription.to_gid.to_s
    subject = subscription.subject!
    data = query!("MobileSubscriptionCreatedEmailQuery", { subscription_id: })
    mail(
      inertia: "MobileSubscriptionCreatedEmail",
      props: {
        "homeUrl" => home_url,
        "data" => data,
      },
      to: subject.email_with_name,
      bcc: notifications_email,
      subject: "Someone subscribed to your activities",
    )
  end
end
