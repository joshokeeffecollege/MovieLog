class CollectionItem < ApplicationRecord
  belongs_to :user

  validates :tmdb_id, presence: true, uniqueness: true
  validates :title, presence: true
end
