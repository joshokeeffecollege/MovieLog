require "net/http"
require "json"
require "openssl"

module Tmdb
  class Client

    # TMDB base url
    BASE_URL = "https://api.themoviedb.org/3".freeze

    # API key for authentication
    def initialize(api_key:)
      @api_key = api_key
    end

    # Search query string building
    def search_movie(query_string)
      get_json("/search/movie", { query: query_string.to_s })
    end

    # Get movie credits (cast and crew) by movie ID
    def movie_credits(movie_id)
      get_json("/movie/#{movie_id}/credits", {})
    end

    private

    # Perform a GET request and parse JSON response
    def get_json(path, params = {})
      uri = URI("#{BASE_URL}#{path}")
      uri.query = URI.encode_www_form(params.merge(api_key: @api_key))

      # Set up HTTPS with proper SSL verification
      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = true
      http.verify_mode = OpenSSL::SSL::VERIFY_PEER

      # Build a trust store explicitly from your env paths.
      store = OpenSSL::X509::Store.new
      if ENV["SSL_CERT_FILE"] || ENV["SSL_CERT_DIR"]
        store.add_file(ENV["SSL_CERT_FILE"]) if ENV["SSL_CERT_FILE"].present?
        store.add_path(ENV["SSL_CERT_DIR"]) if ENV["SSL_CERT_DIR"].present?
      else
        store.set_default_paths
      end
      http.cert_store = store


      # Create and send the GET request for JSON response
      req = Net::HTTP::Get.new(uri.request_uri)
      req["Accept"] = "application/json"

      res = http.request(req)
      raise "TMDB error: #{res.code} #{res.message}" unless res.is_a?(Net::HTTPSuccess)

      # Parse and return the JSON response body
      JSON.parse(res.body)
    end
  end
end
