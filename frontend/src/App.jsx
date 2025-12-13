import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  Navigate,
} from "react-router-dom";
import SearchPage from "./pages/SearchPage";
import CollectionPage from "./pages/CollectionPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="bg-light min-vh-100 d-flex flex-column">
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
          <div className="w-100 px-4">
            <div className="navbar-nav ms-auto gap-2">
            <span className="navbar-brand fw-semibold">MovieLog</span>
              <NavLink className="nav-link" to="/search">
                Search
              </NavLink>
              <NavLink className="nav-link" to="/collection">
                My Collection
              </NavLink>
            </div>
          </div>
        </nav>

        <main className="flex-grow-1 py-4">
          {/* This wrapper is already full width */}
          <div className="px-4">
            <Routes>
              <Route path="/" element={<Navigate to="/search" replace />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/collection" element={<CollectionPage />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}
