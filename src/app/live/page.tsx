import { Metadata } from 'next';
import { LiveStatusSearch } from './LiveStatusSearch';

export const metadata: Metadata = {
    title: 'Live Train Status - Track Indian Railways Trains in Real-Time',
    description: 'Check live running status of any Indian Railway train. Enter train number to get real-time location, delays, platform info, and ETA.',
    alternates: {
        canonical: 'https://railyatra.co.in/live',
    },
};

export default function LiveStatusPage() {
    return (
        <div className="fade-in" style={{ padding: '20px' }}>
            {/* Header */}
            <header style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '26px', fontWeight: 700, marginBottom: '8px' }}>
                    Live <span className="text-gradient">Train Status</span>
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                    Track any Indian Railway train in real-time
                </p>
            </header>

            {/* Search Form */}
            <LiveStatusSearch />

            {/* Info Section */}
            <section className="glass-panel" style={{ padding: '24px', marginTop: '32px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>
                    How to Check Live Train Status
                </h2>
                <ol style={{
                    color: 'var(--text-secondary)',
                    lineHeight: '2',
                    fontSize: '14px',
                    paddingLeft: '20px'
                }}>
                    <li>Enter 4 or 5 digit train number (e.g., 12951)</li>
                    <li>Click "Track Train" to get live status</li>
                    <li>View current location, delay, and next station</li>
                    <li>See complete route with real-time updates</li>
                </ol>
            </section>

            {/* Popular Trains */}
            <section style={{ marginTop: '32px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>
                    Popular Trains
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                    {[
                        { no: '12951', name: 'Mumbai Rajdhani' },
                        { no: '12301', name: 'Howrah Rajdhani' },
                        { no: '22435', name: 'Vande Bharat' },
                        { no: '12259', name: 'Sealdah Duronto' },
                    ].map((train) => (
                        <a
                            key={train.no}
                            href={`/live/${train.no}`}
                            className="glass-panel"
                            style={{
                                padding: '16px',
                                textAlign: 'center',
                                textDecoration: 'none',
                            }}
                        >
                            <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--accent-color)' }}>
                                {train.no}
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                {train.name}
                            </div>
                        </a>
                    ))}
                </div>
            </section>
        </div>
    );
}
