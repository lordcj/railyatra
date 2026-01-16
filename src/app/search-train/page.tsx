'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2, Train } from 'lucide-react';
import { allTrains } from '@/data/trains';

export default function SearchTrainPage() {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Filter trains based on query
    const filteredTrains = query.length >= 2
        ? allTrains.filter(
            (train) =>
                train.number.includes(query) ||
                train.name.toLowerCase().includes(query.toLowerCase()) ||
                train.source.toLowerCase().includes(query.toLowerCase()) ||
                train.destination.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 20)
        : [];

    const handleTrainClick = (trainNo: string) => {
        setLoading(true);
        router.push(`/train/${trainNo}`);
    };

    return (
        <div className="fade-in" style={{ padding: '20px' }}>
            {/* Header */}
            <header style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '26px', fontWeight: 700, marginBottom: '8px' }}>
                    Search <span className="text-gradient">Trains</span>
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                    Find trains by number, name, or route
                </p>
            </header>

            {/* Search Box */}
            <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px' }}>
                <div style={{ position: 'relative' }}>
                    <Search
                        size={20}
                        style={{
                            position: 'absolute',
                            left: '16px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: 'var(--text-secondary)',
                        }}
                    />
                    <input
                        type="text"
                        placeholder="Enter train number or name..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '16px 16px 16px 48px',
                            fontSize: '15px',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 'var(--radius-md)',
                            color: 'white',
                        }}
                    />
                </div>
            </div>

            {/* Search Results */}
            {query.length >= 2 && (
                <section>
                    <h2 style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                        {filteredTrains.length > 0
                            ? `Found ${filteredTrains.length} trains`
                            : 'No trains found'}
                    </h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {filteredTrains.map((train) => (
                            <button
                                key={train.number}
                                onClick={() => handleTrainClick(train.number)}
                                disabled={loading}
                                className="glass-panel"
                                style={{
                                    padding: '16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    textAlign: 'left',
                                    border: 'none',
                                    cursor: 'pointer',
                                    width: '100%',
                                }}
                            >
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '10px',
                                    background: 'rgba(45, 212, 191, 0.15)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                }}>
                                    <Train size={20} color="rgb(45, 212, 191)" />
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{
                                        fontSize: '15px',
                                        fontWeight: 600,
                                        color: 'var(--text-primary)',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}>
                                        {train.number} - {train.name}
                                    </div>
                                    <div style={{
                                        fontSize: '12px',
                                        color: 'var(--text-secondary)',
                                        marginTop: '2px',
                                    }}>
                                        {train.source} → {train.destination}
                                    </div>
                                </div>
                                <span style={{
                                    fontSize: '10px',
                                    padding: '4px 8px',
                                    borderRadius: '8px',
                                    background: 'rgba(45, 212, 191, 0.15)',
                                    color: 'rgb(45, 212, 191)',
                                    flexShrink: 0,
                                }}>
                                    {train.type}
                                </span>
                            </button>
                        ))}
                    </div>
                </section>
            )}

            {/* Quick Links */}
            {query.length < 2 && (
                <section>
                    <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>
                        Quick Tips
                    </h2>
                    <ul style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '2' }}>
                        <li>• Enter train number (e.g., 12951)</li>
                        <li>• Search by train name (e.g., Rajdhani)</li>
                        <li>• Search by city (e.g., Mumbai, Delhi)</li>
                    </ul>
                </section>
            )}

            {loading && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                }}>
                    <Loader2 size={32} className="live-pulse" color="var(--accent-color)" />
                </div>
            )}
        </div>
    );
}
