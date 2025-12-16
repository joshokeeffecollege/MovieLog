import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listCollection, removeFromCollection } from "../api";

function CollectionMovieCard({ movie, onRemove }) {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const showPoster = movie.poster_path && !imageError;

  return (
    <div
      className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden movie-card"
      onClick={() => navigate(`/movie/${movie.tmdb_id}`, { state: { movie } })}
    >
      {showPoster ? (
        <img
          className="card-img-top rounded-top-4"
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          onError={() => setImageError(true)}
        />
      ) : (
        <div
          className="card-img-top rounded-top-4 bg-light d-flex align-items-center justify-content-center"
          style={{ height: 260 }}
        >
          <span className="text-muted small">No poster</span>
        </div>
      )}
    </div>
  );
}

export default function CollectionPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Check for authentication token
  const token = localStorage.getItem("token");

  async function load() {
    setError("");
    setLoading(true);
    try {
      const data = await listCollection();
      setItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Load collection
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    load();
  }, [token]);

  // Handle removing a movie from the collection
  async function onRemove(id) {
    setError("");
    try {
      await removeFromCollection(id);
      setItems((prev) => prev.filter((x) => x.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  // Prompt for login if not authenticated
  if (!token) {
    return (
      <div className="container mt-5">
        <div className="alert alert-outline-warning text-center">
          <h4>Authentication Required</h4>
          <p>
            Please <a href="/login">log in</a> or <a href="/signup">sign up</a>{" "}
            to view your collection
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-100 p-4 p-md-5">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h1 className="h3 mb-0">My Collection</h1>
        </div>
      </div>

      {/* Error and loading */}
      {error && <div className="alert alert-danger">{error}</div>}
      {loading && (
        <div className="d-flex align-items-center gap-2 text-muted mb-3">
          <div
            className="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></div>
          Loading…
        </div>
      )}

      {/* If no movies in collection */}
      {!loading && items.length === 0 && (
        <div className="alert alert-secondary text-center py-4 rounded-4">
          No movies yet.
        </div>
      )}

      {/* Maps the collection to a bootstrap grid */}
      <div className="row row-cols-2 row-cols-sm-4 row-cols-md-6 row-cols-xl-8 g-3">
        {items.map((m) => (
          <div key={m.id} className="col">
            <CollectionMovieCard movie={m} onRemove={onRemove} />
          </div>
        ))}
      </div>
    </div>
  );
}
