import { useEffect, useState } from "react";
import { listCollection, removeFromCollection } from "../api";

export default function CollectionPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    load();
  }, [token]);

  async function onRemove(id) {
    setError("");
    try {
      await removeFromCollection(id);
      setItems((prev) => prev.filter((x) => x.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

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

      {!loading && items.length === 0 && (
        <div className="alert alert-secondary text-center py-4 rounded-4">
          No movies yet.
        </div>
      )}

      <div className="row row-cols-2 row-cols-sm-4 row-cols-md-6 row-cols-xl-8 g-3">
        {items.map((m) => (
          <div key={m.id} className="col">
            <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden">
              {m.poster_path ? (
                <img
                  className="card-img-top rounded-top-4"
                  src={`https://image.tmdb.org/t/p/w500${m.poster_path}`}
                  alt={m.title}
                />
              ) : (
                <div
                  className="card-img-top rounded-top-4 bg-light d-flex align-items-center justify-content-center"
                  style={{ height: 260 }}
                >
                  <span className="text-muted small">No poster</span>
                </div>
              )}
              <div className="card h-100 border-0 shadow-sm rounded-4">
                <div className="card-body d-flex flex-column gap-2">
                  <div>
                    <div className="fw-semibold">{m.title}</div>
                  </div>

                  <button
                    className="btn btn-outline-danger btn-sm mt-auto align-self-start"
                    onClick={() => onRemove(m.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
