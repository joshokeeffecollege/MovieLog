import { useState } from "react";
import { useNavigate } from "react-router-dom";

function MovieCard({ movie, onClick }) {
  const [imageError, setImageError] = useState(false);
  const showPoster = movie.poster_path && !imageError;

  return (
    <button
      type="button"
      className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden movie-card w-100 p-0 text-start"
      onClick={onClick}
      aria-label={movie.title}
    >
      <div style={{ height: 260 }}>
        {showPoster ? (
          <img
            className="card-img-top rounded-top-4 d-block w-100 h-100"
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            style={{ objectFit: "cover", objectPosition: "center" }}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="h-100 w-100 rounded-top-4 bg-light d-flex align-items-center justify-content-center">
            <span className="text-muted small">No poster</span>
          </div>
        )}
      </div>
    </button>
  );
}

export default function SearchResults({ results = [] }) {
  const navigate = useNavigate();

  return (
    <div className="row row-cols-2 row-cols-sm-4 row-cols-md-6 row-cols-xl-8 g-3">
      {results.map((m) => (
        <div className="col" key={m.id}>
          <MovieCard
            movie={m}
            onClick={() => {
              const movieId = m.tmdb_id || m.id;
              navigate(`/movie/${movieId}`, { state: { movie: m } });
            }}
          />
        </div>
      ))}
    </div>
  );
}
