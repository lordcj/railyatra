import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { getTrain, getAllTrainNumbers } from '@/lib/db/trains';
import { Train } from '@/lib/db/types';
import { getStation } from '@/lib/db/stations';
import { generateTrainMetadata } from '@/lib/seo/metadata';
import { generateTrainPageSchema } from '@/components/seo/schema';
import { generateTrainDescription, generateTrainFAQs } from '@/lib/content/generator';
import { getRelatedTrains } from '@/lib/seo/linking';

// Enable ISR with 1-hour revalidation
export const revalidate = 3600;

// Allow dynamic params - any train number can be accessed
export const dynamicParams = true;

// Generate static params for known trains (SEO optimization)
export async function generateStaticParams() {
    const trainNumbers = await getAllTrainNumbers();
    return trainNumbers.slice(0, 100).map((trainNo) => ({ trainNo }));
}

// Generate dynamic metadata
export async function generateMetadata({ params }: { params: Promise<{ trainNo: string }> }): Promise<Metadata> {
    const { trainNo } = await params;
    return generateTrainMetadata(trainNo);
}

export default async function TrainDetailPage({ params }: { params: Promise<{ trainNo: string }> }) {
    const { trainNo } = await params;

    // Fetch train data
    const train = await getTrain(trainNo);

    // If train not in our database, show a minimal page with live status link
    if (!train) {
        return (
            <div className="fade-in" style={{ padding: '20px' }}>
                <nav style={{ marginBottom: '16px' }}>
                    <ol className="breadcrumb">
                        <li><Link href="/">Home</Link></li>
                        <li><Link href="/trains">Trains</Link></li>
                        <li><span aria-current="page">{trainNo}</span></li>
                    </ol>
                </nav>

                <header style={{ marginBottom: '24px' }}>
                    <h1 style={{ fontSize: '26px', fontWeight: 700, marginBottom: '8px' }}>
                        Train <span className="text-gradient">{trainNo}</span>
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                        Check live running status and schedule
                    </p>
                </header>

                <section className="glass-panel" style={{ padding: '24px', marginBottom: '24px', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '16px' }}>
                        Detailed schedule information for train {trainNo} will be fetched from live data.
                    </p>
                    <Link
                        href={`/live/${trainNo}`}
                        className="btn-primary"
                        style={{ textDecoration: 'none', display: 'inline-flex' }}
                    >
                        🔴 Check Live Running Status
                    </Link>
                </section>
            </div>
        );
    }

    // Generate rich content
    const faqs = generateTrainFAQs(train);
    const description = generateTrainDescription(train);

    // Intelligent Linking: Get Related Trains
    const relatedTrains = await getRelatedTrains(train);

    const schema = generateTrainPageSchema(train, faqs);

    return (
        <div className="fade-in">
            {/* JSON-LD Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />

            {/* Breadcrumb Navigation */}
            <nav style={{ padding: '16px 20px' }}>
                <ol className="breadcrumb">
                    <li><Link href="/">Home</Link></li>
                    <li><Link href="/trains">Trains</Link></li>
                    <li><span aria-current="page">{train.number}</span></li>
                </ol>
            </nav>

            {/* Hero Section */}
            <header style={{ padding: '0 20px 24px' }}>
                <div style={{ marginBottom: '8px' }}>
                    <span style={{
                        fontSize: '10px',
                        padding: '4px 10px',
                        borderRadius: '8px',
                        background: train.type === 'Vande Bharat' ? 'rgba(45, 212, 191, 0.15)' :
                            train.type === 'Rajdhani' ? 'rgba(251, 146, 60, 0.15)' :
                                train.type === 'Shatabdi' ? 'rgba(168, 85, 247, 0.15)' :
                                    'rgba(56, 189, 248, 0.15)',
                        color: train.type === 'Vande Bharat' ? 'rgb(45, 212, 191)' :
                            train.type === 'Rajdhani' ? 'rgb(251, 146, 60)' :
                                train.type === 'Shatabdi' ? 'rgb(168, 85, 247)' :
                                    'rgb(56, 189, 248)',
                        fontWeight: 600,
                        letterSpacing: '0.5px',
                    }}>
                        {train.type.toUpperCase()}
                    </span>
                </div>

                <h1 style={{ fontSize: '26px', fontWeight: 700, marginBottom: '4px', lineHeight: 1.2 }}>
                    {train.number} - {train.name}
                </h1>

                <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                    {train.source} → {train.destination} • {train.distance}
                </p>
            </header>

            {/* Journey Card */}
            <section className="glass-panel" style={{ margin: '0 20px 24px', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                    <div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Departs</div>
                        <div style={{ fontSize: '28px', fontWeight: 700 }}>{train.departureTime}</div>
                        <Link
                            href={`/station/${train.sourceCode}`}
                            style={{ fontSize: '14px', color: 'var(--accent-color)', textDecoration: 'none' }}
                        >
                            {train.source} ({train.sourceCode})
                        </Link>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, padding: '0 16px' }}>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{train.duration}</div>
                        <div style={{ width: '100%', height: '2px', background: 'rgba(255,255,255,0.1)', position: 'relative', margin: '8px 0' }}>
                            <div style={{
                                position: 'absolute',
                                left: 0,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                background: 'var(--accent-color)',
                            }} />
                            <div style={{
                                position: 'absolute',
                                right: 0,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                background: 'var(--accent-color)',
                            }} />
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{train.stops} stops</div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Arrives</div>
                        <div style={{ fontSize: '28px', fontWeight: 700 }}>{train.arrivalTime}</div>
                        <Link
                            href={`/station/${train.destinationCode}`}
                            style={{ fontSize: '14px', color: 'var(--accent-color)', textDecoration: 'none' }}
                        >
                            {train.destination} ({train.destinationCode})
                        </Link>
                    </div>
                </div>

                {/* Running Days */}
                <div style={{
                    display: 'flex',
                    gap: '8px',
                    flexWrap: 'wrap',
                    paddingTop: '16px',
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)', marginRight: '8px' }}>Runs on:</span>
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                        <span
                            key={day}
                            style={{
                                fontSize: '11px',
                                padding: '4px 8px',
                                borderRadius: '6px',
                                background: train.runningDays.includes(day) ? 'rgba(45, 212, 191, 0.2)' : 'rgba(255,255,255,0.05)',
                                color: train.runningDays.includes(day) ? 'rgb(45, 212, 191)' : 'var(--text-secondary)',
                                fontWeight: 500,
                            }}
                        >
                            {day}
                        </span>
                    ))}
                </div>
            </section>

            {/* Live Status Button */}
            <section style={{ padding: '0 20px 24px' }}>
                <Link
                    href={`/live/${train.number}`}
                    className="btn-primary"
                    style={{ textDecoration: 'none', width: '100%', justifyContent: 'center' }}
                >
                    🔴 Check Live Running Status
                </Link>
            </section>

            {/* Train Info Grid */}
            <section style={{ padding: '0 20px 24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                    <div className="glass-panel" style={{ padding: '16px' }}>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Distance</div>
                        <div style={{ fontSize: '18px', fontWeight: 600 }}>{train.distance}</div>
                    </div>
                    <div className="glass-panel" style={{ padding: '16px' }}>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Zone</div>
                        <div style={{ fontSize: '18px', fontWeight: 600 }}>{train.zone}</div>
                    </div>
                    <div className="glass-panel" style={{ padding: '16px' }}>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Classes</div>
                        <div style={{ fontSize: '14px', fontWeight: 600 }}>{train.classes.join(', ')}</div>
                    </div>
                    <div className="glass-panel" style={{ padding: '16px' }}>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Frequency</div>
                        <div style={{ fontSize: '18px', fontWeight: 600 }}>{train.frequency}</div>
                    </div>
                </div>
            </section>

            {/* Major Stops */}
            <section style={{ padding: '0 20px 24px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Major Stops</h2>
                <div className="glass-panel" style={{ padding: '16px' }}>
                    {train.majorStops.map((stop, index) => (
                        <div
                            key={stop}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '12px 0',
                                borderBottom: index < train.majorStops.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                            }}
                        >
                            <div style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                background: 'rgba(45, 212, 191, 0.1)',
                                color: 'var(--accent-color)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '12px',
                                fontWeight: 600,
                            }}>
                                {index + 1}
                            </div>
                            <span style={{ fontSize: '14px', fontWeight: 500 }}>{stop}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* About Train - Content Quality Engine */}
            <section className="glass-panel" style={{ margin: '0 20px 24px', padding: '24px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>
                    About {train.name}
                </h2>
                <p style={{
                    color: 'var(--text-secondary)',
                    lineHeight: '1.8',
                    fontSize: '14px',
                    textAlign: 'justify'
                }}>
                    {description}
                </p>
            </section>

            {/* FAQs */}
            <section style={{ marginTop: '32px' }}>
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
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}>
                                {faq.question}
                                <ChevronRight size={16} style={{ transition: 'transform 0.2s' }} />
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

            {/* Related Trains - Internal Linking */}
            {relatedTrains.length > 0 && (
                <section style={{ padding: '0 20px 24px' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>
                        Other Trains from {train.source}
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {relatedTrains.map((relatedTrain) => (
                            <Link
                                key={relatedTrain.number}
                                href={`/train/${relatedTrain.number}`}
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
                                        {relatedTrain.number} - {relatedTrain.name.split(' ').slice(0, 3).join(' ')}
                                    </div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                        → {relatedTrain.destination}
                                    </div>
                                </div>
                                <ChevronRight size={20} color="var(--text-secondary)" />
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* Station Links - More Internal Linking */}
            <section style={{ padding: '0 20px 32px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>
                    Explore Stations
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                    <Link
                        href={`/station/${train.sourceCode}`}
                        className="glass-panel"
                        style={{ padding: '16px', textAlign: 'center', textDecoration: 'none' }}
                    >
                        <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--accent-color)' }}>
                            {train.sourceCode}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                            {train.source}
                        </div>
                    </Link>
                    <Link
                        href={`/station/${train.destinationCode}`}
                        className="glass-panel"
                        style={{ padding: '16px', textAlign: 'center', textDecoration: 'none' }}
                    >
                        <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--accent-color)' }}>
                            {train.destinationCode}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                            {train.destination}
                        </div>
                    </Link>
                </div>
            </section>
        </div>
    );
}
