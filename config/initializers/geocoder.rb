# typed: true
# frozen_string_literal: true

Rails.application.configure do
  config.after_initialize do
    config = {
      lookup: :here,
      api_key: ENV["HERE_API_KEY"],
    }
    if (email = Contact.email)
      config[:http_headers] = { "User-Agent" => email }
    end
    Geocoder.configure(config)
  end
end
