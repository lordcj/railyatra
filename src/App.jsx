import React from 'react'
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Navbar from './components/Navbar'

import SearchResults from './pages/SearchResults'
import TrainSearch from './pages/TrainSearch'
import TrainDetails from './pages/TrainDetails'
import PNRStatus from './pages/PNRStatus'

// Placeholder for other pages
const LiveStatus = () => <div className="p-4 pt-20">Live Status (Coming Soon)</div>

function AppContent() {
    const location = useLocation();
    const isHome = location.pathname === '/';

    return (
        <>
            <div className="app-container" style={{ paddingBottom: '80px' }}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/trains" element={<SearchResults />} />
                    <Route path="/search-train" element={<TrainSearch />} />
                    <Route path="/train-details/:trainNo" element={<TrainDetails />} />
                    <Route path="/pnr" element={<PNRStatus />} />
                    <Route path="/live" element={<LiveStatus />} />
                </Routes>
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
