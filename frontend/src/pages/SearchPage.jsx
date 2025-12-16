import { useState, useEffect } from "react";
import { searchMovies } from "../api";
import SearchResults from "../components/SearchResults.jsx";

export default function SearchPage() {
  const [query, setQuery] = useState(() => {
    return sessionStorage.getItem("searchQuery") || "";
  });
  const [results, setResults] = useState(() => {
    const saved = sessionStorage.getItem("searchResults");
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  // Save search state to sessionStorage
  useEffect(() => {
    sessionStorage.setItem("searchQuery", query);
  }, [query]);

  useEffect(() => {
    sessionStorage.setItem("searchResults", JSON.stringify(results));
  }, [results]);

  // Handle search form submission
  async function onSearch(e) {
    e.preventDefault();
    setError("");
    setInfo("");
    setResults([]);

    // Trim query and check if it's empty
    const q = query.trim();
    if (!q) return;
    setLoading(true);

    // Perform search
    try {
      const data = await searchMovies(q);
      const movies = Array.isArray(data) ? data : data.results || [];
      setResults(movies);
      if (movies.length === 0) setInfo("No results found");
    } catch (err) {
      setError(err.message || "Search failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-100 p-4 p-md-5">
      <div className="row g-4 align-items-center mb-4">
        <div className="text-center">
          <h1>Search</h1>
        </div>
        <div>
          {/* Search box */}
          <form className="bg-white rounded-4 border p-3" onSubmit={onSearch}>
            <div className="input-group input-group-lg">
              <input
                id="movie-search"
                type="text"
                className="form-control"
                placeholder="Search for movies..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button
                className="btn btn-primary"
                disabled={loading || !query.trim()}
              >
                {loading ? "Searching…" : "Search"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="d-flex justify-content-center align-items-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <span className="ms-3 text-muted">Searching movies...</span>
        </div>
      )}

      {/* Error handling */}
      {error && <div className="alert alert-danger">{error}</div>}
      {info && <div className="alert alert-success">{info}</div>}

      {/* Display search results */}
      {!loading && results.length > 0 && <SearchResults results={results} />}
    </div>
  );
}
