# typed: true

# DO NOT EDIT MANUALLY
# This is an autogenerated file for dynamic methods in `ActivityMailer`.
# Please instead update this file by running `bin/tapioca dsl ActivityMailer`.

class ActivityMailer
  class << self
    sig { params(activity: ::Activity).returns(::ActionMailer::MessageDelivery) }
    def created_email(activity); end

    sig { returns(::ActionMailer::MessageDelivery) }
    def current_user; end

    sig { returns(::ActionMailer::MessageDelivery) }
    def url_helpers; end
  end
end
