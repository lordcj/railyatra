'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2, CheckCircle, AlertCircle, Clock, Train, User } from 'lucide-react';

interface Passenger {
    name: string;
    status: string;
    bookingStatus: string;
    berth: string;
    coach: string;
    berthCode: string;
}

interface PNRResult {
    trainName: string;
    trainNo: string;
    doj: string;
    from: string;
    fromName: string;
    to: string;
    toName: string;
    departureTime: string;
    arrivalTime: string;
    duration: string;
    travelClass: string;
    quota: string;
    chartPrepared: boolean;
    passengers: Passenger[];
}

export default function PNRResultClient() {
    const params = useParams();
    const pnrNumber = params.pnrNumber as string;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<PNRResult | null>(null);

    useEffect(() => {
        const fetchPNR = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(`/api/pnr/${pnrNumber}`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Failed to fetch PNR status');
                }

                setResult(data);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        if (pnrNumber) {
            fetchPNR();
        }
    }, [pnrNumber]);

    const getStatusColor = (status: string) => {
        if (status.includes('CNF') || status.includes('Confirmed')) return 'rgb(34, 197, 94)';
        if (status.includes('WL') || status.includes('Waitlist')) return 'rgb(239, 68, 68)';
        if (status.includes('RAC')) return 'rgb(251, 146, 60)';
        return 'var(--text-secondary)';
    };

    if (loading) {
        return (
            <div className="fade-in" style={{ padding: '20px', textAlign: 'center', paddingTop: '100px' }}>
                <Loader2 size={40} className="live-pulse" color="var(--accent-color)" style={{ margin: '0 auto 16px' }} />
                <p style={{ color: 'var(--text-secondary)' }}>Checking PNR Status...</p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '12px', marginTop: '8px' }}>
                    PNR: {pnrNumber}
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="fade-in" style={{ padding: '20px' }}>
                <Link href="/pnr" style={{ color: 'var(--accent-color)', fontSize: '14px', textDecoration: 'none' }}>
                    ← Back to PNR Check
                </Link>
                <div className="glass-panel" style={{ padding: '24px', marginTop: '16px', textAlign: 'center' }}>
                    <AlertCircle size={48} color="rgb(239, 68, 68)" style={{ margin: '0 auto 16px' }} />
                    <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>Error</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{error}</p>
                </div>
            </div>
        );
    }

    if (!result) return null;

    return (
        <div className="fade-in" style={{ padding: '20px' }}>
            <Link href="/pnr" style={{ color: 'var(--accent-color)', fontSize: '14px', textDecoration: 'none' }}>
                ← Check Another PNR
            </Link>

            {/* PNR Header */}
            <header style={{ marginTop: '16px', marginBottom: '24px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '4px' }}>
                    PNR: <span className="text-gradient">{pnrNumber}</span>
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                    {result.chartPrepared ? '✅ Chart Prepared' : '⏳ Chart Not Prepared'}
                </p>
            </header>

            {/* Train Info */}
            <section className="glass-panel" style={{ padding: '20px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <Train size={24} color="var(--accent-color)" />
                    <div>
                        <div style={{ fontSize: '16px', fontWeight: 600 }}>{result.trainNo} - {result.trainName}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                            {result.doj} • {result.travelClass} • {result.quota}
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <div style={{ fontSize: '20px', fontWeight: 700 }}>{result.departureTime}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{result.from} • {result.fromName}</div>
                    </div>
                    <div style={{ textAlign: 'center', flex: 1, padding: '0 16px' }}>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{result.duration}</div>
                        <div style={{ height: '2px', background: 'rgba(255,255,255,0.1)', margin: '8px 0' }} />
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '20px', fontWeight: 700 }}>{result.arrivalTime}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{result.to} • {result.toName}</div>
                    </div>
                </div>
            </section>

            {/* Passengers */}
            <section>
                <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <User size={18} /> Passengers ({result.passengers.length})
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {result.passengers.map((passenger, index) => (
                        <div key={index} className="glass-panel" style={{ padding: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <span style={{ fontSize: '14px', fontWeight: 500 }}>{passenger.name}</span>
                                <span style={{
                                    fontSize: '12px',
                                    fontWeight: 700,
                                    color: getStatusColor(passenger.status),
                                    padding: '4px 8px',
                                    borderRadius: '6px',
                                    background: `${getStatusColor(passenger.status)}20`,
                                }}>
                                    {passenger.status}
                                </span>
                            </div>
                            <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                                <span>Coach: {passenger.coach}</span>
                                <span>Berth: {passenger.berth} {passenger.berthCode}</span>
                            </div>
                            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
                                Booking: {passenger.bookingStatus}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Link to Train */}
            <Link
                href={`/train/${result.trainNo}`}
                className="btn-primary"
                style={{ display: 'flex', justifyContent: 'center', marginTop: '24px', textDecoration: 'none' }}
            >
                View Train Details
            </Link>
        </div>
    );
}
