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
import SEOHead from '../components/SEOHead';

const Home = () => {
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [fromStation, setFromStation] = useState('');
    const [toStation, setToStation] = useState('');
    const [selectedClass, setSelectedClass] = useState('ALL');
    const [searchMode, setSearchMode] = useState('STATION'); // 'STATION' | 'NUMBER'

    // JSON-LD Structured Data
    const homeJsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebSite",
                "@id": "https://railyatra.co.in/#website",
                "url": "https://railyatra.co.in",
                "name": "RailYatra",
                "publisher": {
                    "@id": "https://railyatra.co.in/#organization"
                },
                "potentialAction": {
                    "@type": "SearchAction",
                    "target": "https://railyatra.co.in/search-train?number={search_term_string}",
                    "query-input": "required name=search_term_string"
                }
            },
            {
                "@type": "Organization",
                "@id": "https://railyatra.co.in/#organization",
                "name": "RailYatra",
                "url": "https://railyatra.co.in",
                "logo": {
                    "@type": "ImageObject",
                    "url": "https://railyatra.co.in/logo.png",
                    "width": 512,
                    "height": 512
                },
                "sameAs": [
                    "https://twitter.com/railyatra",
                    "https://facebook.com/railyatra"
                ]
            }
        ]
    };

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

        if (searchMode === 'NUMBER') {
            const trainNumberRegex = /^\d{5}$/;
            if (trainNumberRegex.test(fromStation.trim())) {
                navigate(`/train-details/${fromStation.trim()}`);
            } else {
                // simple alert or error handling if needed, though HTML5 validation helps
                alert('Please enter a valid 5-digit number');
            }
            return;
        }

        if (fromStation && toStation) {
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
            <SEOHead
                title="RailYatra - Indian Railway PNR Status, Live Train Status & Schedule"
                description="Check confirmed PNR status, live train running status, seat availability and train time table. Fast, simple, and ad-free experience on RailYatra."
                jsonLd={homeJsonLd}
            />
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

                    {/* Search Mode Toggle */}
                    <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '4px', marginBottom: '8px' }}>
                        <button
                            type="button"
                            onClick={() => { setSearchMode('STATION'); setFromStation(''); }}
                            style={{
                                flex: 1,
                                padding: '8px',
                                border: 'none',
                                borderRadius: '8px',
                                background: searchMode === 'STATION' ? 'rgba(255,255,255,0.1)' : 'transparent',
                                color: searchMode === 'STATION' ? 'white' : 'var(--text-secondary)',
                                fontWeight: 600,
                                fontSize: '13px',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            By Station
                        </button>
                        <button
                            type="button"
                            onClick={() => { setSearchMode('NUMBER'); setFromStation(''); }}
                            style={{
                                flex: 1,
                                padding: '8px',
                                border: 'none',
                                borderRadius: '8px',
                                background: searchMode === 'NUMBER' ? 'rgba(255,255,255,0.1)' : 'transparent',
                                color: searchMode === 'NUMBER' ? 'white' : 'var(--text-secondary)',
                                fontWeight: 600,
                                fontSize: '13px',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            By Train No.
                        </button>
                    </div>

                    {searchMode === 'STATION' ? (
                        <>
                            <StationSearch
                                label="From Station"
                                placeholder="Station Code or Name"
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
                        </>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <Train size={20} color="var(--accent-color)" />
                            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                <span style={{ fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '2px' }}>Train Number</span>
                                <input
                                    type="number"
                                    value={fromStation} /* reusing fromStation state for train number */
                                    onChange={(e) => setFromStation(e.target.value)}
                                    placeholder="Enter 5-digit number"
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: 'var(--text-primary)',
                                        fontSize: '16px',
                                        fontFamily: 'inherit',
                                        outline: 'none',
                                        width: '100%'
                                    }}
                                />
                            </div>
                        </div>
                    )}

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
                        {searchMode === 'STATION' ? 'Search Trains' : 'Check Schedule'}
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

            {/* Why Choose RailYatra Section - AdSense Content */}
            <div className="glass-panel" style={{ padding: '32px', marginBottom: '80px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px' }}>Why Choose <span className="text-gradient">RailYatra</span>?</h2>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
                    <div>
                        <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px', color: 'var(--accent-color)' }}>Fastest PNR Status Updates</h3>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '15px' }}>
                            RailYatra provides the fastest and most accurate PNR status for Indian Railways bookings. Whether you have a confirm ticket, RAC, or waiting list (WL), our direct integration allows you to check your current booking status in milliseconds. We decode the complex IRCTC codes so you know exactly which coach and berth interpret your journey.
                        </p>
                    </div>

                    <div>
                        <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px', color: 'var(--accent-color)' }}>Real-Time Train Tracking</h3>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '15px' }}>
                            Never miss a train again with our live train running status. Our GPS-based tracking system gives you the exact location of your train, estimated time of arrival (ETA), and delay updates. We cover all trains including Rajdhani, Shatabdi, Vande Bharat, and local passenger trains, ensuring you can plan your pickup and drop-offs accurately.
                        </p>
                    </div>

                    <div>
                        <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px', color: 'var(--accent-color)' }}>Comprehensive Train Schedules</h3>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '15px' }}>
                            Access the latest time table for over 5,000 Indian Railways trains. Our database is updated daily to reflect changes in routes, stoppages, and timing. You can search by train number or station name to find the most convenient connection for your travel. We also provide information on station facilities, platform numbers, and pantry availability.
                        </p>
                    </div>

                    <div>
                        <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px', color: 'var(--accent-color)' }}>User-Friendly & Ad-Lite</h3>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '15px' }}>
                            Unlike other rail apps cluttered with invasive ads, RailYatra focuses on a clean, premium user experience. Our glassmorphism design ensures readability and ease of use on all devices. We value your privacy and data security, providing a safe environment to check your travel details without unnecessary distractions.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
