import React from 'react'
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Navbar from './components/Navbar'

import SearchResults from './pages/SearchResults'
import TrainSearch from './pages/TrainSearch'
import TrainDetails from './pages/TrainDetails'
import PNRStatus from './pages/PNRStatus'
import LiveTrainStatus from './pages/LiveTrainStatus'
import Privacy from './pages/Privacy'
import { Link } from 'react-router-dom'

function AppContent() {
    const location = useLocation();
    const isHome = location.pathname === '/';

    return (
        <>
            {/* Subtle Sticky Top Bar with Mini Logo */}
            <div style={{
                position: 'sticky',
                top: 0,
                zIndex: 100,
                background: 'rgba(15, 23, 42, 0.85)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                padding: '8px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
            }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                    <img
                        src="/logo.png"
                        alt="RailYatra"
                        style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '6px',
                            objectFit: 'cover'
                        }}
                    />
                    <span style={{
                        fontSize: '16px',
                        fontWeight: 700,
                        letterSpacing: '-0.01em',
                        background: 'linear-gradient(135deg, #2dd4bf 0%, #38bdf8 100%)',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        RailYatra
                    </span>
                </Link>
            </div>

            <div className="app-container" style={{ paddingBottom: '120px' }}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/trains" element={<SearchResults />} />
                    <Route path="/search-train" element={<TrainSearch />} />
                    <Route path="/train-details/:trainNo" element={<TrainDetails />} />
                    <Route path="/pnr" element={<PNRStatus />} />
                    <Route path="/live" element={<LiveTrainStatus />} />
                    <Route path="/privacy" element={<Privacy />} />
                </Routes>

                {/* Subtle Footer */}
                <div style={{
                    padding: '20px',
                    textAlign: 'center',
                    opacity: 0.5,
                    fontSize: '12px'
                }}>
                    <Link to="/privacy" style={{ color: 'white', textDecoration: 'none', margin: '0 10px' }}>Privacy Policy</Link>
                    <span style={{ margin: '0 10px' }}>•</span>
                    <span>&copy; 2026 RailYatra</span>
                </div>
            </div>
            <Navbar />
        </>
    )
}

function App() {
    return (
        <HashRouter>
            <AppContent />
        </HashRouter>
    )
}

export default App
