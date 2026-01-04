import React, { useState, useEffect } from 'react';
import { Search, Clock, ArrowRight, Train } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TrainSearch = () => {
    const navigate = useNavigate();
    const [trainNo, setTrainNo] = useState('');

    // Scroll to top when component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (trainNo) {
            navigate(`/train-details/${trainNo}`);
        }
    };

    const recentTrains = [
        { name: "Vande Bharat Exp", number: "22436" },
        { name: "Shatabdi Express", number: "12002" }
    ];

    return (
        <div className="fade-in" style={{ padding: '20px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px', marginTop: '12px' }}>
                Find <span className="text-gradient">Train</span>
            </h2>

            <div className="glass-panel" style={{ padding: '24px', marginBottom: '32px' }}>
                <form onSubmit={handleSearch}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                            Train Number or Name
                        </label>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            background: 'rgba(0,0,0,0.2)',
                            padding: '12px',
                            borderRadius: '12px',
                            border: '1px solid rgba(255,255,255,0.05)'
                        }}>
                            <Train size={20} color="var(--accent-color)" />
                            <input
                                type="text"
                                placeholder="Ex. 12951"
                                value={trainNo}
                                onChange={(e) => setTrainNo(e.target.value)}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'white',
                                    width: '100%',
                                    outline: 'none',
                                    fontSize: '16px',
                                    fontWeight: 500
                                }}
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn-primary">
                        Get Schedule
                    </button>
                </form>
            </div>

            <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: 600 }}>Recent Searches</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {recentTrains.map((train, idx) => (
                    <div key={idx}
                        onClick={() => navigate(`/train-details/${train.number}`)}
                        className="glass-panel"
                        style={{
                            padding: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '50%' }}>
                                <Clock size={20} color="var(--text-secondary)" />
                            </div>
                            <div>
                                <div style={{ fontWeight: 600 }}>{train.number}</div>
                                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{train.name}</div>
                            </div>
                        </div>
                        <ArrowRight size={20} color="var(--text-secondary)" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TrainSearch;
