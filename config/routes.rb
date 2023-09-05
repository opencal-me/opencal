# typed: strict
# frozen_string_literal: true

# Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html
Rails.application.routes.draw do
  # == Redirects
  constraints subdomain: "www" do
    get "(*any)" => redirect(subdomain: "", status: 302)
  end

  # == Healthcheck
  Healthcheck.routes(self)

  # == Errors
  scope controller: :errors do
    match "/401", action: :unauthorized, via: :all
    match "/404", action: :not_found, via: :all
    match "/422", action: :unprocessable_entity, via: :all
    match "/500", action: :internal_server_error, via: :all
  end

  # == Devise
  devise_for :users,
             skip: %i[sessions registrations confirmations passwords],
             controllers: { omniauth_callbacks: "users/omniauth_callbacks" },
             path: "/user"
  devise_scope :user do
    resource :sessions,
             path: "/",
             module: "users",
             as: :user_session,
             only: [] do
               get :login, action: :new, as: :new
               post :logout, action: :destroy, as: :destroy
             end
    scope :user, module: "users", as: :user do
      resource :registrations,
               only: %i[edit update],
               path: "/",
               path_names: { edit: "settings" }
      # resource :confirmation,
      #          only: %i[new show],
      #          path: "/verification",
      #          path_names: { new: "resend" }
      # resource :password,
      #          only: %i[new edit update],
      #          path_names: { new: "reset", edit: "change" }
    end
  end

  # == GraphQL
  scope :graphql, controller: :graphql do
    mount GraphiQL::Rails::Engine,
          at: "/",
          as: :graphiql,
          graphql_path: "/graphql"
    post "/", action: :execute, as: :graphql
  end

  # == Homepage
  resource :homepage, path: "/home", only: :show

  # == Activities
  resources :activities, only: :show do
    member do
      get :story
      get :share
    end
  end
  resources :activities, path: "/join", only: [] do
    member do
      get :join, path: "/"
    end
  end

  # == Users
  resources :users, path: "/u", only: :show

  # == Superusers
  get :scott, to: redirect("/u/scottrlangille", status: 302)
  get :kai, to: redirect("/u/hulloitskai", status: 302)

  # == Google Calendar Channels
  resources :google_calendar_channels, only: [] do
    member do
      post :callback, path: "/notify"
    end
  end

  # == Pages
  root "landingpages#show"
  get "/privacy" => "high_voltage/pages#show", id: "privacy_policy"
  get "/tos" => "high_voltage/pages#show", id: "terms_of_service"
  get "/src" => redirect("https://github.com/opencal-me/opencal", status: 302)

  # == Development
  if Rails.env.development?
    mount GoodJob::Engine => "/good_job"
    get "/test" => "test#show"
    get "/mailcatcher" => redirect("//localhost:1080", status: 302)
  end

  # == Administration
  unless Rails.env.development?
    authenticate :user, ->(user) {
      user = T.let(user, User)
      user.admin?
    } do
      mount GoodJob::Engine => "/good_job"
    end
  end
end
