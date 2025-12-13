export default function SearchResults({ results = [], onAdd }) {
  return (
    <div className="row row-cols-2 row-cols-sm-4 row-cols-md-6 row-cols-xl-8 g-3">
      {results.map((m) => (
        <div className="col" key={m.id}>
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

            <div className="card-body d-flex flex-column">
              <div className="mb-2">
                <h5 className="card-title mb-0">{m.title}</h5>
              </div>

              <button
                className="btn btn-outline-primary mt-auto"
                onClick={() => onAdd(m)}
              >
                Add to collection
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
