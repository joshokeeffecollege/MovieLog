# Enable CORS for specified origins to allow cross-origin requests
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # Specify allowed origins for CORS (add your production frontend URL here)
    origins "http://localhost:5173", "http://127.0.0.1:5173", ENV["FRONTEND_URL"]

    # Define allowed resource paths, headers, and HTTP methods
    resource "*",
      headers: %w[ Content-Type Authorization ],
      methods: %i[ get post put patch delete options head ]
  end
end
