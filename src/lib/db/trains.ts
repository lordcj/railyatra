import path from 'path';
import { DATA_DIR, readJsonFile } from './index';
import { Train } from './types';
import { promises as fs } from 'fs';

const TRAINS_DIR = path.join(DATA_DIR, 'trains', 'json');
const RAILRADAR_BASE = 'https://api.railradar.in/api/v1';
const API_KEY = process.env.RAILRADAR_API_KEY;

async function fetchFromRailRadar(number: string): Promise<Train | null> {
    if (!API_KEY) return null;

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

        const response = await fetch(`${RAILRADAR_BASE}/trains/${number}`, {
            headers: { 'X-API-Key': API_KEY },
            next: { revalidate: 86400 }, // Cache for 24 hours
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) return null;

        const data = await response.json();
        const info = data.data?.train || data.train || data;

        if (!info || !info.trainName) return null;

        // Map API response to Train interface
        const train: Train = {
            number: info.trainNumber || number,
            name: info.trainName || info.name,
            type: info.type || 'Express', // Fallback
            source: info.sourceName || info.source || 'Unknown',
            sourceCode: info.sourceCode || 'UNKNOWN',
            destination: info.destName || info.destination || 'Unknown',
            destinationCode: info.destCode || 'UNKNOWN',
            departureTime: info.departureTime || '00:00',
            arrivalTime: info.arrivalTime || '00:00',
            duration: info.duration || '0h 0m',
            distance: `${info.distanceKm || 0} km`,
            runningDays: info.runningDays || [],
            zone: info.zone || 'IR',
            classes: info.classes || ['SL', '3A'],
            stops: (info.route || []).length,
            majorStops: [], // Would need to parse route to find major stops
            frequency: 'Daily' // Assumption if not provided
        };

        return train;
    } catch (e) {
        console.error('Error fetching dynamic train:', e);
        return null;
    }
}

export async function getTrain(number: string): Promise<Train | null> {
    // 1. Try local DB (fastest, SEO optimized content)
    const localTrain = await readJsonFile<Train>(path.join(TRAINS_DIR, `${number}.json`));
    if (localTrain) return localTrain;

    // 2. Fallback to Dynamic API (adds coverage for all trains)
    return fetchFromRailRadar(number);
}

export async function getAllTrainNumbers(): Promise<string[]> {
    try {
        const files = await fs.readdir(TRAINS_DIR);
        return files
            .filter(f => f.endsWith('.json'))
            .map(f => f.replace('.json', ''));
    } catch (error) {
        return [];
    }
}

export async function getTrainsFromStation(stationCode: string): Promise<Train[]> {
    // Note: In a real DB we would query an index. 
    // For FS DB with 100k pages, scanning all JSONs is too slow.
    // We should maintain a separate index file mapping stations to trains.
    // For now, implementing a scan (inefficient) or relying on a pre-built index.
    // TODO: Implement station_trains_index.json

    // Fallback to reading all (OK for < 1000 items, bad for 100k)
    // We will optimize this by creating an index during migration.
    const allNumbers = await getAllTrainNumbers();
    const trains = await Promise.all(allNumbers.map(n => getTrain(n)));

    return (trains.filter(t => t !== null) as Train[])
        .filter(t => t.sourceCode === stationCode || t.destinationCode === stationCode);
}
