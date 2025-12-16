# This class represents an item in a user's collection
class CollectionItem < ApplicationRecord
  belongs_to :user

  # Validations
  validates :tmdb_id, presence: true, uniqueness: { scope: :user_id }
  validates :title, presence: true
end
