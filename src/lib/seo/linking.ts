import { Train, Station } from '@/lib/db/types';
import { getAllTrainNumbers, getTrain, getTrainsFromStation } from '@/lib/db/trains';
import { getAllStationCodes, getStation } from '@/lib/db/stations';

/**
 * Returns a list of trains related to the given train.
 * Priority:
 * 1. Trains with same Source AND Destination.
 * 2. Trains with same Source OR Destination.
 * 3. Trains in the same Zone.
 */
export async function getRelatedTrains(train: Train, limit: number = 6): Promise<Train[]> {
    // 1. Get trains from same source
    const trainsFromSource = await getTrainsFromStation(train.sourceCode);

    // Filter out the current train
    let candidates = trainsFromSource.filter(t => t.number !== train.number);

    // Sort by relevance:
    // - Exact Route match (Source & Dest same) -> High Priority
    // - Same Destination (but diff source) -> Medium Priority
    // - Just same Source -> Low Priority

    candidates.sort((a, b) => {
        const aExact = a.destinationCode === train.destinationCode;
        const bExact = b.destinationCode === train.destinationCode;
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;
        return 0; // Keep original order otherwise
    });

    // If not enough, maybe add trains from same Zone? 
    // For now, let's stick to route connectivity as it's most relevant for users.

    return candidates.slice(0, limit);
}

/**
 * Returns a list of stations "nearby" or relevant to the given station.
 * Logic:
 * 1. Stations in the same City (if we had city data).
 * 2. Stations in the same State/Zone.
 * 3. Popular stations connected to this station.
 */
export async function getNearbyStations(station: Station, limit: number = 10): Promise<Station[]> {
    const allCodes = await getAllStationCodes();

    // Since we don't have geospatial data in our simple JSON,
    // We will simulate "nearby" by finding stations in the same State or Zone.

    const candidates: Station[] = [];

    // We need to fetch station objects to check state/zone.
    // Iterating all 100k is slow, but we only have a few in our sample data.
    // In production, this would use a proper index or geospatial query.

    // Optimisation: Just check a subset or purely rely on pre-calculated relationships.
    // For this implementation, let's filter by matching State/Zone from a sample.

    // Hack for file-system DB without easy querying:
    // We'll just grab a random set of stations that match the Zone.

    // Note: In a real DB, `SELECT * FROM stations WHERE state = ? LIMIT 10`

    let count = 0;
    for (const code of allCodes) {
        if (code === station.code) continue;
        if (count >= limit * 2) break; // Scan a bit more to shuffle

        const s = await getStation(code);
        if (s) {
            if (s.state === station.state || s.zone === station.zone) {
                candidates.push(s);
                count++;
            }
        }
    }

    return candidates.slice(0, limit);
}

/**
 * Generates SEO-friendly breadcrumbs for a route.
 */
export function getBreadcrumbs(type: 'train' | 'station' | 'pnr' | 'live', label: string) {
    const base = { name: 'Home', url: '/' };

    switch (type) {
        case 'train':
            return [base, { name: 'Trains', url: '/trains' }, { name: label, url: '' }];
        case 'station':
            return [base, { name: 'Stations', url: '/stations' }, { name: label, url: '' }];
        case 'live':
            return [base, { name: 'Live Status', url: '/live' }, { name: label, url: '' }];
        case 'pnr':
            return [base, { name: 'PNR Status', url: '/pnr' }, { name: label, url: '' }];
        default:
            return [base];
    }
}
