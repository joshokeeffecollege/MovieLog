import { useState } from "react";
import { searchMovies, addToCollection } from "../api";
import SearchResults from "../components/SearchResults.jsx";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

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

  // Handle adding a movie to the collection
  async function onAdd(movie) {
    setError("");
    setInfo("");

    // Prepare payload
    const payload = {
      tmdb_id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      release_date: movie.release_date,
      vote_average: movie.vote_average,
    };

    // Attempt to add to collection
    try {
      await addToCollection(payload);
      setInfo(`Added: ${movie.title}`);
    } catch (err) {
      const msg = err.message || "Add failed";

      // check if the user is logged in
      if (msg.includes("Invalid email or password") || msg.includes("401")) {
        setError("You must be logged in to add movies to your collection.");
      } else if (
        msg.includes(
          // Check for duplicate error messages
          "has already been taken" || msg.toLowerCase().includes("tmdb")
        )
      ) {
        setInfo(`${movie.title} is already in your collection.`);
      } else {
        setError(msg);
      }
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

      {/* Error handling */}
      {error && <div className="alert alert-danger">{error}</div>}
      {info && <div className="alert alert-success">{info}</div>}

      {/* Display message when added to collection */}
      {results.length === 0 && !loading && !error ? (
        <div></div>
      ) : (
        <SearchResults results={results} onAdd={onAdd} />
      )}
    </div>
  );
}
