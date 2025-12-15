class AddUserIdToCollectionItems < ActiveRecord::Migration[8.1]
  def change
    add_reference :collection_items, :user, null: true, foreign_key: true
    add_index :collection_items, [:user_id, :tmdb_id], unique: true
  end
end
