import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/api/', '/pnr/*'], // Don't index individual PNR results (personal data)
            },
            {
                userAgent: 'Googlebot',
                allow: '/',
            },
        ],
        sitemap: 'https://railyatra.co.in/sitemap.xml',
    };
}
