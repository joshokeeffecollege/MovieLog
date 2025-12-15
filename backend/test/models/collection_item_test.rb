require "test_helper"

class CollectionItemTest < ActiveSupport::TestCase
  test "is valid with required attributes" do
    assert collection_items(:one).valid?
  end

  test "requires tmdb_id" do
    item = CollectionItem.new(title: "The Matrix")
    assert_not item.valid?
    assert_includes item.errors[:tmdb_id], "can't be blank"
  end

  test "requires title" do
    item = CollectionItem.new(tmdb_id: 999)
    assert_not item.valid?
    assert_includes item.errors[:title], "can't be blank"
  end

  test "tmdb_id must be unique per user" do
    existing = collection_items(:one)
    # Same user, same tmdb_id - should be invalid
    dup = CollectionItem.new(user: existing.user, tmdb_id: existing.tmdb_id, title: "Duplicate")
    assert_not dup.valid?
    assert_includes dup.errors[:tmdb_id], "has already been taken"
  end

  test "different users can have same tmdb_id" do
    existing = collection_items(:one)
    different_user = users(:two)
    # Different user, same tmdb_id - should be valid
    item = CollectionItem.new(user: different_user, tmdb_id: existing.tmdb_id, title: "Same Movie")
    assert item.valid?
  end
end
