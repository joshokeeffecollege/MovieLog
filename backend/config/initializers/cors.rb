Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins "http://localhost:5173", "http://127.0.0.1:5173"

    # Note: it is `:options` (plural), not `:option`
    resource "/search/*",
             headers: %w[Content-Type],
             methods: %i[get options]

    resource "/collection_items*",
             headers: %w[Content-Type],
             methods: %i[get post put patch delete options]
  end
end
