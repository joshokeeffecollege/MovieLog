require "httparty"

class TmdbClient
  include HTTParty
  base_uri "https://api.themoviedb.org/3"

  # Returns an array of normalized movie hashes or [] on error/empty.
  def self.search_movies(query)
    key = ENV["TMDB_API_KEY"]
    return [] if key.blank? || query.to_s.strip.blank?

    resp = get("/search/movie", query: { api_key: key, query: query, include_adult: false })

    Array(resp.parsed_response["results"]).map do |r|
      {
        tmdb_id: r["id"],
        title: r["title"],
        overview: r["overview"],
        release_year: r["release_date"]&.split("-")&.first&.to_i,
        poster_path: r["poster_path"]
      }
    end
  rescue => e
    Rails.logger.error "TMDB search failed: #{e.class}: #{e.message}"
    []
  end
end
