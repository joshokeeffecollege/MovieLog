const API_BASE = import.meta.env.VITE_API_BASE_URL;

function getToken() {
  return localStorage.getItem("token");
}

export function setToken(token) {
  if (!token) localStorage.removeItem("token");
  else localStorage.setItem("token", token);
}

async function http(path, options = {}) {
  const token = getToken();

  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  // handle errors
  if (!res.ok) {
    const text = await res.text();
    let errorObject;

    // try to parse error response
    try {
      errorObject = JSON.parse(text);
    } catch {
      throw new Error(text || `Request failed: ${res.status}`);
    }

    // throw error with message and validation errors
    const error = new Error(
      // this means either errorObject has a message property or it fallback to generic messages
      errorObject.message ||
        (res.status === 401
          ? "Invalid email or password"
          : `Request failed: ${res.status}`)
    );

    error.errors = errorObject.errors;
    throw error;
  }
  return res.json();
}

export function signup(email, password, passwordConfirmation) {
  return http(`/signup`, {
    method: "POST",
    body: JSON.stringify({
      user: { email, password, password_confirmation: passwordConfirmation },
    }),
  });
}

export function login(email, password) {
  return http(`/login`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function me() {
  return http(`/me`);
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
    method: "POST",
    body: JSON.stringify({ collection_item: movie }),
  });
}

export function removeFromCollection(id) {
  return http(`/collection_items/${id}`, { method: "DELETE" });
}
