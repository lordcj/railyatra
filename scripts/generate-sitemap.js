import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Configuration ---
const HOSTNAME = 'https://railyatra.co.in';
const SITEMAP_PATH = path.join(__dirname, '../public/sitemap.xml');

// --- Seed Data: High Value Trains ---
// Focusing on popular luxury and mail/express trains for initial authority
const HIGH_VALUE_TRAINS = [
    // Vande Bharat Express (Premium, High Interest)
    { number: '22436', name: 'Vande Bharat Express', priority: 0.9, freq: 'daily' }, // Delhi - Varanasi
    { number: '22435', name: 'Vande Bharat Express', priority: 0.9, freq: 'daily' },
    { number: '20171', name: 'Vande Bharat Express', priority: 0.9, freq: 'daily' }, // Bhopal - Delhi
    { number: '20901', name: 'Vande Bharat Express', priority: 0.9, freq: 'daily' }, // Mumbai - Gandhinagar
    { number: '20607', name: 'Vande Bharat Express', priority: 0.9, freq: 'daily' }, // Chennai - Mysore

    // Rajdhani Express (Premium, High Volume)
    { number: '12951', name: 'Mumbai Rajdhani', priority: 0.8, freq: 'daily' },
    { number: '12952', name: 'Mumbai Rajdhani', priority: 0.8, freq: 'daily' },
    { number: '12301', name: 'Howrah Rajdhani', priority: 0.8, freq: 'daily' },
    { number: '12423', name: 'Dibrugarh Rajdhani', priority: 0.8, freq: 'daily' },

    // Shatabdi Express
    { number: '12002', name: 'Bhopal Shatabdi', priority: 0.8, freq: 'daily' },
    { number: '12015', name: 'Kalka Shatabdi', priority: 0.8, freq: 'daily' },

    // Popular Mail/Express
    { number: '12137', name: 'Punjab Mail', priority: 0.7, freq: 'daily' },
    { number: '12903', name: 'Golden Temple Mail', priority: 0.7, freq: 'daily' },
    { number: '12626', name: 'Kerala Express', priority: 0.7, freq: 'daily' },
    { number: '12723', name: 'Telangana Express', priority: 0.7, freq: 'daily' }
];

// --- Static Pages ---
const STATIC_PAGES = [
    { url: '/', priority: 1.0, freq: 'daily' },
    { url: '/pnr', priority: 1.0, freq: 'always' },
    { url: '/search-train', priority: 0.9, freq: 'weekly' },
    { url: '/privacy', priority: 0.3, freq: 'monthly' },
];

// --- Helper: Format Date ---
const getToday = () => {
    return new Date().toISOString().split('T')[0];
};

// --- Generator Function ---
const generateSitemap = () => {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    // Add Static Pages
    console.log(`Adding ${STATIC_PAGES.length} static pages...`);
    STATIC_PAGES.forEach(page => {
        xml += `
    <url>
        <loc>${HOSTNAME}${page.url}</loc>
        <lastmod>${getToday()}</lastmod>
        <changefreq>${page.freq}</changefreq>
        <priority>${page.priority}</priority>
    </url>`;
    });

    // Add Train Pages
    console.log(`Adding ${HIGH_VALUE_TRAINS.length} high-value trains...`);
    HIGH_VALUE_TRAINS.forEach(train => {
        xml += `
    <!-- ${train.name} -->
    <url>
        <loc>${HOSTNAME}/train/${train.number}</loc>
        <lastmod>${getToday()}</lastmod>
        <changefreq>${train.freq}</changefreq>
        <priority>${train.priority}</priority>
    </url>`;
    });

    xml += `
</urlset>`;

    // Write to file
    fs.writeFileSync(SITEMAP_PATH, xml);
    console.log(`✅ Sitemap generated successfully at ${SITEMAP_PATH}`);
    console.log(`   Total URLs: ${STATIC_PAGES.length + HIGH_VALUE_TRAINS.length}`);
};

// Execute
generateSitemap();
