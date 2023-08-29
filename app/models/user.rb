# typed: true
# frozen_string_literal: true

# rubocop:disable Layout/LineLength
#
# == Schema Information
#
# Table name: users
#
#  id                               :uuid             not null, primary key
#  avatar_url                       :string
#  current_sign_in_at               :datetime
#  current_sign_in_ip               :string
#  email                            :string           not null
#  encrypted_password               :string           not null
#  first_name                       :string           not null
#  google_calendar_last_imported_at :datetime
#  google_refresh_token             :string
#  google_uid                       :string           not null
#  handle                           :string           not null
#  last_name                        :string
#  last_sign_in_at                  :datetime
#  last_sign_in_ip                  :string
#  remember_created_at              :datetime
#  reset_password_sent_at           :datetime
#  reset_password_token             :string
#  sign_in_count                    :integer          default(0), not null
#  created_at                       :datetime         not null
#  updated_at                       :datetime         not null
#
# Indexes
#
#  index_users_on_email                             (email) UNIQUE
#  index_users_on_google_calendar_last_imported_at  (google_calendar_last_imported_at)
#  index_users_on_handle                            (handle) UNIQUE
#  index_users_on_reset_password_token              (reset_password_token) UNIQUE
#
class User < ApplicationRecord
  include Identifiable
  include Handled
  include FriendlyIdentifiable

  # == Constants
  MIN_PASSWORD_ENTROPY = T.let(14, Integer)

  # == Devise: Configuration
  # Others modules are: :lockable, :timeoutable, and :omniauthable.
  devise :database_authenticatable,
         :registerable,
         :recoverable,
         :rememberable,
         :validatable,
         :trackable,
         :omniauthable

  self.filter_attributes += %i[
    encrypted_password
    reset_password_token
    invitation_token
  ]

  # == Attributes
  sig { returns(String) }
  def name
    [first_name, last_name].compact.join(" ")
  end

  def initials
    [first_name.first, last_name&.first].compact.join("")
  end

  sig { returns(String) }
  def email_with_name
    ActionMailer::Base.email_address_with_name(email, name)
  end

  sig { returns([String, String]) }
  def email_parts
    parts = email.split("@")
    unless parts.length == 2
      raise "Invalid email address (expected 2 parts, instead got " \
        "#{parts.count}})"
    end
    T.cast(parts, [String, String])
  end

  sig { returns(String) }
  def email_username = email_parts.first

  sig { returns(String) }
  def email_domain = email_parts.last

  # == FriendlyIdentifiable
  friendly_id :derived_handle

  # == Associations
  has_many :activities,
           inverse_of: :owner,
           foreign_key: :owner_id,
           dependent: :destroy
  has_many :google_calendar_channels,
           inverse_of: :owner,
           foreign_key: :owner_id,
           dependent: :destroy

  # == Normalizations
  # before_validation :remove_unconfirmed_email_if_matches_email,
  #                   if: %i[unconfirmed_email? email_changed?]

  # == Validations
  validates :first_name, presence: true, length: { maximum: 64 }
  validates :last_name, length: { maximum: 64 }, allow_nil: true
  validates :email,
            presence: true,
            length: {
              maximum: 100,
            },
            email: true,
            uniqueness: {
              case_sensitive: false,
            }
  validates :password,
            password_strength: {
              min_entropy: MIN_PASSWORD_ENTROPY,
              use_dictionary: true,
            },
            allow_nil: true

  # == Callbacks
  after_create_commit :send_welcome_email
  after_create_commit :register_google_calendar_channel,
                      if: :google_calendar_ready?

  # == Scopes
  scope :with_google_calendar_ready, -> {
    T.bind(self, PrivateRelation)
    where.not(google_refresh_token: nil)
  }

  # == Finders
  sig { returns(PrivateRelation) }
  def admins
    User
      .where(email: Admin.emails)
      .or(User.where("split_part(email, '@', 2) IN ?", Admin.email_domains))
  end

  # == Emails
  sig { void }
  def send_welcome_email
    UserMailer.welcome_email(self).deliver_later
  end

  # == Sentry
  sig { returns(T::Hash[String, T.untyped]) }
  def sentry_info
    { "id" => to_gid.to_s, "email" => email }
  end

  # == Fullstory
  sig { returns(T::Hash[String, T.untyped]) }
  def fullstory_identity
    { "uid" => to_gid.to_s, "email" => email, "displayName" => name }
  end

  # == Devise
  sig { params(auth: OmniAuth::AuthHash).returns(User) }
  def self.from_google_auth!(auth)
    google_uid = T.let(auth["uid"], String)
    info = T.let(auth.fetch("info"), T::Hash[String, T.untyped])
    user = find_or_initialize_by(google_uid:) do |user|
      user.password = Devise.friendly_token
    end
    user.attributes = info.slice("first_name", "last_name", "email").to_h
    user.avatar_url = info["image"]
    if (refresh_token = auth.dig("credentials", "refresh_token"))
      user.google_refresh_token = refresh_token
    end
    user.save!
    user
  end

  sig do
    params(
      params: T::Hash[Symbol, T.untyped],
      options: T.untyped,
    ).returns(T::Boolean)
  end
  def update_without_password(params, *options)
    params.delete(:email)
    super(params)
  end

  sig { override.returns(T::Boolean) }
  def active_for_authentication?
    google_refresh_token? && super
  end

  sig { override.returns(T.any(Symbol, String)) }
  def inactive_message
    return "Missing or invalid Google refresh token." if google_refresh_token?
    super
  end

  # == Google Calendar
  sig { params(id: String).returns(Google::Calendar) }
  def self.google_calendar(id)
    @google_calendars = T.let(@google_calendars,
                              T.nilable(T::Hash[T.untyped, Google::Calendar]))
    @google_calendars ||= Hash.new do |hash, id|
      hash[id] = Google::Calendar.new(
        client_id: Google.client_id!,
        client_secret: Google.client_secret!,
        redirect_url: "urn:ietf:wg:oauth:2.0:oob",
        calendar: id,
      )
    end
    @google_calendars[id]
  end

  sig { returns(T::Boolean) }
  def google_calendar_ready? = google_refresh_token?

  sig { returns(T.nilable(Google::Calendar)) }
  def google_calendar
    refresh_token = google_refresh_token or return
    calendar = self.class.google_calendar(email)
    begin
      calendar.login_with_refresh_token(refresh_token)
      calendar
    rescue Google::HTTPAuthorizationFailed => error
      cause = error.cause
      if cause.is_a?(Signet::AuthorizationError)
        response = T.let(cause.response, Faraday::Response)
        body = JSON.parse(response.body)
        if body["error"] == "invalid_grant"
          tag_logger do
            logger.info(
              "Google Calendar authorization failed; resetting refresh token",
            )
          end
          update!(google_refresh_token: nil)
        end
      end
      raise GoogleAuthorizationError, "Google Calendar authorization failed"
    end
  end

  sig { returns(Google::Calendar) }
  def google_calendar!
    google_calendar or raise "Missing Google refresh token"
  end

  sig { params(query: T.nilable(String)).returns(T::Array[Google::Event]) }
  def google_events!(query: nil)
    options = { query: query.presence }
    options.compact!
    options[:max_results] = 10
    with_google_calendar do |calendar|
      calendar.find_future_events(options)
    end
  end

  sig { params(id: String).returns(Google::Event) }
  def google_event!(id)
    with_google_calendar do |calendar|
      calendar.find_event_by_id(id).first
    end
  end

  sig { params(id: String).returns(T.nilable(Google::Event)) }
  def google_event(id)
    google_event!(id) if google_calendar_ready?
  end

  sig { returns(T::Array[Google::Event]) }
  def changed_google_events!
    updated_min = google_calendar_last_imported_at || created_at or
      raise "User not yet created"
    with_google_calendar do |calendar|
      params = {
        "updatedMin" => calendar.send(:encode_time, updated_min),
        "maxResults" => 2500,
        "orderBy" => "updated",
        "singleEvents" => true,
      }
      calendar.send(:event_lookup, "?" + params.to_query)
    end
  end

  sig { void }
  def update_google_calendar_last_imported_at!
    update!(google_calendar_last_imported_at: Time.current)
  end

  # == Methods
  sig { returns(T::Boolean) }
  def admin?
    Admin.emails.include?(email) || Admin.email_domains.include?(email_domain)
  end

  # # == Devise: Callback handlers
  # sig { void }
  # def after_confirmation
  #   super
  #   send_welcome_email if confirmed_at_previously_was.nil?
  # end

  private

  # == Handled: Helpers
  sig { returns(String) }
  def derived_handle
    if email_domain == "gmail.com"
      email_username
    else
      [email_username, email_domain].join("-")
    end
  end

  # == Helpers
  sig do
    type_parameters(:U)
      .params(
        block: T.proc.params(
          calendar: Google::Calendar,
        ).returns(T.type_parameter(:U)),
      )
      .returns(T.type_parameter(:U))
  end
  def with_google_calendar(&block)
    calendar = google_calendar!
    begin
      yield calendar
    rescue => error
      raise "Google Calendar error: #{error}"
    end
  end

  # == Callback Handlers
  sig { void }
  def register_google_calendar_channel
    GoogleCalendarChannel.register_for_user_later(self)
  end
end
