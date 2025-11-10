Rails.application.routes.draw do
  # Defines the root path route ("/")
  root "searches#index"
  resources :movies
  get "/search", to: "searches#index"
end
