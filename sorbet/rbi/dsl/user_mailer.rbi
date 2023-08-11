# typed: true

# DO NOT EDIT MANUALLY
# This is an autogenerated file for dynamic methods in `UserMailer`.
# Please instead update this file by running `bin/tapioca dsl UserMailer`.

class UserMailer
  class << self
    sig { returns(::ActionMailer::MessageDelivery) }
    def current_user; end

    sig { params(user: ::User).returns(::ActionMailer::MessageDelivery) }
    def welcome_email(user); end
  end
end
