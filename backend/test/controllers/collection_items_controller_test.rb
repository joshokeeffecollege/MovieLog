require "test_helper"

class CollectionItemsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @collection_item = collection_items(:one)
    @user = users(:one)
  end

  test "should get index" do
    get collection_items_url, headers: auth_headers(@user), as: :json
    assert_response :success
  end

  test "should create collection_item" do
    assert_difference("CollectionItem.count") do
      post collection_items_url,
           params: { collection_item: { tmdb_id: 999, title: "New Movie", poster_path: "/poster.jpg", release_date: "2024-01-01", vote_average: 8.5 } },
           headers: auth_headers(@user),
           as: :json
    end

    assert_response :created
  end

  test "should show collection_item" do
    get collection_item_url(@collection_item), headers: auth_headers(@user), as: :json
    assert_response :success
  end

  test "should update collection_item" do
    patch collection_item_url(@collection_item),
          params: { collection_item: { title: "Updated Title" } },
          headers: auth_headers(@user),
          as: :json
    assert_response :success
  end

  test "should destroy collection_item" do
    assert_difference("CollectionItem.count", -1) do
      delete collection_item_url(@collection_item), headers: auth_headers(@user), as: :json
    end

    assert_response :no_content
  end
end
