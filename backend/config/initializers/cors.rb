# Enable CORS for specified origins to allow cross-origin requests
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # Specify allowed origins for CORS
    frontend_url = ENV["FRONTEND_URL"].to_s.strip

    allowed_origins = [
      "http://localhost:5173",
      "http://127.0.0.1:5173"
    ]

    allowed_origins << frontend_url if frontend_url.present?

    origins(*allowed_origins)

    # Define allowed resource paths, headers, and HTTP methods
    resource "*",
      headers: %w[ Content-Type Authorization ],
      methods: %i[ get post put patch delete options head ]
  end
end
