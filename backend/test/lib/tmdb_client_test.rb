require "test_helper"

class TmdbClient < ActiveSupport::TestCase
    test "search_movie returns parsed json on success" do
        client = Tmdb:Client.new(api_key: "test_key")

        response = Struct.new(:body) do
            def is_a?(klass)
                klass == Net::HTTPSuccess
            end

            def code = "200"
            def message = "OK"
        end.new('{"Results": [{"id":1, "title": "The Matrix" }]}')

        http = Struct.new(:use_ssl, :verify_mode, :cert_store) do
            def request(_req)
                @response
            end

            def response=(r) = (@response = r)
        end.new
        http.response = response

        Net::HTTP.stub :new, http do
            result = client.search_movie("matrix")
            assert_equal({"results" => [{"id" => 1, "title" => "The Matrix"}]}, result)
        end
    end

    test "search_movie raises on non-success http reponse"
    client = Tmdb::Client.new(api_key: "test_key")

    response = Struct.new(:body) do
        def is_a?(_klass) = false
        def code = "401"
        def message = "Unauthorized"
    end.new('{"status_message":"Invalid API key"}')

    http = Struct.new(:use_ssl, :verify_mode, :cert_store) do
        def request(_req)
            @response
        end

        def response=(r) = (@response = r)
    end.new

    http.response = response

    Net::HTTP.stub :new, http do
        err = assert_raises(RuntimeError) {
            client.search_movie("matrix")
        }
        assert_match(/TMDB error: 401 Unauthorized/, err.message)

end