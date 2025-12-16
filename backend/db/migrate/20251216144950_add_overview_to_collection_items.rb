class AddOverviewToCollectionItems < ActiveRecord::Migration[8.1]
  def change
    add_column :collection_items, :overview, :text
  end
end
