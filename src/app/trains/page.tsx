import { Metadata } from 'next';
import Link from 'next/link';
import { Train, ArrowRight } from 'lucide-react';
import { allTrains, getTrainsByType } from '@/data/trains';

export const metadata: Metadata = {
    title: 'All Trains - Indian Railway Train List & Schedule',
    description: 'Browse all Indian Railways trains including Vande Bharat, Rajdhani, Shatabdi, and Express trains. View schedules, routes, and running status.',
    alternates: {
        canonical: 'https://railyatra.co.in/trains',
    },
};

export default function TrainsPage() {
    const vandeBharatTrains = getTrainsByType('Vande Bharat');
    const rajdhaniTrains = getTrainsByType('Rajdhani');
    const shatabdiTrains = getTrainsByType('Shatabdi');
    const expressTrains = allTrains.filter((t) =>
        !['Vande Bharat', 'Rajdhani', 'Shatabdi'].includes(t.type)
    );

    const TrainSection = ({
        title,
        subtitle,
        trains,
        color
    }: {
        title: string;
        subtitle: string;
        trains: typeof allTrains;
        color: string;
    }) => (
        <section style={{ marginBottom: '32px' }}>
            <div style={{ marginBottom: '16px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '4px' }}>{title}</h2>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{subtitle}</p>
            </div>
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '10px',
                                background: `rgba(${color}, 0.15)`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <Train size={20} color={`rgb(${color})`} />
                            </div>
                            <div>
                                <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
                                    {train.number} - {train.name}
                                </div>
                                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                    {train.source} → {train.destination} • {train.duration}
                                </div>
                            </div>
                        </div>
                        <ArrowRight size={18} color="var(--text-secondary)" />
                    </Link>
                ))}
            </div>
        </section>
    );

    return (
        <div className="fade-in" style={{ padding: '20px' }}>
            {/* Header */}
            <header style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '26px', fontWeight: 700, marginBottom: '8px' }}>
                    All <span className="text-gradient">Trains</span>
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                    Browse {allTrains.length}+ trains across India
                </p>
            </header>

            {/* Vande Bharat */}
            {vandeBharatTrains.length > 0 && (
                <TrainSection
                    title="Vande Bharat Express"
                    subtitle="India's premium semi-high-speed trains"
                    trains={vandeBharatTrains}
                    color="45, 212, 191"
                />
            )}

            {/* Rajdhani */}
            {rajdhaniTrains.length > 0 && (
                <TrainSection
                    title="Rajdhani Express"
                    subtitle="Flagship AC trains connecting capitals"
                    trains={rajdhaniTrains}
                    color="251, 146, 60"
                />
            )}

            {/* Shatabdi */}
            {shatabdiTrains.length > 0 && (
                <TrainSection
                    title="Shatabdi Express"
                    subtitle="Premium day trains with onboard catering"
                    trains={shatabdiTrains}
                    color="168, 85, 247"
                />
            )}

            {/* Other Express */}
            {expressTrains.length > 0 && (
                <TrainSection
                    title="Express & Mail Trains"
                    subtitle="Popular superfast and mail express trains"
                    trains={expressTrains}
                    color="56, 189, 248"
                />
            )}
        </div>
    );
}
