class SearchController < ApplicationController
  def movies
    query = params[:query].to_s.strip

    # input validation for empty queries
    if query.blank?
      return render json: { error: "Query is required" }, status: :bad_request
    end

    # basic validation against very long queries (abuse prevention)
    if query.length > 50
      return render json: { error: "Query too long" }, status: :bad_request
    end

    client = Tmdb::Client.new(api_key: ENV.fetch("TMDB_API_KEY"))
    render json: client.search_movie(query)
  rescue KeyError
    # protect against leaking environment details (missing TMDB_API_KEY)
    render json: { error: "Server is not configured" }, status: :internal_server_error
  rescue StandardError
    # avoid leaking traces to client; log server-side instead
    Rails.logger.warn("TMDB search failed")
    render json: { error: "Search failed" }, status: :bad_gateway
  end
end
