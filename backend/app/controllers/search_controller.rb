class SearchController < ApplicationController
  def movies
    q = params[:query].to_s.strip
    client = Tmdb::Client.new(api_key: ENV.fetch("TMDB_API_KEY"))
    render json: client.search_movie(q)
  end
end
