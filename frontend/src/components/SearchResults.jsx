import { useNavigate } from "react-router-dom";
import { useState } from "react";

function MovieCard({ movie, onClick }) {
  const [imageError, setImageError] = useState(false);
  const showPoster = movie.poster_path && !imageError;

  return (
    <div
      className="card h-100 shadow-sm border-0 rounded-3 overflow-hidden movie-card"
      onClick={onClick}
    >
      {/* Movie poster */}
      {showPoster ? (
        <img
          className="card-img-top"
          src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
          alt={movie.title}
          style={{ aspectRatio: "2/3", objectFit: "cover" }}
          onError={() => setImageError(true)}
        />
      ) : (
        <div
          className="bg-light d-flex align-items-center justify-content-center"
          style={{ aspectRatio: "2/3" }}
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
    <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 row-cols-xl-6 g-3">
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
