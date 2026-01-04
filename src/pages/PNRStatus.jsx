import React, { useState } from 'react';
import { Search, Hash, Clock, AlertCircle, ArrowRight, Train } from 'lucide-react';
import GoogleAd from '../components/GoogleAd';
import { getPNRStatus } from '../services/railwayApi';

const PNRStatus = () => {
    const [pnr, setPnr] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (pnr.length !== 10) {
            setError('PNR must be 10 digits');
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const data = await getPNRStatus(pnr);
            setResult(data);
        } catch (err) {
            setError(err.message || 'Failed to fetch PNR status');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fade-in" style={{ padding: '20px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px', marginTop: '12px' }}>
                PNR <span className="text-gradient">Status</span>
            </h2>

            {/* Top Ad - High engagement area */}
            <GoogleAd slot="pnr-top-banner" format="horizontal" />

            <form onSubmit={handleSearch} className="glass-panel" style={{ padding: '24px', marginBottom: '32px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent-color)', marginBottom: '8px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    PNR Number
                </label>
                <div style={{ position: 'relative', marginBottom: '24px' }}>
                    <Hash style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-secondary)' }} size={20} />
                    <input
                        type="number"
                        placeholder="e.g. 4215678902"
                        value={pnr}
                        onChange={(e) => setPnr(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '16px 16px 16px 48px',
                            background: 'rgba(0,0,0,0.2)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '16px',
                            color: 'white',
                            fontSize: '18px',
                            fontWeight: 600,
                            outline: 'none',
                            boxSizing: 'border-box',
                            transition: 'all 0.3s'
                        }}
                        maxLength={10}
                    />
                </div>
                <button
                    type="submit"
                    className="btn-primary"
                    style={{
                        width: '100%',
                        height: '56px',
                        fontSize: '16px',
                        fontWeight: 700,
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        boxShadow: '0 8px 16px -4px rgba(45, 212, 191, 0.3)'
                    }}
                    disabled={loading || pnr.length !== 10}
                >
                    {loading ? 'Fetching...' : (
                        <>
                            Check Status <ArrowRight size={20} />
                        </>
                    )}
                </button>
            </form>

            {/* Error Message */}
            {error && (
                <div style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '12px',
                    padding: '16px',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                }}>
                    <AlertCircle size={20} color="var(--danger)" />
                    <span style={{ color: 'var(--danger)', fontSize: '14px' }}>{error}</span>
                </div>
            )}

            {/* Result Ticket */}
            {result && (
                <div className="fade-in" style={{ marginTop: '32px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', marginLeft: '8px' }}>Ticket Details</h3>
                    <div className="glass-panel" style={{
                        padding: 0,
                        overflow: 'hidden',
                        position: 'relative',
                        color: 'white',
                        background: 'rgba(30, 41, 59, 0.6)'
                    }}>
                        {/* Header Strip */}
                        <div style={{
                            background: 'rgba(45, 212, 191, 0.1)',
                            borderBottom: '1px solid rgba(45, 212, 191, 0.2)',
                            padding: '16px 20px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Train size={18} color="var(--accent-color)" />
                                <span style={{ fontWeight: 600, color: 'var(--accent-color)' }}>{result.trainNo}</span>
                            </div>
                            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{result.trainName}</span>
                        </div>

                        {/* Main Body */}
                        <div style={{ padding: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                                <div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>From</div>
                                    <div style={{ fontSize: '24px', fontWeight: 800 }}>{result.from}</div>
                                    <div style={{ fontSize: '13px', fontWeight: 500 }}>{result.fromName}</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>{result.departureTime}</div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{result.duration}</div>
                                    <div style={{ width: '80%', height: '1px', background: 'rgba(255,255,255,0.1)', position: 'relative' }}>
                                        <div style={{ position: 'absolute', right: 0, top: '-3px', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text-secondary)' }}></div>
                                        <div style={{ position: 'absolute', left: 0, top: '-3px', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text-secondary)' }}></div>
                                    </div>
                                </div>

                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>To</div>
                                    <div style={{ fontSize: '24px', fontWeight: 800 }}>{result.to}</div>
                                    <div style={{ fontSize: '13px', fontWeight: 500 }}>{result.toName}</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>{result.arrivalTime}</div>
                                </div>
                            </div>

                            {/* Divider Dashed */}
                            <div style={{
                                borderTop: '2px dashed rgba(255,255,255,0.1)',
                                margin: '0 -20px 20px -20px',
                                position: 'relative'
                            }}>
                                <div style={{ position: 'absolute', left: '-10px', top: '-10px', width: '20px', height: '20px', borderRadius: '50%', background: '#0f172a' }}></div>
                                <div style={{ position: 'absolute', right: '-10px', top: '-10px', width: '20px', height: '20px', borderRadius: '50%', background: '#0f172a' }}></div>
                            </div>

                            {/* Passengers */}
                            <div>
                                {result.passengers.map((p, idx) => (
                                    <div key={idx} style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '12px',
                                        background: 'rgba(255,255,255,0.03)',
                                        borderRadius: '12px',
                                        marginBottom: idx !== result.passengers.length - 1 ? '8px' : 0,
                                        border: '1px solid rgba(255,255,255,0.05)'
                                    }}>
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: '14px' }}>{p.name}</div>
                                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{p.type}</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{
                                                color: p.status === 'CNF' ? 'var(--success)' : 'var(--warning)',
                                                fontWeight: 700,
                                                fontSize: '15px'
                                            }}>{p.status}</div>
                                            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>{p.berth}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PNRStatus;
