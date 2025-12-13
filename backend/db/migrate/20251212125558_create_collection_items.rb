class CreateCollectionItems < ActiveRecord::Migration[8.1]
  def change
    create_table :collection_items do |t|
      t.integer :tmdb_id
      t.string :title
      t.string :poster_path
      t.string :release_date
      t.float :vote_average

      t.timestamps
    end
  end
end
