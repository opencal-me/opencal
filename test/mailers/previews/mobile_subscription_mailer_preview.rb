# typed: true
# frozen_string_literal: true

# Preview all emails at http://localhost:3000/rails/mailers/user_mailer
class MobileSubscriptionMailerPreview < ActionMailer::Preview
  def created_email
    subscription = MobileSubscription.first!
    MobileSubscriptionMailer.created_email(subscription)
  end
end
