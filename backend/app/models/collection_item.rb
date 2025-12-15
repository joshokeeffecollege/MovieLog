class CollectionItem < ApplicationRecord
  belongs_to :user

  validates :tmdb_id, presence: true, uniqueness: { scope: :user_id }
  validates :title, presence: true
end
