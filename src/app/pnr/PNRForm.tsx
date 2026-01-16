'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2 } from 'lucide-react';

export function PNRForm() {
    const [pnr, setPnr] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validate PNR
        const cleanPnr = pnr.replace(/\s/g, '');
        if (!/^\d{10}$/.test(cleanPnr)) {
            setError('Please enter a valid 10-digit PNR number');
            return;
        }

        setLoading(true);

        // Navigate to PNR result page
        router.push(`/pnr/${cleanPnr}`);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="glass-panel" style={{ padding: '24px' }}>
                <div style={{ marginBottom: '16px' }}>
                    <label
                        htmlFor="pnr"
                        style={{
                            display: 'block',
                            fontSize: '13px',
                            color: 'var(--text-secondary)',
                            marginBottom: '8px',
                        }}
                    >
                        Enter 10-digit PNR Number
                    </label>
                    <input
                        id="pnr"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={10}
                        placeholder="e.g., 8523645987"
                        value={pnr}
                        onChange={(e) => {
                            setPnr(e.target.value.replace(/\D/g, ''));
                            setError('');
                        }}
                        style={{
                            width: '100%',
                            padding: '16px',
                            fontSize: '18px',
                            fontWeight: 600,
                            letterSpacing: '2px',
                            background: 'rgba(255,255,255,0.05)',
                            border: error ? '1px solid var(--error)' : '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 'var(--radius-md)',
                            color: 'white',
                            textAlign: 'center',
                        }}
                    />
                    {error && (
                        <p style={{ color: 'var(--error)', fontSize: '12px', marginTop: '8px' }}>
                            {error}
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={loading || pnr.length !== 10}
                    className="btn-primary"
                    style={{ width: '100%' }}
                >
                    {loading ? (
                        <>
                            <Loader2 size={18} className="live-pulse" />
                            Checking...
                        </>
                    ) : (
                        <>
                            <Search size={18} />
                            Check PNR Status
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
