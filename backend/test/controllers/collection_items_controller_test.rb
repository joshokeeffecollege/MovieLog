require "test_helper"

class CollectionItemsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @collection_item = collection_items(:one)
  end

  test "should get index" do
    get collection_items_url, as: :json
    assert_response :success
  end

  test "should create collection_item" do
    assert_difference("CollectionItem.count") do
      post collection_items_url, params: { collection_item: { poster_path: @collection_item.poster_path, release_date: @collection_item.release_date, title: @collection_item.title, tmdb_id: @collection_item.tmdb_id, vote_average: @collection_item.vote_average } }, as: :json
    end

    assert_response :created
  end

  test "should show collection_item" do
    get collection_item_url(@collection_item), as: :json
    assert_response :success
  end

  test "should update collection_item" do
    patch collection_item_url(@collection_item), params: { collection_item: { poster_path: @collection_item.poster_path, release_date: @collection_item.release_date, title: @collection_item.title, tmdb_id: @collection_item.tmdb_id, vote_average: @collection_item.vote_average } }, as: :json
    assert_response :success
  end

  test "should destroy collection_item" do
    assert_difference("CollectionItem.count", -1) do
      delete collection_item_url(@collection_item), as: :json
    end

    assert_response :no_content
  end
end
