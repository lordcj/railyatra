import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin, Train, ChevronRight, ArrowRight } from 'lucide-react';
import { getStation, getAllStationCodes } from '@/lib/db/stations';
import { Station } from '@/lib/db/types';
import { getTrainsFromStation } from '@/lib/db/trains';
import { generateStationMetadata } from '@/lib/seo/metadata';
import { generateStationPageSchema, generateFAQSchema } from '@/components/seo/schema'; // Import FAQ schema
import { generateStationDescription, generateStationFAQs } from '@/lib/content/generator';
import { getNearbyStations } from '@/lib/seo/linking';

// Enable ISR with 1-hour revalidation
export const revalidate = 3600;

// Generate static params for all stations
export async function generateStaticParams() {
    const stationCodes = await getAllStationCodes();
    return stationCodes.map((code) => ({ code }));
}

// Generate dynamic metadata
export async function generateMetadata({ params }: { params: Promise<{ code: string }> }): Promise<Metadata> {
    const { code } = await params;
    return generateStationMetadata(code.toUpperCase());
}

export default async function StationPage({ params }: { params: Promise<{ code: string }> }) {
    const { code } = await params;
    const station = await getStation(code.toUpperCase());

    if (!station) {
        notFound();
    }

    const trains = await getTrainsFromStation(station.code);

    // Intelligent Linking
    const nearbyStations = await getNearbyStations(station);

    // Generate content
    const description = generateStationDescription(station);
    const faqs = generateStationFAQs(station);

    // Update schema to include FAQs
    const stationSchema = generateStationPageSchema(station);
    const faqSchema = generateFAQSchema(faqs);
    const combinedSchema = {
        '@context': 'https://schema.org',
        '@graph': [
            ...(stationSchema['@graph'] || []),
            faqSchema
        ]
    };

    return (
        <div className="fade-in">
            {/* JSON-LD Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(combinedSchema) }}
            />

            {/* Breadcrumb */}
            <nav style={{ padding: '16px 20px' }}>
                <ol className="breadcrumb">
                    <li><Link href="/">Home</Link></li>
                    <li><Link href="/stations">Stations</Link></li>
                    <li><span aria-current="page">{station.code}</span></li>
                </ol>
            </nav>

            {/* Hero */}
            <header style={{ padding: '0 20px 24px' }}>
                <div style={{ marginBottom: '8px' }}>
                    <span style={{
                        fontSize: '10px',
                        padding: '4px 10px',
                        borderRadius: '8px',
                        background: station.category === 'A1' ? 'rgba(45, 212, 191, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                        color: station.category === 'A1' ? 'rgb(45, 212, 191)' : 'rgb(56, 189, 248)',
                        fontWeight: 600,
                    }}>
                        Category {station.category} Station
                    </span>
                </div>
                <h1 style={{ fontSize: '26px', fontWeight: 700, marginBottom: '4px' }}>
                    {station.fullName}
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                    {station.code} • {station.zone} Zone • {station.state}
                </p>
            </header>

            {/* Station Info */}
            <section style={{ padding: '0 20px 24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                    <div className="glass-panel" style={{ padding: '16px' }}>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Platforms</div>
                        <div style={{ fontSize: '24px', fontWeight: 700 }}>{station.platforms}</div>
                    </div>
                    <div className="glass-panel" style={{ padding: '16px' }}>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Zone</div>
                        <div style={{ fontSize: '20px', fontWeight: 600 }}>{station.zone}</div>
                    </div>
                </div>
            </section>

            {/* Connectivity */}
            <section style={{ padding: '0 20px 24px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>Connectivity</h2>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {station.connectivity.map((mode) => (
                        <span
                            key={mode}
                            style={{
                                fontSize: '12px',
                                padding: '6px 12px',
                                borderRadius: '20px',
                                background: 'rgba(255,255,255,0.08)',
                                color: 'var(--text-primary)',
                            }}
                        >
                            {mode}
                        </span>
                    ))}
                </div>
            </section>

            {/* Trains from this station */}
            {trains.length > 0 && (
                <section style={{ padding: '0 20px 24px' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>
                        Trains from {station.name}
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {trains.map((train) => (
                            <Link
                                key={train.number}
                                href={`/train/${train.number}`}
                                className="glass-panel"
                                style={{
                                    padding: '16px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    textDecoration: 'none',
                                }}
                            >
                                <div>
                                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                                        {train.number} - {train.name.split(' ').slice(0, 3).join(' ')}
                                    </div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                        {train.source} → {train.destination}
                                    </div>
                                </div>
                                <span style={{
                                    fontSize: '10px',
                                    padding: '4px 8px',
                                    borderRadius: '8px',
                                    background: 'rgba(45, 212, 191, 0.15)',
                                    color: 'rgb(45, 212, 191)',
                                }}>
                                    {train.type}
                                </span>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* Nearby Stations - Hub & Spoke */}
            {nearbyStations.length > 0 && (
                <section style={{ padding: '0 20px 24px' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>
                        Nearby Stations in {station.state}
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                        {nearbyStations.map((s) => (
                            <Link
                                key={s.code}
                                href={`/station/${s.code}`}
                                className="glass-panel"
                                style={{
                                    padding: '12px',
                                    textDecoration: 'none',
                                    textAlign: 'center'
                                }}
                            >
                                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                                    {s.name} ({s.code})
                                </div>
                                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                                    {s.zone} Zone
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* About Section */}
            <section className="glass-panel" style={{ margin: '0 20px 24px', padding: '24px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px' }}>
                    About {station.name} Railway Station
                </h2>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '14px', textAlign: 'justify' }}>
                    {description}
                </p>
            </section>

            {/* FAQ Section */}
            <section style={{ padding: '0 20px 24px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>
                    Frequently Asked Questions
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {faqs.map((faq, index) => (
                        <details
                            key={index}
                            className="glass-panel"
                            style={{ padding: '16px' }}
                        >
                            <summary style={{
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: 600,
                                color: 'var(--text-primary)',
                                listStyle: 'none',
                            }}>
                                {faq.question}
                            </summary>
                            <p style={{
                                marginTop: '12px',
                                color: 'var(--text-secondary)',
                                fontSize: '13px',
                                lineHeight: '1.6',
                            }}>
                                {faq.answer}
                            </p>
                        </details>
                    ))}
                </div>
            </section>
        </div>
    );
}
