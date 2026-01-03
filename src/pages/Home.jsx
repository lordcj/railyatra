import React, { useState } from 'react';
import { Search, Train, Calendar, MapPin, ArrowRight, Utensils, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import GoogleAd from '../components/GoogleAd';

const QuickAction = ({ icon: Icon, label, color, onClick }) => (
    <button
        onClick={onClick}
        className="glass-panel"
        style={{
            border: 'none',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            height: '100%',
            width: '100%'
        }}
    >
        <div style={{
            background: `rgba(${color}, 0.1)`,
            padding: '12px',
            borderRadius: '50%',
            color: `rgb(${color})`
        }}>
            <Icon size={24} />
        </div>
        <span style={{ color: 'var(--text-primary)', fontSize: '12px', fontWeight: 500 }}>{label}</span>
    </button>
);

const Home = () => {
    const navigate = useNavigate();
    const [fromStation, setFromStation] = useState('');
    const [toStation, setToStation] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        if (fromStation && toStation) {
            // Pass search params to results page
            navigate(`/trains?from=${encodeURIComponent(fromStation)}&to=${encodeURIComponent(toStation)}`);
        }
    };

    return (
        <div className="fade-in" style={{ padding: '20px' }}>
            {/* Header */}
            <header style={{ marginBottom: '32px', marginTop: '12px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '4px' }}>
                    Hello, <span className="text-gradient">Traveler</span>
                </h1>
                <p style={{ color: 'var(--text-secondary)' }}>Where is your next journey?</p>
            </header>

            {/* Main Search Card */}
            <div className="glass-panel" style={{ padding: '24px', marginBottom: '32px' }}>
                <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px' }}>
                        <MapPin size={20} color="var(--accent-color)" />
                        <input
                            type="text"
                            placeholder="From Station"
                            value={fromStation}
                            onChange={(e) => setFromStation(e.target.value)}
                            style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none', fontSize: '16px' }}
                        />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px' }}>
                        <MapPin size={20} color="var(--accent-color)" />
                        <input
                            type="text"
                            placeholder="To Station"
                            value={toStation}
                            onChange={(e) => setToStation(e.target.value)}
                            style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none', fontSize: '16px' }}
                        />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '12px' }}>
                        <Calendar size={20} color="var(--text-secondary)" />
                        <span style={{ color: 'var(--text-primary)', fontSize: '16px' }}>Today, 03 Jan</span>
                    </div>

                    <button type="submit" className="btn-primary" style={{ marginTop: '8px' }}>
                        Search Trains
                    </button>
                </form>
            </div>

            {/* Sponsored Ad - Top placement for maximum visibility */}
            <GoogleAd slot="home-top-banner" format="horizontal" />

            {/* Quick Actions Grid */}
            <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: 600 }}>Services</h3>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '16px',
                marginBottom: '32px'
            }}>
                <QuickAction
                    icon={AlertCircle}
                    label="PNR Status"
                    color="45, 212, 191" // Teal
                    onClick={() => navigate('/pnr')}
                />
                <QuickAction
                    icon={Train}
                    label="Live Train"
                    color="56, 189, 248" // Sky Blue
                    onClick={() => navigate('/search-train')}
                />
                <QuickAction
                    icon={Utensils}
                    label="Order Food"
                    color="251, 146, 60" // Orange
                    onClick={() => { }}
                />
                <QuickAction
                    icon={Search}
                    label="Seat Layout"
                    color="168, 85, 247" // Purple
                    onClick={() => { }}
                />
            </div>

            {/* Recent / Promo */}
            <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <h4 style={{ fontWeight: 600, marginBottom: '4px' }}>Vande Bharat Special</h4>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Experience world-class travel</p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '8px', borderRadius: '50%' }}>
                    <ArrowRight size={20} />
                </div>
            </div>
        </div>
    );
};

export default Home;
