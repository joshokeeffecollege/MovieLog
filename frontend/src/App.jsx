// Imports
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import SearchPage from "./pages/SearchPage";
import CollectionPage from "./pages/CollectionPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import MovieDetailsPage from "./pages/MovieDetailsPage";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import { me, setToken } from "./api";
import { useEffect, useState } from "react";

function AppShell() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Fetch current user on load
  useEffect(() => {
    me()
      .then((data) => setUser(data.user))
      .catch(() => setUser(null));
  }, []);

  // Logout function
  function logout() {
    setToken(null);
    setUser(null);
    navigate("/login");
  }

  return (
    <div className="min-vh-100 d-flex flex-column" style={{ backgroundColor: "var(--bg-main)" }}>
      <Navbar user={user} onLogout={logout} />

      {/* Main content */}
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/login"
            element={
              <div className="container-fluid px-4 py-4">
                <LoginPage
                  onAuthed={(u) => {
                    setUser(u);
                    navigate("/search");
                  }}
                />
              </div>
            }
          />

          {/* Sign up page */}
          <Route
            path="/signup"
            element={
              <div className="container-fluid px-4 py-4">
                <SignupPage
                  onAuthed={(u) => {
                    setUser(u);
                    navigate("/search");
                  }}
                />
              </div>
            }
          />
          <Route path="/search" element={<div className="container-fluid px-4 py-4"><SearchPage /></div>} />
          <Route path="/collection" element={<div className="container-fluid px-4 py-4"><CollectionPage /></div>} />
          <Route path="/movie/:id" element={<MovieDetailsPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
