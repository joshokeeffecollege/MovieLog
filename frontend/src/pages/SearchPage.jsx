import {useState} from 'react'
import {searchMovies, addToCollection} from '../api'
import SearchResults from '../components/SearchResults.jsx'

export default function SearchPage() {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [info, setInfo] = useState('')

    async function onSearch(e) {
        e.preventDefault()
        setError('')
        setInfo('')
        setResults([])

        const q = query.trim()
        if (!q) return

        setLoading(true)
        try {
            const data = await searchMovies(q)
            const movies = Array.isArray(data) ? data : (data.results || [])
            setResults(movies)
            if (movies.length === 0) setInfo('No results found')
        } catch (err) {
            setError(err.message || 'Search failed')
        } finally {
            setLoading(false)
        }
    }

    async function onAdd(movie) {
        setError('')
        setInfo('')

        const payload = {
            tmdb_id: movie.id,
            title: movie.title,
            poster_path: movie.poster_path,
            release_date: movie.release_date,
            vote_average: movie.vote_average,
        }

        try {
            await addToCollection(payload)
            setInfo(`Added: ${movie.title}`)
        } catch (err) {
            setError(err.message || 'Add failed')
        }
    }

    return (
        <div>
            <h1 className="h3 mb-3">Search Movies</h1>

            <form className="row g-2 mb-3" onSubmit={onSearch}>
                <div className="col-md-9">
                    <input
                        type="text"
                        value={query}
                        className="form-control"
                        placeholder="e.g., matrix"
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>

                <div className="col-md-3">
                    <button className="btn btn-primary w-100" disabled={loading || !query.trim()}>
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </div>
            </form>

            {error && <div className="alert alert-danger">{error}</div>}
            {info && <div className="alert alert-success">{info}</div>}

            <SearchResults results={results} onAdd={onAdd}/>
        </div>
    )
}
