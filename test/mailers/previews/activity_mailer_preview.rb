# typed: true
# frozen_string_literal: true

# Preview all emails at http://localhost:3000/rails/mailers/activity_mailer
class ActivityMailerPreview < ActionMailer::Preview
  def created_email
    activity = Activity.last!
    activity = T.cast(activity, Activity)
    ActivityMailer.created_email(activity)
  end
end
