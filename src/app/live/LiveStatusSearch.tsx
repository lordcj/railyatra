'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2, Train } from 'lucide-react';

export function LiveStatusSearch() {
    const [trainNo, setTrainNo] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const cleanNo = trainNo.trim();
        if (!/^\d{4,5}$/.test(cleanNo)) {
            setError('Please enter a valid 4 or 5 digit train number');
            return;
        }

        setLoading(true);
        router.push(`/live/${cleanNo}`);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="glass-panel" style={{ padding: '24px' }}>
                <div style={{ marginBottom: '16px' }}>
                    <label
                        htmlFor="trainNo"
                        style={{
                            display: 'block',
                            fontSize: '13px',
                            color: 'var(--text-secondary)',
                            marginBottom: '8px',
                        }}
                    >
                        Enter Train Number
                    </label>
                    <div style={{ position: 'relative' }}>
                        <Train
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
                            id="trainNo"
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={5}
                            placeholder="e.g., 12951"
                            value={trainNo}
                            onChange={(e) => {
                                setTrainNo(e.target.value.replace(/\D/g, ''));
                                setError('');
                            }}
                            style={{
                                width: '100%',
                                padding: '16px 16px 16px 48px',
                                fontSize: '18px',
                                fontWeight: 600,
                                letterSpacing: '2px',
                                background: 'rgba(255,255,255,0.05)',
                                border: error ? '1px solid var(--error)' : '1px solid rgba(255,255,255,0.1)',
                                borderRadius: 'var(--radius-md)',
                                color: 'white',
                            }}
                        />
                    </div>
                    {error && (
                        <p style={{ color: 'var(--error)', fontSize: '12px', marginTop: '8px' }}>
                            {error}
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={loading || trainNo.length < 4}
                    className="btn-primary"
                    style={{ width: '100%' }}
                >
                    {loading ? (
                        <>
                            <Loader2 size={18} className="live-pulse" />
                            Tracking...
                        </>
                    ) : (
                        <>
                            <Search size={18} />
                            Track Train
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
