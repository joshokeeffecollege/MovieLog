import { useState } from "react";
import { searchMovies, addToCollection } from "../api";
import SearchResults from "../components/SearchResults.jsx";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  async function onSearch(e) {
    e.preventDefault();
    setError("");
    setInfo("");
    setResults([]);

    const q = query.trim();
    if (!q) return;

    setLoading(true);
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

  async function onAdd(movie) {
    setError("");
    setInfo("");

    const payload = {
      tmdb_id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      release_date: movie.release_date,
      vote_average: movie.vote_average,
    };

    try {
      await addToCollection(payload);
      setInfo(`Added: ${movie.title}`);
    } catch (err) {
      const msg = err.message || "Add failed";

      if (
        msg.includes("has already been taken") ||
        msg.toLowerCase().includes("tmdb")
      ) {
        setInfo(`${movie.title} is already in your collection`);
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

      {error && <div className="alert alert-danger">{error}</div>}
      {info && <div className="alert alert-success">{info}</div>}

      {results.length === 0 && !loading && !error ? (
        <div></div>
      ) : (
        <SearchResults results={results} onAdd={onAdd} />
      )}
    </div>
  );
}
