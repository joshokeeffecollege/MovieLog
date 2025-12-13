import {BrowserRouter, Routes, Route, NavLink, Navigate} from 'react-router-dom'
import SearchPage from './pages/SearchPage'
import CollectionPage from './pages/CollectionPage'

export default function App() {
    return (
        <BrowserRouter>
            <nav className="navbar navbar-expand navbar-dark bg-dark">
                <div className="container">
                    <span className="navbar-brand">MovieLog</span>
                    <div className="navbar-nav">
                        <NavLink className="nav-link" to="/search">Search</NavLink>
                        <NavLink className="nav-link" to="/collection">My Collection</NavLink>
                    </div>
                </div>
            </nav>

            <main className="container py-4">
                <Routes>
                    <Route path="/" element={<Navigate to="/search" replace/>}/>
                    <Route path="/search" element={<SearchPage/>}/>
                    <Route path="/collection" element={<CollectionPage/>}/>
                </Routes>
            </main>
        </BrowserRouter>
    )
}