import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  Navigate,
  useNavigate,
} from "react-router-dom";
import SearchPage from "./pages/SearchPage";
import CollectionPage from "./pages/CollectionPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import {me, setToken} from "./api";
import { useEffect, useState } from "react";

function AppShell() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    me()
      .then((data) => setUser(data.user))
      .catch(() => setUser(null));
  }, []);

  function logout() {
    setToken(null);
    setUser(null);
    navigate("/login");
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
        <div className="container-fluid px-4">
          <span className="navbar-brand fw-semibold">MovieLog</span>

          <div className="navbar-nav ms-auto gap-2">
            <NavLink className="nav-link" to="/search">
              Search
            </NavLink>
            <NavLink className="nav-link" to="/collection">
              My Collection
            </NavLink>

            {!user ? (
              <>
                <NavLink className="nav-link" to="/login">
                  Account
                </NavLink>
              </>
            ) : (
              <button
                className="btn btn-outline-light btn-sm ms-2"
                onClick={logout}
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-grow-1 py-4">
        <div className="container-fluid px-4">
          <Routes>
            <Route path="/" element={<Navigate to="/search" replace />} />
            <Route
              path="/login"
              element={
                <LoginPage
                  onAuthed={(u) => {
                    setUser(u);
                    navigate("/search");
                  }}
                />
              }
            />
            <Route
              path="/signup"
              element={
                <SignupPage
                  onAuthed={(u) => {
                    setUser(u);
                    navigate("/search");
                  }}
                />
              }
            />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/collection" element={<CollectionPage />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell/>
    </BrowserRouter>
  );
}