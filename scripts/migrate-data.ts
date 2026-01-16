
import fs from 'fs';
import path from 'path';
import { allTrains } from '../src/data/trains/index';
import { majorStations } from '../src/data/stations/index';

const DATA_DIR = path.join(process.cwd(), 'src/data');
const TRAINS_JSON_DIR = path.join(DATA_DIR, 'trains', 'json');
const STATIONS_JSON_DIR = path.join(DATA_DIR, 'stations', 'json');

// Ensure directories exist
if (!fs.existsSync(TRAINS_JSON_DIR)) fs.mkdirSync(TRAINS_JSON_DIR, { recursive: true });
if (!fs.existsSync(STATIONS_JSON_DIR)) fs.mkdirSync(STATIONS_JSON_DIR, { recursive: true });

async function migrate() {
    console.log('Starting migration...');

    // Migrate Trains
    console.log(`Migrating ${allTrains.length} trains...`);
    for (const train of allTrains) {
        const filePath = path.join(TRAINS_JSON_DIR, `${train.number}.json`);
        fs.writeFileSync(filePath, JSON.stringify(train, null, 2));
    }

    // Migrate Stations
    console.log(`Migrating ${majorStations.length} stations...`);
    for (const station of majorStations) {
        const filePath = path.join(STATIONS_JSON_DIR, `${station.code}.json`);
        fs.writeFileSync(filePath, JSON.stringify(station, null, 2));
    }

    // Create Station -> Trains Index
    console.log('Creating Station Index...');
    const stationIndex: Record<string, string[]> = {};
    for (const train of allTrains) {
        if (!stationIndex[train.sourceCode]) stationIndex[train.sourceCode] = [];
        if (!stationIndex[train.destinationCode]) stationIndex[train.destinationCode] = [];
        stationIndex[train.sourceCode].push(train.number);
        stationIndex[train.destinationCode].push(train.number);
    }

    // Dedupe
    for (const code in stationIndex) {
        stationIndex[code] = [...new Set(stationIndex[code])];
    }

    fs.writeFileSync(path.join(DATA_DIR, 'station-trains-index.json'), JSON.stringify(stationIndex, null, 2));

    console.log('Migration complete!');
}

migrate().catch(console.error);
