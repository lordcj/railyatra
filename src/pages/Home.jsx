import React, { useState } from 'react';
import { Train, Calendar, MapPin, Utensils, AlertCircle, IndianRupee } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import GoogleAd from '../components/GoogleAd';

const QuickAction = ({ icon: Icon, label, color, onClick }) => (
    <button
        onClick={onClick}
        aria-label={label}
        className="glass-panel"
        style={{
            border: 'none',
            padding: '20px 16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '14px',
            cursor: 'pointer',
            height: '100%',
            width: '100%',
            transition: 'all 0.2s ease',
            background: 'rgba(30, 41, 59, 0.6)'
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
    >
        <div style={{
            background: `rgba(${color}, 0.15)`,
            padding: '14px',
            borderRadius: '16px',
            color: `rgb(${color})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <Icon size={26} strokeWidth={2} />
        </div>
        <span style={{
            color: 'var(--text-primary)',
            fontSize: '13px',
            fontWeight: 600,
            letterSpacing: '-0.01em',
            textAlign: 'center',
            lineHeight: '1.3'
        }}>{label}</span>
    </button>
);

import StationSearch from '../components/StationSearch';

const Home = () => {
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [fromStation, setFromStation] = useState('');
    const [toStation, setToStation] = useState('');
    const [selectedClass, setSelectedClass] = useState('ALL');

    // Handle Order Food - Redirect to IRCTC e-Catering
    const handleOrderFood = () => {
        window.open('https://www.ecatering.irctc.co.in/', '_blank', 'noopener,noreferrer');
    };

    // Handle Fare Enquiry - Redirect to IRCTC fare calculator
    const handleFareEnquiry = () => {
        window.open('https://www.irctc.co.in/nget/train-search', '_blank', 'noopener,noreferrer');
    };

    const handleSearch = (e) => {
        e.preventDefault();

        // Handle Search by Train Number
        const trainNumberRegex = /^\d{5}$/;
        if (trainNumberRegex.test(fromStation.trim())) {
            navigate(`/train-details/${fromStation.trim()}`);
            return;
        }

        if (fromStation && toStation) {
            // Pass search params to results page including date and class
            navigate(`/trains?from=${encodeURIComponent(fromStation)}&to=${encodeURIComponent(toStation)}&date=${selectedDate}&class=${selectedClass}`);
        }
    };

    const FilterButton = ({ label, value }) => (
        <button
            type="button"
            onClick={() => setSelectedClass(value)}
            style={{
                background: selectedClass === value ? 'var(--accent-color)' : 'rgba(255,255,255,0.05)',
                color: selectedClass === value ? 'white' : 'var(--text-secondary)',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                flex: 1
            }}
        >
            {label}
        </button>
    );

    return (
        <div className="fade-in" style={{ padding: '20px' }}>
            {/* Header */}
            <header style={{ marginBottom: '28px', marginTop: '8px' }}>
                <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '4px', letterSpacing: '-0.01em' }}>
                    Hello, <span style={{ color: 'var(--text-primary)' }}>Traveler</span> 👋
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '15px', fontWeight: 500 }}>Where is your next journey?</p>
            </header>

            {/* Main Search Card */}
            <div className="glass-panel" style={{ padding: '24px', marginBottom: '32px' }}>
                <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                    <StationSearch
                        label="From (or Train #)"
                        placeholder="Station Code/Name or 5-digit #"
                        value={fromStation}
                        onChange={setFromStation}
                        icon={MapPin}
                    />

                    <StationSearch
                        label="To Station"
                        placeholder="Enter Destination Code/Name"
                        value={toStation}
                        onChange={setToStation}
                        icon={MapPin}
                    />

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <Calendar size={20} color="var(--accent-color)" />
                        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                            <span style={{ fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '2px' }}>Journey Date</span>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--text-primary)',
                                    fontSize: '16px',
                                    fontFamily: 'inherit',
                                    outline: 'none',
                                    cursor: 'pointer',
                                    width: '100%'
                                }}
                                aria-label="Journey Date"
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Travel Class</span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <FilterButton label="All" value="ALL" />
                            <FilterButton label="AC" value="AC" />
                            <FilterButton label="SL" value="SL" />
                            <FilterButton label="GN" value="GENERAL" />
                        </div>
                    </div>

                    <button type="submit" className="btn-primary" style={{ marginTop: '12px' }}>
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
                    onClick={handleOrderFood}
                />
                <QuickAction
                    icon={IndianRupee}
                    label="Fare Enquiry"
                    color="168, 85, 247" // Purple
                    onClick={handleFareEnquiry}
                />
            </div>
        </div>
    );
};

export default Home;
