import { MetadataRoute } from 'next';
import { getAllTrainNumbers } from '@/lib/db/trains';
import { getAllStationCodes } from '@/lib/db/stations';

const BASE_URL = 'https://railyatra.co.in';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const now = new Date();

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: BASE_URL,
            lastModified: now,
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${BASE_URL}/pnr`,
            lastModified: now,
            changeFrequency: 'always',
            priority: 1.0,
        },
        {
            url: `${BASE_URL}/trains`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/stations`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/search-train`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/privacy`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.3,
        },
    ];

    // Train pages
    const trainNumbers = await getAllTrainNumbers();
    const trainPages: MetadataRoute.Sitemap = trainNumbers.map((trainNo) => ({
        url: `${BASE_URL}/train/${trainNo}`,
        lastModified: now,
        changeFrequency: 'daily' as const,
        priority: 0.8,
    }));

    // Station pages
    const stationCodes = await getAllStationCodes();
    const stationPages: MetadataRoute.Sitemap = stationCodes.map((code) => ({
        url: `${BASE_URL}/station/${code}`,
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    return [...staticPages, ...trainPages, ...stationPages];
}
