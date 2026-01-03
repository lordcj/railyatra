import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Calendar, ChevronRight, AlertCircle } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import GoogleAd from '../components/GoogleAd';
import AdContainer from '../components/AdContainer';
import { searchTrains } from '../services/railwayApi';

const TrainCard = ({ name, number, depTime, arrTime, duration, availability, price, onClick, fromStation, toStation }) => {
    const getStatusColor = (status) => {
        if (status.includes('AVL')) return 'var(--success)';
        if (status.includes('RAC')) return 'var(--warning)';
        return 'var(--danger)';
    };

    return (
        <div
            className="glass-panel"
            style={{ padding: '16px', marginBottom: '16px', cursor: 'pointer' }}
            onClick={onClick}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div>
                    <h4 style={{ fontWeight: 600 }}>{name}</h4>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>#{number}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--accent-color)' }}>₹{price}</span>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                    <div style={{ fontSize: '16px', fontWeight: 600 }}>{depTime}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{fromStation}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{duration}</div>
                    <div style={{ height: '2px', width: '60%', background: 'rgba(255,255,255,0.2)', position: 'relative' }}>
                        <div style={{ position: 'absolute', left: '0', top: '-3px', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--text-secondary)' }}></div>
                        <div style={{ position: 'absolute', right: '0', top: '-3px', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--text-secondary)' }}></div>
                    </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '16px', fontWeight: 600 }}>{arrTime}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{toStation}</div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                {availability.map((cls, idx) => (
                    <div key={idx} style={{
                        background: 'rgba(255,255,255,0.05)',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        minWidth: '80px',
                        border: cls.selected ? '1px solid var(--accent-color)' : '1px solid transparent'
                    }}>
                        <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: '2px' }}>{cls.type}</div>
                        <div style={{ fontSize: '12px', color: getStatusColor(cls.status) }}>{cls.status}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const SearchResults = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [trains, setTrains] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fromStation = searchParams.get('from') || 'New Delhi';
    const toStation = searchParams.get('to') || 'Mumbai';

    useEffect(() => {
        const fetchTrains = async () => {
            setLoading(true);
            setError(null);

            try {
                const data = await searchTrains(fromStation, toStation);
                setTrains(data);
            } catch (err) {
                setError(err.message || 'Failed to fetch trains');
            } finally {
                setLoading(false);
            }
        };

        fetchTrains();
    }, [fromStation, toStation]);

    return (
        <div className="fade-in" style={{ padding: '20px', paddingBottom: '100px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', marginTop: '12px' }}>
                <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h2 style={{ fontSize: '20px', fontWeight: 600 }}>
                        {fromStation} <span style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>to</span> {toStation}
                    </h2>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Today, 03 Jan • 1 Adult</span>
                </div>
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
            {!loading && !error && trains.map((train, idx) => (
                <div key={idx}>
                    {idx === 1 && <AdContainer label="Partner Offer" />}
                    <TrainCard
                        {...train}
                        fromStation={fromStation}
                        toStation={toStation}
                        onClick={() => navigate(`/train-details/${train.number}`)}
                    />
                </div>
            ))}

            {/* No Results */}
            {!loading && !error && trains.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <div style={{ fontSize: '16px', color: 'var(--text-secondary)' }}>No trains found for this route</div>
                </div>
            )}
        </div>
    );
};

export default SearchResults;
