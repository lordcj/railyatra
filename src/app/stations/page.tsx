import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { majorStations, getStationsByState } from '@/data/stations';

export const metadata: Metadata = {
    title: 'Railway Stations in India - All Major Stations List',
    description: 'Browse all major railway stations in India. Find station codes, zones, platforms, and connectivity information. Search for trains from any station.',
    alternates: {
        canonical: 'https://railyatra.co.in/stations',
    },
};

export default function StationsPage() {
    // Group stations by state
    const states = [...new Set(majorStations.map((s) => s.state))].sort();

    return (
        <div className="fade-in" style={{ padding: '20px' }}>
            {/* Header */}
            <header style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '26px', fontWeight: 700, marginBottom: '8px' }}>
                    Railway <span className="text-gradient">Stations</span>
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                    {majorStations.length}+ major stations across India
                </p>
            </header>

            {/* All Stations Grid */}
            <section style={{ marginBottom: '32px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                    {majorStations.map((station) => (
                        <Link
                            key={station.code}
                            href={`/station/${station.code}`}
                            className="glass-panel"
                            style={{
                                padding: '16px 12px',
                                textAlign: 'center',
                                textDecoration: 'none',
                            }}
                        >
                            <div style={{
                                fontSize: '16px',
                                fontWeight: 700,
                                color: 'var(--accent-color)',
                                marginBottom: '4px',
                            }}>
                                {station.code}
                            </div>
                            <div style={{
                                fontSize: '11px',
                                color: 'var(--text-secondary)',
                                lineHeight: 1.3,
                            }}>
                                {station.name}
                            </div>
                            <div style={{
                                fontSize: '9px',
                                color: 'rgba(255,255,255,0.4)',
                                marginTop: '4px',
                            }}>
                                {station.zone} • {station.state.slice(0, 12)}
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* About Section */}
            <section className="glass-panel" style={{ padding: '24px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px' }}>
                    About Indian Railway Stations
                </h2>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '14px' }}>
                    Indian Railways operates one of the largest railway networks in the world, with over 7,000 stations
                    across the country. Stations are categorized from A1 (metro cities) to F (halts) based on passenger
                    traffic and revenue. Each station has a unique station code used for booking and scheduling.
                </p>
            </section>
        </div>
    );
}
