import { Metadata } from 'next';
import Link from 'next/link';
import { getTrain } from '@/lib/db/trains';
import { LiveTrainClient } from './LiveTrainClient';

// Allow dynamic params - any train number works
export const dynamicParams = true;

// Generate metadata
export async function generateMetadata({ params }: { params: Promise<{ trainNo: string }> }): Promise<Metadata> {
    const { trainNo } = await params;
    const train = await getTrain(trainNo);

    return {
        title: train
            ? `${train.number} Live Status - ${train.name} | RailYatra`
            : `Train ${trainNo} Live Status - Check Spot Your Train`,
        description: train
            ? `Check live running status of ${train.number} ${train.name}. View real-time location, current delay, platform numbers, and expected arrival time at all stations.`
            : `Check live running status, spotting, and current location of train ${trainNo}. Get real-time updates and platform information on RailYatra.`,
        keywords: [
            `${trainNo} live status`,
            `train ${trainNo} running status`,
            `${train?.name || ''} live status`,
            'spot your train',
            'train live location'
        ].filter(Boolean).join(', '),
        alternates: {
            canonical: `https://railyatra.co.in/live/${trainNo}`,
        },
    };
}


export default async function LiveTrainPage({ params }: { params: Promise<{ trainNo: string }> }) {
    const { trainNo } = await params;

    // Static/Dynamic train data for SEO content
    const trainData = await getTrain(trainNo);
    const staticTrain = trainData || undefined;

    return (
        <div className="fade-in" style={{ padding: '20px' }}>
            {/* Header */}
            <nav style={{ marginBottom: '16px' }}>
                <ol className="breadcrumb">
                    <li><Link href="/">Home</Link></li>
                    <li><Link href="/trains">Trains</Link></li>
                    <li><Link href={`/train/${trainNo}`}>{trainNo}</Link></li>
                    <li><span aria-current="page">Live</span></li>
                </ol>
            </nav>

            <header style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '4px' }}>
                    Live Status: <span className="text-gradient">{trainNo}</span>
                </h1>
                {staticTrain && (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                        {staticTrain.name}
                    </p>
                )}
            </header>

            {/* Live Train Client Component - Works with ANY train number via API */}
            <LiveTrainClient trainNo={trainNo} staticTrain={staticTrain} />
        </div>
    );
}
