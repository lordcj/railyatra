import React, { Suspense } from 'react'
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import LoadingSpinner from './components/LoadingSpinner';
import Home from './pages/Home';
import Navbar from './components/Navbar';

// Lazy Load Pages for Performance
const SearchResults = React.lazy(() => import('./pages/SearchResults'));
const TrainSearch = React.lazy(() => import('./pages/TrainSearch'));
const TrainDetails = React.lazy(() => import('./pages/TrainDetails'));
const PNRStatus = React.lazy(() => import('./pages/PNRStatus'));

const Privacy = React.lazy(() => import('./pages/Privacy'));
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
                        src="/logo_small.png"
                        fetchpriority="high"
                        alt="RailYatra"
                        width="28"
                        height="28"
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
                <Suspense fallback={<LoadingSpinner />}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/trains" element={<SearchResults />} />
                        <Route path="/search-train" element={<TrainSearch />} />
                        {/* SEO: Train details with clean URL */}
                        <Route path="/train" element={<Navigate to="/search-train" replace />} />
                        <Route path="/train/:trainNo" element={<TrainDetails />} />
                        <Route path="/train-details/:trainNo" element={<TrainDetails />} />
                        {/* SEO: PNR with optional direct lookup */}
                        <Route path="/pnr" element={<PNRStatus />} />
                        <Route path="/pnr/:pnrNumber" element={<PNRStatus />} />
                        {/* SEO: Live status with optional train number */}
                        <Route path="/live" element={<Navigate to="/search-train" replace />} />
                        <Route path="/live/:trainNo" element={<TrainDetails />} />
                        <Route path="/privacy" element={<Privacy />} />
                        {/* Catch-all redirect */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Suspense>

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

import ScrollToTop from './components/ScrollToTop'
import { initGA } from './services/analytics';
import AnalyticsTracker from './components/AnalyticsTracker';

// Initialize GA4
initGA();

function App() {
    return (
        <BrowserRouter>
            <AnalyticsTracker />
            <ScrollToTop />
            <AppContent />
        </BrowserRouter>
    )
}

export default App
