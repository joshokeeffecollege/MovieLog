Rails.application.routes.draw do
  resources :collection_items
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  root "rails/health#show"
  get "/up", to: "rails/health#show"
  post "/up", to: "rails/health#show"

  # Defines the root path route ("/")
  # root "posts#index"

  # search
  get "/search/movies", to: "search#movies", as: :movies
  get "/search/movies/:id/credits", to: "search#credits", as: :movie_credits
  post "/signup", to: "auth#signup"
  get "/signup", to: "auth#signup"
  post "/login", to: "auth#login"
  get "/login", to: "auth#login"
  get "/me", to: "auth#me"
end
