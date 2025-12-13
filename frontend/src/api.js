const API_BASE = import.meta.env.VITE_API_BASE_URL;

async function http(path, options = {}) {
    const res = await fetch(`${API_BASE}${path}`, {
        headers: {'Content-Type': 'application/json', ...(options.headers || {})},
        ...options,
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Request failed: ${res.status}`);
    }
    return res.json();
}

export async function searchMovies(query) {
    const url = `${API_BASE}/search/movies?query=${encodeURIComponent(query)}`;
    const res = await fetch(url);

    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Request failed: ${res.status}`);
    }
    return res.json();
}

export function listCollection() {
    return http(`/collection_items`);
}

export function addToCollection(movie) {
    return http(`/collection_items`, {
        method: 'POST',
        body: JSON.stringify({collection_item: movie}),
    });
}

export function removeFromCollection(id) {
    return http(`/collection_items/${id}`, {method: 'DELETE'});
}
