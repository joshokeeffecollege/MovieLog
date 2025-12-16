// function to display search results
export default function SearchResults({ results = [], onAdd }) {
  return (
    <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 row-cols-xl-6 g-3">
      {results.map((m) => (
        <div className="col" key={m.id}>
          <div className="card h-100 shadow-sm border-0 rounded-3 overflow-hidden">
            {m.poster_path ? (
              <img
                className="card-img-top"
                src={`https://image.tmdb.org/t/p/w342${m.poster_path}`}
                alt={m.title}
                style={{ aspectRatio: "2/3", objectFit: "cover" }}
              />
            ) : (
              <div
                className="bg-light d-flex align-items-center justify-content-center"
                style={{ aspectRatio: "2/3" }}
              >
                <span className="text-muted small">No poster</span>
              </div>
            )}

            <div className="card-body p-2 d-flex flex-column">
              <h6 className="card-title mb-2 text-truncate" title={m.title}>
                {m.title}
              </h6>

              <button
                className="btn btn-sm btn-outline-primary mt-auto w-100"
                onClick={() => onAdd(m)}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
