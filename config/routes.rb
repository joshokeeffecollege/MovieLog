Rails.application.routes.draw do
  # Defines the root path route ("/")
  root "movies#index"
  resources :movies
  get "/search", to: "searches#index"
end
