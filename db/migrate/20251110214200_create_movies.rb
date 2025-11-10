class CreateMovies < ActiveRecord::Migration[8.1]
  def change
    create_table :movies do |t|
      t.string :title, null: false
      t.bigint :tmdb_id, null: false
      t.text :overview
      t.string :poster_path
      t.integer :release_year

      t.timestamps
    end
    add_index :movies, :tmdb_id, unique: true
  end
end
