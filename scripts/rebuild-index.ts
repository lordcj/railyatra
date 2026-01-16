
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(PROJECT_ROOT, 'src', 'data');
const TRAINS_JSON_DIR = path.join(DATA_DIR, 'trains', 'json');
const INDEX_FILE = path.join(DATA_DIR, 'station-trains-index.json');

async function rebuildIndex() {
    console.log('🔄 Rebuilding Station-Train Index...');

    try {
        const files = await fs.readdir(TRAINS_JSON_DIR);
        const jsonFiles = files.filter(f => f.endsWith('.json'));

        console.log(`📂 Found ${jsonFiles.length} train files.`);

        const stationIndex: Record<string, string[]> = {};
        let processed = 0;

        for (const file of jsonFiles) {
            const content = await fs.readFile(path.join(TRAINS_JSON_DIR, file), 'utf-8');
            try {
                const train = JSON.parse(content);
                const number = train.number;
                const source = train.sourceCode;
                const dest = train.destinationCode;

                if (source) {
                    if (!stationIndex[source]) stationIndex[source] = [];
                    stationIndex[source].push(number);
                }

                if (dest) {
                    if (!stationIndex[dest]) stationIndex[dest] = [];
                    stationIndex[dest].push(number);
                }

                processed++;
                if (processed % 1000 === 0) {
                    process.stdout.write(`\rIndexOf ${processed} trains...`);
                }

            } catch (jsonErr) {
                console.error(`❌ Error parsing ${file}:`, jsonErr);
            }
        }

        // Dedupe
        console.log('\n🧹 Deduping entries...');
        let totalLinks = 0;
        for (const code in stationIndex) {
            stationIndex[code] = [...new Set(stationIndex[code])];
            totalLinks += stationIndex[code].length;
        }

        await fs.writeFile(INDEX_FILE, JSON.stringify(stationIndex, null, 2));

        console.log('✅ Index Rebuild Complete!');
        console.log(`📊 Indexed ${Object.keys(stationIndex).length} stations with ${totalLinks} train links.`);

    } catch (error) {
        console.error('❌ Fatal Error during indexing:', error);
    }
}

rebuildIndex();
