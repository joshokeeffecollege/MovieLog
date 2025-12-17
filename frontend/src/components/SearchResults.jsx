import { useState } from "react";
import { useNavigate } from "react-router-dom";

function MovieCard({ movie, onClick }) {
  const [imageError, setImageError] = useState(false);
  const showPoster = movie.poster_path && !imageError;

  return (
    <div
      className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden movie-card"
      onClick={onClick}
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

export default function SearchResults({ results = [] }) {
  const navigate = useNavigate();

  return (
    <div className="row row-cols-2 row-cols-sm-4 row-cols-md-6 row-cols-xl-8 g-3">
      {results.map((m) => (
        <div className="col" key={m.id}>
          <MovieCard
            movie={m}
            onClick={() => navigate(`/movie/${m.id}`, { state: { movie: m } })}
          />
        </div>
      ))}
    </div>
  );
}
