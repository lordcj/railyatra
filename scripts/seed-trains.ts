
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Define types locally to avoid import issues in standalone script
interface Train {
    number: string;
    name: string;
    type: string;
    source: string;
    sourceCode: string;
    destination: string;
    destinationCode: string;
    departureTime: string;
    arrivalTime: string;
    duration: string;
    distance: string;
    runningDays: string[];
    zone: string;
    classes: string[];
    stops: number;
    majorStops: string[]; // Would need to parse route to find major stops
    frequency: string;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Adjust path to project root
const PROJECT_ROOT = path.resolve(__dirname, '..');
const TRAINS_JSON_DIR = path.join(PROJECT_ROOT, 'src', 'data', 'trains', 'json');

const SOURCE_URL = 'https://raw.githubusercontent.com/datameet/railways/master/trains.json';

async function seedTrains() {
    console.log('🚀 Starting Train Dataset Seeding...');
    console.log(`📂 Target Directory: ${TRAINS_JSON_DIR}`);

    // Ensure directory exists
    await fs.mkdir(TRAINS_JSON_DIR, { recursive: true });

    try {
        console.log(`🌐 Fetching data from ${SOURCE_URL}...`);
        const response = await fetch(SOURCE_URL);

        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.statusText}`);
        }

        const geoJson = await response.json();
        const features = geoJson.features;

        console.log(`✅ Fetched ${features.length} train records. Processing...`);

        let count = 0;
        const errors: string[] = [];

        for (const feature of features) {
            const props = feature.properties;

            if (!props.number || !props.name) {
                continue; // Skip invalid records
            }

            // Map properties to our Train interface
            const train: Train = {
                number: props.number.toString(),
                name: props.name,
                type: props.type || 'Express',
                source: props.from_station_name || 'Unknown',
                sourceCode: props.from_station_code || 'UNKNOWN',
                destination: props.to_station_name || 'Unknown',
                destinationCode: props.to_station_code || 'UNKNOWN',
                departureTime: props.departure || '00:00',
                arrivalTime: props.arrival || '00:00',
                duration: `${props.duration_h || 0}h ${props.duration_m || 0}m`,
                distance: `${props.distance || 0} km`,
                runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], // Defaulting as this info is missing in source
                zone: props.zone || 'IR',
                classes: [], // Classes info is messy in source ("third_ac": 0 etc), leave empty or implement logic
                stops: 0, // Route info is in geometry, hard to count stops without full schedule
                majorStops: [],
                frequency: 'Daily' // Default
            };

            // Basic Class Logic
            if (props.third_ac) train.classes.push('3A');
            if (props.second_ac) train.classes.push('2A');
            if (props.first_ac) train.classes.push('1A');
            if (props.sleeper) train.classes.push('SL');
            if (props.chair_car) train.classes.push('CC');
            if (train.classes.length === 0) train.classes.push('SL', 'GEN'); // Fallback

            const filePath = path.join(TRAINS_JSON_DIR, `${train.number}.json`);

            try {
                await fs.writeFile(filePath, JSON.stringify(train, null, 2));
                count++;
                if (count % 100 === 0) {
                    process.stdout.write(`\rProcessed ${count} trains...`);
                }
            } catch (err) {
                errors.push(`Failed to write ${train.number}: ${err}`);
            }
        }

        console.log(`\n\n🎉 Seeding Complete!`);
        console.log(`✅ Successfully wrote ${count} train files.`);
        if (errors.length > 0) {
            console.log(`⚠️ Encountered ${errors.length} errors.`);
            // console.log(errors);
        }

    } catch (error) {
        console.error('❌ Fatal Error:', error);
    }
}

seedTrains();
