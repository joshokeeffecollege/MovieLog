import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { addToCollection, listCollection, removeFromCollection, getMovieCredits } from "../api";

/**
 * Movie Details Page
 * Full-page view with poster on left (fixed) and scrollable details on right
 * Features: poster, title, year, rating, overview, and add/remove from collection
 */
export default function MovieDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isInCollection, setIsInCollection] = useState(false);
  const [collectionItemId, setCollectionItemId] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [cast, setCast] = useState([]);
  const [crew, setCrew] = useState([]);
  const [creditsLoading, setCreditsLoading] = useState(false);

  // Load movie data from location state or fetch from API
  useEffect(() => {
    // Get movie data passed via navigation state
    const movieData = window.history.state?.usr?.movie;

    if (movieData) {
      setMovie(movieData);
      setLoading(false);
    } else {
      // If no movie data, redirect back to search
      navigate("/search");
    }
  }, [id, navigate]);

  // Check if movie is already in collection
  useEffect(() => {
    async function checkCollection() {
      if (!movie) return;

      try {
        const collection = await listCollection();
        // Handle both search results (movie.id) and collection items (movie.tmdb_id)
        const movieTmdbId = movie.tmdb_id || movie.id;
        const found = collection.find((item) => item.tmdb_id === movieTmdbId);

        if (found) {
          setIsInCollection(true);
          setCollectionItemId(found.id);
        } else {
          setIsInCollection(false);
          setCollectionItemId(null);
        }
      } catch (err) {
        // If not logged in or error, assume not in collection
        setIsInCollection(false);
        setCollectionItemId(null);
      }
    }

    checkCollection();
  }, [movie]);

  // Fetch movie credits (cast and crew)
  useEffect(() => {
    async function fetchCredits() {
      if (!movie) return;

      setCreditsLoading(true);
      try {
        const movieTmdbId = movie.tmdb_id || movie.id;
        const credits = await getMovieCredits(movieTmdbId);

        // Get top 10 cast members
        setCast(credits.cast?.slice(0, 10) || []);

        // Get director(s) from crew
        const directors = credits.crew?.filter(person => person.job === "Director") || [];
        setCrew(directors);
      } catch (err) {
        console.error("Failed to fetch credits:", err);
      } finally {
        setCreditsLoading(false);
      }
    }

    fetchCredits();
  }, [movie]);

  // Handle adding movie to collection
  async function handleAddToCollection() {
    if (!movie) return;

    setError("");
    setSuccess("");

    // Handle both search results (movie.id) and collection items (movie.tmdb_id)
    const movieTmdbId = movie.tmdb_id || movie.id;

    const payload = {
      tmdb_id: movieTmdbId,
      title: movie.title,
      poster_path: movie.poster_path,
      release_date: movie.release_date,
      vote_average: movie.vote_average,
      overview: movie.overview,
    };

    try {
      const response = await addToCollection(payload);
      setSuccess(`Added "${movie.title}" to your collection!`);
      setIsInCollection(true);
      setCollectionItemId(response.id);
    } catch (err) {
      const msg = err.message || "Failed to add movie";

      if (msg.includes("Invalid email or password") || msg.includes("401")) {
        setError("You must be logged in to add movies to your collection.");
      } else if (
        msg.includes("has already been taken") ||
        msg.toLowerCase().includes("tmdb")
      ) {
        setSuccess(`"${movie.title}" is already in your collection.`);
        setIsInCollection(true);
      } else {
        setError(msg);
      }
    }
  }

  // Handle removing movie from collection
  async function handleRemoveFromCollection() {
    if (!collectionItemId) return;

    setError("");
    setSuccess("");

    try {
      await removeFromCollection(collectionItemId);
      setSuccess(`Removed "${movie.title}" from your collection!`);
      setIsInCollection(false);
      setCollectionItemId(null);
    } catch (err) {
      const msg = err.message || "Failed to remove movie";
      setError(msg);
    }
  }

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "80vh" }}
      >
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!movie) {
    return null;
  }

  return (
    <div className="container-fluid px-0">
      <div className="row g-0" style={{ minHeight: "calc(100vh - 80px)" }}>
        {/* Left side - Fixed poster */}
        <div
          className="col-md-4 position-relative"
          style={{
            minHeight: "500px",
          }}
        >
          <div
            className="position-sticky top-0 p-4 d-flex flex-column align-items-center justify-content-center"
            style={{ minHeight: "calc(100vh - 80px)" }}
          >
            {movie.poster_path && !imageError ? (
              <img
                src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
                alt={movie.title}
                className="img-fluid rounded-4 shadow-lg"
                style={{ maxHeight: "80vh", objectFit: "contain" }}
                onError={() => setImageError(true)}
              />
            ) : (
              <div
                className="bg-light rounded-4 d-flex align-items-center justify-content-center"
                style={{
                  width: "100%",
                  aspectRatio: "2/3",
                  maxHeight: "80vh",
                }}
              >
                <span className="text-muted">No poster available</span>
              </div>
            )}
          </div>
        </div>

        {/* Right side - Scrollable details */}
        <div className="col-md-8 bg-white">
          <div className="p-4">
            {/* Back button */}
            <button
              className="btn btn-link text-secondary mb-4 p-0"
              onClick={() => navigate(-1)}
            >
              ← Back
            </button>

            {/* Movie title */}
            <h1 className="display-4 fw-bold mb-3">{movie.title}</h1>

            {/* Meta information */}
            <div className="d-flex flex-wrap gap-4 mb-4 text-secondary">
              {movie.release_date && (
                <div className="d-flex align-items-center gap-2">
                  <span><strong>Year: </strong></span>
                  <span>{new Date(movie.release_date).getFullYear()}</span>
                </div>
              )}
              {movie.vote_average > 0 && (
                <div className="d-flex align-items-center gap-2">
                  <span><strong>Rating: </strong></span>
                  <span className="fw-semibold">
                    {movie.vote_average.toFixed(1)}/10
                  </span>
                </div>
              )}
            </div>

            {/* Success/Error messages */}
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            {/* Add/Remove button - conditional based on collection status */}
            {isInCollection ? (
              <button
                className="btn btn-danger btn-lg mb-5"
                onClick={handleRemoveFromCollection}
              >
                Remove from Collection
              </button>
            ) : (
              <button
                className="btn btn-success btn-lg mb-5"
                onClick={handleAddToCollection}
              >
                Add to Collection
              </button>
            )}

            {/* Overview section */}
            {movie.overview && (
              <div className="mb-5">
                <h2 className="h4 fw-semibold mb-3">Overview</h2>
                <p
                  className="lead text-secondary"
                  style={{ lineHeight: "1.8" }}
                >
                  {movie.overview}
                </p>
              </div>
            )}

            {/* Cast & Crew section */}
            {(cast.length > 0 || crew.length > 0) && (
              <div className="mb-5">
                <h2 className="h4 fw-semibold mb-3">Cast & Crew</h2>

                {/* Director(s) */}
                {crew.length > 0 && (
                  <div className="mb-4">
                    <h3 className="h6 fw-semibold mb-3 text-secondary">Director{crew.length > 1 ? 's' : ''}</h3>
                    <div className="d-flex gap-3 overflow-auto pb-3" style={{ scrollbarWidth: "thin" }}>
                      {crew.map((person) => (
                        <div key={person.id} className="text-center" style={{ minWidth: "120px" }}>
                          <div className="mb-2">
                            {person.profile_path ? (
                              <img
                                src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                                alt={person.name}
                                className="rounded-3 shadow-sm"
                                style={{ width: "120px", height: "180px", objectFit: "cover" }}
                              />
                            ) : (
                              <div
                                className="bg-light rounded-3 d-flex align-items-center justify-content-center"
                                style={{ width: "120px", height: "180px" }}
                              >
                                <span className="text-muted small">No photo</span>
                              </div>
                            )}
                          </div>
                          <div className="small fw-semibold text-truncate" title={person.name}>
                            {person.name}
                          </div>
                          <div className="small text-secondary">Director</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cast */}
                {cast.length > 0 && (
                  <div>
                    <h3 className="h6 fw-semibold mb-3 text-secondary">Cast</h3>
                    <div className="d-flex gap-3 overflow-auto pb-3" style={{ scrollbarWidth: "thin" }}>
                      {cast.map((person) => (
                        <div key={person.id} className="text-center" style={{ minWidth: "120px" }}>
                          <div className="mb-2">
                            {person.profile_path ? (
                              <img
                                src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                                alt={person.name}
                                className="rounded-3 shadow-sm"
                                style={{ width: "120px", height: "180px", objectFit: "cover" }}
                              />
                            ) : (
                              <div
                                className="bg-light rounded-3 d-flex align-items-center justify-content-center"
                                style={{ width: "120px", height: "180px" }}
                              >
                                <span className="text-muted small">No photo</span>
                              </div>
                            )}
                          </div>
                          <div className="small fw-semibold text-truncate" title={person.name}>
                            {person.name}
                          </div>
                          <div className="small text-secondary text-truncate" title={person.character}>
                            {person.character}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Additional details placeholder */}
            {movie.genres && movie.genres.length > 0 && (
              <div className="mb-5">
                <h2 className="h4 fw-semibold mb-3">Genres</h2>
                <div className="d-flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="badge bg-secondary text-white px-3 py-2"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
