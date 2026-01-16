import { Metadata } from 'next';
import { getTrain } from '@/lib/db/trains';
import { getStation } from '@/lib/db/stations';
// Actually getStationByCode in lib/db maps to getStation.
// Let's check lib/db/stations.ts. It exports getStation. 
// I should use getStation everywhere.

const BASE_URL = 'https://railyatra.co.in';
const SITE_NAME = 'RailYatra';

/**
 * Generate dynamic metadata for train pages
 */
export async function generateTrainMetadata(trainNumber: string): Promise<Metadata> {
    const train = await getTrain(trainNumber);

    if (!train) {
        return {
            title: `Train ${trainNumber} - Schedule & Status`,
            description: `Check live running status, schedule, and route for train ${trainNumber}. Get real-time updates on RailYatra.`,
        };
    }

    const title = `${train.number} ${train.name} - Schedule, Route & Live Status`;
    const description = `Check ${train.name} (${train.number}) schedule from ${train.source} to ${train.destination}. View ${train.stops} stops, arrival/departure times, running days, and live status. Journey: ${train.duration}, ${train.distance}.`;

    const keywords = [
        train.number,
        train.name,
        `${train.name} schedule`,
        `${train.name} route`,
        `${train.number} live status`,
        `${train.source} to ${train.destination} train`,
        `${train.type} train`,
        'Indian Railways',
        'train schedule India',
    ];

    return {
        title,
        description,
        keywords: keywords.join(', '),
        openGraph: {
            title,
            description,
            type: 'website',
            url: `${BASE_URL}/train/${train.number}`,
            siteName: SITE_NAME,
            locale: 'en_IN',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
        },
        alternates: {
            canonical: `${BASE_URL}/train/${train.number}`,
        },
    };
}

/**
 * Generate dynamic metadata for station pages
 */
export async function generateStationMetadata(stationCode: string): Promise<Metadata> {
    const station = await getStation(stationCode);

    if (!station) {
        return {
            title: `Station ${stationCode} - Trains & Schedule`,
            description: `Find all trains departing from ${stationCode}. Check schedules, platforms, and live train status at RailYatra.`,
        };
    }

    const title = `${station.name} Railway Station (${station.code}) - Trains, Schedule & Platform Info`;
    const description = `All trains from ${station.fullName}. Check departure schedules, ${station.platforms} platforms, connectivity to ${station.connectivity.join(', ')}. ${station.zone} Zone, ${station.state}.`;

    const keywords = [
        station.code,
        station.name,
        station.fullName,
        `${station.name} railway station`,
        `trains from ${station.name}`,
        `${station.name} train schedule`,
        `${station.state} railways`,
        'train departures',
        'platform info',
    ];

    return {
        title,
        description,
        keywords: keywords.join(', '),
        openGraph: {
            title,
            description,
            type: 'website',
            url: `${BASE_URL}/station/${station.code}`,
            siteName: SITE_NAME,
            locale: 'en_IN',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
        },
        alternates: {
            canonical: `${BASE_URL}/station/${station.code}`,
        },
    };
}

/**
 * Generate dynamic metadata for route pages
 */
export async function generateRouteMetadata(fromCode: string, toCode: string): Promise<Metadata> {
    const [fromStation, toStation] = await Promise.all([
        getStation(fromCode),
        getStation(toCode)
    ]);

    const fromName = fromStation?.name || fromCode;
    const toName = toStation?.name || toCode;

    const title = `${fromName} to ${toName} Trains - Schedule, Fare & Booking`;
    const description = `Find all trains from ${fromName} to ${toName}. Compare schedules, fares, travel time, and availability. Book tickets online via IRCTC.`;

    const keywords = [
        `${fromName} to ${toName} train`,
        `${fromCode} to ${toCode}`,
        `${fromName} ${toName} train schedule`,
        `${fromName} to ${toName} fare`,
        `trains between ${fromName} ${toName}`,
        'train booking',
        'IRCTC',
    ];

    return {
        title,
        description,
        keywords: keywords.join(', '),
        openGraph: {
            title,
            description,
            type: 'website',
            url: `${BASE_URL}/route/${fromCode}-to-${toCode}`,
            siteName: SITE_NAME,
            locale: 'en_IN',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
        },
        alternates: {
            canonical: `${BASE_URL}/route/${fromCode}-to-${toCode}`,
        },
    };
}

/**
 * Generate dynamic metadata for PNR pages
 */
export function generatePNRMetadata(pnrNumber?: string): Metadata {
    if (pnrNumber) {
        return {
            title: `PNR Status ${pnrNumber} - Check Ticket Confirmation`,
            description: `Check PNR status for ${pnrNumber}. View current booking status, berth allocation, coach number, and departure details.`,
            alternates: {
                canonical: `${BASE_URL}/pnr/${pnrNumber}`,
            },
            robots: {
                index: false, // Don't index individual PNR pages (personal data)
            },
        };
    }

    return {
        title: 'Check PNR Status Online - Indian Railway PNR Enquiry',
        description: 'Instant PNR status check for Indian Railways IRCTC tickets. Get real-time confirmation status, berth details, coach number & waiting list position. Free & fast PNR enquiry.',
        keywords: 'PNR status, check PNR, IRCTC PNR status, Indian railway PNR, PNR enquiry, train ticket status, CNF RAC WL status',
        alternates: {
            canonical: `${BASE_URL}/pnr`,
        },
    };
}
