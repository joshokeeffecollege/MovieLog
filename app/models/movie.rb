class Movie < ApplicationRecord
  validates :title,   presence: true
  validates :tmdb_id, presence: true, uniqueness: true
end
