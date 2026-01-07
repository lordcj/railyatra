import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Calendar, ChevronRight, AlertCircle } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import GoogleAd from '../components/GoogleAd';
import AdContainer from '../components/AdContainer';
import { searchTrains } from '../services/railwayApi';

const TrainCard = ({ name, number, depTime, arrTime, duration, price, onClick, fromStation, toStation, runningDays }) => {
    const weekDays = [
        { short: 'S', full: 'Sun' },
        { short: 'M', full: 'Mon' },
        { short: 'T', full: 'Tue' },
        { short: 'W', full: 'Wed' },
        { short: 'T', full: 'Thu' },
        { short: 'F', full: 'Fri' },
        { short: 'S', full: 'Sat' }
    ];

    const isRunningOnDay = (dayChar) => {
        if (!runningDays || runningDays.length === 0) return true;
        return runningDays.includes(dayChar);
    };

    return (
        <div
            className="glass-panel"
            onClick={onClick}
            style={{ padding: '16px', marginBottom: '16px', border: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }}
        >
            {/* Header: Train Name & Number */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ flex: 1 }}>
                    <h4 style={{ fontWeight: 600, fontSize: '15px', color: 'var(--text-primary)', marginBottom: '2px' }}>{name}</h4>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>#{number}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '2px' }}>Est. Fare</div>
                    <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--accent-color)' }}>₹{price}</span>
                </div>
            </div>

            {/* Time Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                    <div style={{ fontSize: '20px', fontWeight: 700 }}>{depTime}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{fromStation}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, padding: '0 12px' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '6px' }}>{duration}</div>
                    <div style={{ height: '2px', width: '100%', background: 'rgba(255,255,255,0.1)', position: 'relative' }}>
                        <div style={{ position: 'absolute', left: '0', top: '-3px', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-color)' }}></div>
                        <div style={{ position: 'absolute', right: '0', top: '-3px', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-color)' }}></div>
                    </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '20px', fontWeight: 700 }}>{arrTime}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{toStation}</div>
                </div>
            </div>

            {/* Runs On Section */}
            <div style={{
                borderTop: '1px solid rgba(255,255,255,0.05)',
                paddingTop: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            }}>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 500 }}>Runs on:</span>
                <div style={{ display: 'flex', gap: '6px' }}>
                    {weekDays.map((day, idx) => {
                        const active = isRunningOnDay(day.short);
                        return (
                            <div
                                key={idx}
                                style={{
                                    fontSize: '10px',
                                    fontWeight: 600,
                                    padding: '4px 6px',
                                    borderRadius: '4px',
                                    background: active ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255,255,255,0.03)',
                                    color: active ? 'var(--success)' : 'rgba(255,255,255,0.2)',
                                    border: active ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(255,255,255,0.05)'
                                }}
                            >
                                {day.short}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};


const SearchResults = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const fromStation = searchParams.get('from');
    const toStation = searchParams.get('to');
    const selectedDate = searchParams.get('date');
    const initialClass = (searchParams.get('class') || 'ALL').toUpperCase();

    const [trains, setTrains] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedClass, setSelectedClass] = useState(initialClass);

    // Sync internal state with URL parameter for robust filtering
    useEffect(() => {
        const clsInUrl = (searchParams.get('class') || 'ALL').toUpperCase();
        // console.log('🔄 URL Sync Active. Filter is now:', clsInUrl);
        setSelectedClass(clsInUrl);
    }, [searchParams]);

    useEffect(() => {
        const fetchTrains = async () => {
            if (!fromStation || !toStation) return;
            setLoading(true);
            try {
                const results = await searchTrains(fromStation, toStation, selectedDate);
                // console.log('🚄 Search Results Loaded:', results.length, 'trains found');
                if (results.length > 0) {
                    // console.log('DEBUG: First train availability:', results[0].availability);
                }
                setTrains(results);
            } catch (err) {
                // console.error('API Error:', err);
                setError('Failed to fetch trains. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchTrains();
    }, [fromStation, toStation, selectedDate]);

    const handleClassFilter = (value) => {
        const newParams = new URLSearchParams(searchParams);
        if (value === 'ALL') {
            newParams.delete('class');
        } else {
            newParams.set('class', value);
        }
        setSearchParams(newParams);
        setSelectedClass(value);
    };

    const filteredTrains = trains.filter(train => {
        if (!selectedClass || selectedClass === 'ALL') return true;

        const trainClasses = train.availability.map(a => a.type.toUpperCase().trim());
        const filterVal = selectedClass.toUpperCase();

        // console.log(`Checking Train ${train.number}: classes=${JSON.stringify(trainClasses)}, filter=${filterVal}`);

        if (filterVal === 'AC') {
            const acPatterns = ['1A', '2A', '3A', '3E', 'CC', 'EC', 'AC', 'TIER', 'EXEC'];
            const match = trainClasses.some(cls => acPatterns.some(p => cls.includes(p)));
            // console.log(`  AC Match Result: ${match}`);
            return match;
        }

        if (filterVal === 'GENERAL' || filterVal === 'GN') {
            const genPatterns = ['2S', 'GN', 'UR', 'GEN', 'UNRESERVED'];
            return trainClasses.some(cls => genPatterns.some(p => cls.includes(p)));
        }

        if (filterVal === 'SL' || filterVal === 'SLEEPER') {
            return trainClasses.some(cls => cls === 'SL' || cls.includes('SLEEPER'));
        }

        return trainClasses.some(cls => cls === filterVal || cls.includes(filterVal));
    });

    const FilterButton = ({ label, value }) => (
        <button
            onClick={() => handleClassFilter(value)}
            className={`filter-chip ${selectedClass === value ? 'active' : ''}`}
            style={{
                padding: '10px 20px',
                borderRadius: '100px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: selectedClass === value ? 'var(--accent-color)' : 'rgba(255,255,255,0.05)',
                color: selectedClass === value ? 'black' : 'white',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap'
            }}
        >
            {label}
        </button>
    );

    return (
        <div className="fade-in" style={{ padding: '20px', paddingBottom: '100px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', marginTop: '12px' }}>
                <button
                    onClick={() => (window.history.state && window.history.state.idx > 0) ? navigate(-1) : navigate('/')}
                    aria-label="Go Back"
                    style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
                >
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h2 style={{ fontSize: '20px', fontWeight: 600 }}>
                        {fromStation} <span style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>to</span> {toStation}
                    </h2>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        {selectedDate ? new Date(selectedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Today'}, 2026 • 1 Adult
                    </span>
                </div>
            </div>

            {/* Filters */}
            <div style={{
                display: 'flex',
                gap: '8px',
                overflowX: 'auto',
                marginBottom: '20px',
                paddingBottom: '8px',
                scrollbarWidth: 'none'
            }}>
                <FilterButton label="All" value="ALL" />
                <FilterButton label="AC Trains" value="AC" />
                <FilterButton label="General/UR" value="GENERAL" />
                <FilterButton label="Sleeper" value="SL" />
                <FilterButton label="3rd AC" value="3A" />
                <FilterButton label="Chair Car" value="CC" />
            </div>

            {/* Search Summary Text for SEO */}
            <div style={{ marginBottom: '20px', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                Showing <strong>{filteredTrains.length}</strong> trains from {fromStation || 'Source'} to {toStation || 'Destination'}.
                RailYatra helps you find Indian Railways train information easily.
                Check seat availability, coach composition, and running status.
            </div>

            {/* Loading State */}
            {loading && (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <div style={{ fontSize: '16px', color: 'var(--text-secondary)' }}>Searching trains...</div>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '12px',
                    padding: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                }}>
                    <AlertCircle size={24} color="var(--danger)" />
                    <div>
                        <div style={{ fontWeight: 600, marginBottom: '4px' }}>Unable to fetch trains</div>
                        <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{error}</div>
                    </div>
                </div>
            )}

            {/* Train List */}
            {!loading && !error && filteredTrains.map((train, idx) => (
                <div key={idx}>
                    <TrainCard
                        {...train}
                        fromStation={fromStation}
                        toStation={toStation}
                        onClick={() => navigate(`/train-details/${train.number}`)}
                    />
                </div>
            ))}

            {/* No Results */}
            {!loading && !error && filteredTrains.length === 0 && (
                <div style={{ textAlign: 'center', padding: '60px 40px', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                    <AlertCircle size={40} style={{ color: 'var(--text-secondary)', marginBottom: '16px', opacity: 0.5 }} />
                    <div style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>No trains found matching filters</div>
                    <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px' }}>Try switching to a different travel class or reset filters.</div>
                    <button
                        onClick={() => handleClassFilter('ALL')}
                        style={{ background: 'var(--accent-color)', border: 'none', color: 'black', padding: '10px 24px', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' }}
                    >
                        Show All Trains
                    </button>
                </div>
            )}


            {/* Travel Tips Content for AdSense */}
            {
                !loading && (
                    <div style={{ marginTop: '40px', padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'white', marginBottom: '12px' }}>Travel Booking Tips</h3>
                        <ul style={{ fontSize: '13px', color: 'var(--text-secondary)', paddingLeft: '20px', lineHeight: '1.8' }}>
                            <li>Book <strong>Tatkal tickets</strong> starting at 10:00 AM for AC classes and 11:00 AM for Non-AC classes one day before travel.</li>
                            <li>Check <strong>PNR Status</strong> regularly to see confirmation probabilities for waitlisted tickets.</li>
                            <li>Use alternative station search if direct trains are unavailable or fully booked.</li>
                            <li>Carry a valid ID proof (Aadhar, PAN, Voter ID) during your journey as per IRCTC guidelines.</li>
                        </ul>
                    </div>
                )
            }
        </div >
    );
};

export default SearchResults;
