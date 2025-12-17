import { NavLink } from "react-router-dom";

export default function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm">
      <div className="container-fluid px-4 px-lg-5">
        {/* Brand */}
        <NavLink
          to="/"
          className="navbar-brand fw-semibold d-flex align-items-center gap-2"
          style={{ color: "var(--primary)" }}
        >
          MovieLog
        </NavLink>

        {/* Mobile toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar content */}
        <div className="collapse navbar-collapse" id="mainNavbar">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center gap-lg-3">
            <li className="nav-item">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active fw-semibold" : ""}`
                }
                end
              >
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/search"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active fw-semibold" : ""}`
                }
              >
                Search
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/collection"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active fw-semibold" : ""}`
                }
              >
                My Collection
              </NavLink>
            </li>
          </ul>

          {/* Auth section */}
          <div className="d-flex align-items-center gap-3 ms-lg-4">
            {!user ? (
              <NavLink to="/login" className="btn btn-primary btn-sm">
                Login
              </NavLink>
            ) : (
              <>
                <span className="text-muted small d-none d-lg-inline">
                  {user.email}
                </span>
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={onLogout}
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
