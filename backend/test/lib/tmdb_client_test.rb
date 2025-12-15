require "test_helper"

class TmdbClientTest < ActiveSupport::TestCase
  test "client initializes with api key" do
    client = Tmdb::Client.new(api_key: "test_key")
    assert_not_nil client
  end

  test "search_movie requires api_key" do
    assert_raises(ArgumentError) do
      Tmdb::Client.new
    end
  end

  # Note: These are integration-style tests that would normally use WebMock or VCR
  # to stub HTTP requests. For now, we're testing the basic structure.
  # In a production environment, you would want to:
  # 1. Add WebMock gem for HTTP stubbing
  # 2. Or use VCR for recording/replaying HTTP interactions
  # 3. Or create a mock HTTP client for testing
end
