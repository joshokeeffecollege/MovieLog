json.extract! movie, :id, :title, :tmdb_id, :overview, :poster_path, :release_year, :created_at, :updated_at
json.url movie_url(movie, format: :json)
