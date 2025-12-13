export default function SearchResults({results = [], onAdd}) {
    if (!results.length) {
        return (
            <div className={"alert alert-info"}>
                No results found.
            </div>
        )
    }

    return (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
            {results.map((m) => (
                <div className="col" key={m.id}>
                    <div className="card h-100">
                        {m.poster_path ? (
                            <img
                                className="card-img-top"
                                alt={m.title}
                                src={`https://image.tmdb.org/t/p/w342${m.poster_path}`}
                            />
                        ) : (
                            <div className="card-img-top d-flex align-items-center justify-content-center bg-light"
                                 style={{height: 300}}>
                                <span className="text-muted">No poster</span>
                            </div>
                        )}

                        <div className="card-body d-flex flex-column">
                            <h5 className="card-title">{m.title}</h5>

                            <div className="text-muted small mb-2">
                                {m.release_date ? `Release: ${m.release_date}` : 'Release date: N/A'}
                                <br/>
                                {typeof m.vote_average === 'number' ? `Rating: ${m.vote_average.toFixed(1)}` : 'Rating: N/A'}
                            </div>

                            {m.description && (
                                <p className="card-text small" style={{flexGrow: 1}}>
                                    {m.description.length > 180 ? m.description.slice(0, 180) + '…' : m.description}
                                </p>
                            )}

                            <button className="btn btn-success mt-auto" onClick={() => onAdd(m)}>
                                Add to collection
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

