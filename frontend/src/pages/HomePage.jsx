import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { trendingMovies } from "../api";
import SearchResults from "../components/SearchResults.jsx";

export default function HomePage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let canceled = false;

    async function load() {
      setError("");
      setLoading(true);
      try {
        const data = await trendingMovies("week");
        const movies = Array.isArray(data) ? data : data.results || [];
        if (!canceled) setResults(movies);
      } catch (err) {
        if (!canceled) setError(err.message || "Failed to load trending movies");
      } finally {
        if (!canceled) setLoading(false);
      }
    }

    load();
    return () => {
      canceled = true;
    };
  }, []);

  return (
    <div className="w-100 p-4 p-md-5">
      <div className="d-flex flex-column flex-md-row align-items-md-end justify-content-between gap-3 mb-4">
        <div>
          <h1 className="display-6 mb-1">MovieLog</h1>
          <div className="text-muted">
            Search movies, save favorites, and track your collection.
          </div>
        </div>

        <div className="d-flex gap-2">
          <Link to="/search" className="btn btn-primary">
            Search movies
          </Link>
          <Link to="/collection" className="btn btn-outline-primary">
            View collection
          </Link>
        </div>
      </div>

      <div className="d-flex align-items-end justify-content-between mb-3">
        <h2 className="h5 mb-0">Trending this week</h2>
      </div>

      {loading && (
        <div className="d-flex justify-content-center align-items-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <span className="ms-3 text-muted">Loading trending movies...</span>
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && results.length === 0 && (
        <div className="alert alert-secondary mb-0">No trending movies found.</div>
      )}

      {!loading && !error && results.length > 0 && (
        <SearchResults results={results.slice(0, 24)} />
      )}
    </div>
  );
}

