import path from 'path';
import { DATA_DIR, readJsonFile } from './index';
import { Station } from './types';
import { promises as fs } from 'fs';

const STATIONS_DIR = path.join(DATA_DIR, 'stations', 'json');

export async function getStation(code: string): Promise<Station | null> {
    return readJsonFile<Station>(path.join(STATIONS_DIR, `${code.toUpperCase()}.json`));
}

export async function getAllStationCodes(): Promise<string[]> {
    try {
        const files = await fs.readdir(STATIONS_DIR);
        return files
            .filter(f => f.endsWith('.json'))
            .map(f => f.replace('.json', ''));
    } catch (error) {
        return [];
    }
}
