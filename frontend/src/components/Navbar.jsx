import { NavLink } from "react-router-dom";

/**
 * Navigation bar component with branding, navigation links, and user authentication status
 * Features grey theme, movie icon branding, and responsive layout
 */
export default function Navbar({ user, onLogout }) {
  return (
    <nav
      className="navbar navbar-expand-lg shadow-sm"
      style={{
        backgroundColor: "var(--primary)",
      }}
    >
      <div className="container-fluid px-4">
        <NavLink
          to="/search"
          className="navbar-brand fw-bold text-white d-flex align-items-center gap-2"
        >
          <span>MovieLog</span>
        </NavLink>

        {/* Navigation links */}
        <div className="navbar-nav ms-auto gap-3 align-items-center">
          <NavLink
            className={({ isActive }) =>
              `nav-link text-white ${isActive ? "fw-bold" : ""}`
            }
            to="/search"
          >
            Search
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `nav-link text-white ${isActive ? "fw-bold" : ""}`
            }
            to="/collection"
          >
            My Collection
          </NavLink>

          {/* Authentication status - show login or user info */}
          {!user ? (
            <NavLink className="btn btn-outline-light btn-sm" to="/login">
              Login
            </NavLink>
          ) : (
            <div className="d-flex align-items-center gap-3">
              <span className="text-white-50 small">{user.email}</span>
              <button
                className="btn btn-outline-light btn-sm"
                onClick={onLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
