# typed: strict
# frozen_string_literal: true

module Admin
  class << self
    extend T::Sig

    # == Methods
    sig { returns(T.nilable(String)) }
    def emails_expr
      ENV["ADMIN_EMAILS"]
    end

    sig { returns(T::Array[String]) }
    def emails
      @emails ||= T.let(
        if (expr = emails_expr)
          expr.split(",").select do |entry|
            entry.include?("@") && EmailValidator.valid?(entry)
          end
        else
          []
        end,
        T.nilable(T::Array[String]),
      )
    end

    sig { returns(T::Array[String]) }
    def email_domains
      @email_domains ||= T.let(
        if (expr = emails_expr)
          expr.split(",").select { |entry| entry.exclude?("@") }
        else
          []
        end,
        T.nilable(T::Array[String]),
      )
    end
  end
end
