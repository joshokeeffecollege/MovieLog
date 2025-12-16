# This controller handles movie search functionality using the TMDB API
class SearchController < ApplicationController
  def movies
    query = params[:query].to_s.strip

    # Input validation for empty queries
    if query.blank?
      return render json: { error: "Query is required" }, status: :bad_request
    end

    # Basic validation against very long queries (abuse prevention)
    if query.length > 50
      return render json: { error: "Query too long" }, status: :bad_request
    end

    # Perform search using TMDB API
    client = Tmdb::Client.new(api_key: ENV.fetch("TMDB_API_KEY"))
    results = client.search_movie(query)

    # Filter and sort results
    if results["results"]
      filtered_results = results["results"].select do |movie|
        # Only include movies with English original language or high popularity
        movie["original_language"] == "en" || movie["popularity"].to_f > 20
      end

      # Sort by relevance (popularity and vote count)
      sorted_results = filtered_results.sort_by do |movie|
        # Higher popularity and vote count = better relevance
        -(movie["popularity"].to_f * 0.7 + movie["vote_count"].to_i * 0.3)
      end

      results["results"] = sorted_results
    end

    render json: results
  rescue KeyError
    # Protect against leaking environment details (missing TMDB_API_KEY)
    render json: { error: "Server is not configured" }, status: :internal_server_error
  rescue StandardError
    # avoid leaking traces to client; log server-side instead
    Rails.logger.warn("TMDB search failed")
    render json: { error: "Search failed" }, status: :bad_gateway
  end

  # Get movie credits (cast and crew) by TMDB movie ID
  def credits
    movie_id = params[:id].to_i

    # Validate movie ID
    if movie_id <= 0
      return render json: { error: "Invalid movie ID" }, status: :bad_request
    end

    # Fetch credits from TMDB API
    client = Tmdb::Client.new(api_key: ENV.fetch("TMDB_API_KEY"))
    render json: client.movie_credits(movie_id)
  rescue KeyError
    render json: { error: "Server is not configured" }, status: :internal_server_error
  rescue StandardError => e
    Rails.logger.warn("TMDB credits fetch failed: #{e.message}")
    render json: { error: "Failed to fetch credits" }, status: :bad_gateway
  end
end
