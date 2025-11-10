class SearchesController < ApplicationController
  require 'tmdb_client'
  def index
    @q = params[:q].to_s.strip
    @results = @q.present? ? TmdbClient.search_movies(@q) : []
  end
end