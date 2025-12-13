import {useEffect, useState} from 'react'
import {listCollection, removeFromCollection} from '../api'

export default function CollectionPage() {
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    async function load() {
        setError('')
        setLoading(true)
        try {
            const data = await listCollection()
            setItems(data)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        load()
    }, [])

    async function onRemove(id) {
        setError('')
        try {
            await removeFromCollection(id)
            setItems((prev) => prev.filter((x) => x.id !== id))
        } catch (err) {
            setError(err.message)
        }
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1 className="h3 m-0">My Collection</h1>
                <button className="btn btn-outline-secondary btn-sm" onClick={load} disabled={loading}>
                    Refresh
                </button>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {loading && <div>Loading…</div>}

            {!loading && items.length === 0 && (
                <div className="alert alert-info">No movies yet. Add some from Search.</div>
            )}

            <div className="list-group">
                {items.map((m) => (
                    <div key={m.id} className="list-group-item">
                        <div className="d-flex justify-content-between align-items-start">
                            <div className="me-3">
                                <div className="fw-semibold">{m.title}</div>
                                <div className="text-muted small">
                                    {m.release_date || 'No date'} · Rating: {m.vote_average ?? 'N/A'}
                                </div>
                            </div>
                            <button className="btn btn-outline-danger btn-sm" onClick={() => onRemove(m.id)}>
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
