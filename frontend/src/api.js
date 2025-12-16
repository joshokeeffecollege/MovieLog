// API utility functions for interacting with the backend server
const API_BASE = import.meta.env.VITE_API_BASE_URL;

// Token management
function getToken() {
  return localStorage.getItem("token");
}

// Set or remove the authentication token in local storage
export function setToken(token) {
  if (!token) localStorage.removeItem("token");
  else localStorage.setItem("token", token);
}

// HTTP request function with error handling
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

  // Handle 204 No Content responses (e.g., DELETE requests)
  if (res.status === 204) {
    return null;
  }

  return res.json();
}

// User authentication functions
export function signup(email, password, passwordConfirmation) {
  return http(`/signup`, {
    method: "POST",
    body: JSON.stringify({
      user: { email, password, password_confirmation: passwordConfirmation },
    }),
  });
}

// User login function
export function login(email, password) {
  return http(`/login`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

// Fetch current user details
export function me() {
  return http(`/me`);
}

// Movie search function
export async function searchMovies(query) {
  // Encode query to handle special characters
  const url = `${API_BASE}/search/movies?query=${encodeURIComponent(query)}`;
  const res = await fetch(url);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return res.json();
}

// Fetch movie credits (cast and crew) by movie ID
export async function getMovieCredits(movieId) {
  const url = `${API_BASE}/search/movies/${movieId}/credits`;
  const res = await fetch(url);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return res.json();
}

// Collection management functions
export function listCollection() {
  return http(`/collection_items`);
}

// Add a movie to the collection
export function addToCollection(movie) {
  return http(`/collection_items`, {
    method: "POST",
    body: JSON.stringify({ collection_item: movie }),
  });
}

// Remove a movie from the collection by ID
export function removeFromCollection(id) {
  return http(`/collection_items/${id}`, { method: "DELETE" });
}
