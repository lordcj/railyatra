import { promises as fs } from 'fs';
import path from 'path';

export const DATA_DIR = path.join(process.cwd(), 'src/data');

export async function readJsonFile<T>(filePath: string): Promise<T | null> {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data) as T;
    } catch (error) {
        // Return null if file doesn't exist or error reading
        return null;
    }
}

export async function writeJsonFile<T>(filePath: string, data: T): Promise<void> {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}
