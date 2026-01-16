import { Train, Station } from '@/lib/db/types';

const BASE_URL = 'https://railyatra.co.in';

/**
 * Generate TrainTrip schema for train pages
 */
export function generateTrainTripSchema(train: Train) {
    return {
        '@context': 'https://schema.org',
        '@type': 'TrainTrip',
        trainName: train.name,
        trainNumber: train.number,
        departureStation: {
            '@type': 'TrainStation',
            name: train.source,
            identifier: train.sourceCode,
        },
        arrivalStation: {
            '@type': 'TrainStation',
            name: train.destination,
            identifier: train.destinationCode,
        },
        departureTime: train.departureTime,
        arrivalTime: train.arrivalTime,
        provider: {
            '@type': 'Organization',
            name: 'Indian Railways',
            url: 'https://indianrailways.gov.in',
        },
    };
}

/**
 * Generate FAQPage schema
 */
export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
            },
        })),
    };
}

/**
 * Generate BreadcrumbList schema
 */
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url}`,
        })),
    };
}

/**
 * Generate TrainStation schema
 */
export function generateStationSchema(station: Station) {
    return {
        '@context': 'https://schema.org',
        '@type': 'TrainStation',
        name: station.fullName,
        alternateName: station.name,
        identifier: station.code,
        address: {
            '@type': 'PostalAddress',
            addressRegion: station.state,
            addressCountry: 'IN',
        },
    };
}

/**
 * Generate WebSite schema with SearchAction
 */
export function generateWebsiteSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${BASE_URL}/#website`,
        name: 'RailYatra',
        url: BASE_URL,
        description: 'Check PNR status, live train running status, train schedules & seat availability for Indian Railways',
        publisher: {
            '@id': `${BASE_URL}/#organization`,
        },
        potentialAction: [
            {
                '@type': 'SearchAction',
                target: {
                    '@type': 'EntryPoint',
                    urlTemplate: `${BASE_URL}/pnr/{pnr_number}`,
                },
                'query-input': 'required name=pnr_number',
            },
            {
                '@type': 'SearchAction',
                target: {
                    '@type': 'EntryPoint',
                    urlTemplate: `${BASE_URL}/train/{train_number}`,
                },
                'query-input': 'required name=train_number',
            },
        ],
        inLanguage: 'en-IN',
    };
}

/**
 * Generate Organization schema
 */
export function generateOrganizationSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': `${BASE_URL}/#organization`,
        name: 'RailYatra',
        url: BASE_URL,
        logo: {
            '@type': 'ImageObject',
            url: `${BASE_URL}/icon-192.png`,
            width: 192,
            height: 192,
        },
        sameAs: [],
    };
}

/**
 * Generate WebApplication schema
 */
export function generateWebAppSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        '@id': `${BASE_URL}/#webapp`,
        name: 'RailYatra PNR Status Checker',
        url: BASE_URL,
        applicationCategory: 'TravelApplication',
        operatingSystem: 'Web Browser',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'INR',
        },
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.8',
            ratingCount: '1000',
            bestRating: '5',
            worstRating: '1',
        },
    };
}

/**
 * Generate combined schema for train pages
 */
export function generateTrainPageSchema(train: Train, faqs: { question: string; answer: string }[]) {
    return {
        '@context': 'https://schema.org',
        '@graph': [
            generateTrainTripSchema(train),
            generateFAQSchema(faqs),
            generateBreadcrumbSchema([
                { name: 'Home', url: '/' },
                { name: 'Trains', url: '/trains' },
                { name: `${train.number} ${train.name}`, url: `/train/${train.number}` },
            ]),
        ],
    };
}

/**
 * Generate combined schema for station pages
 */
export function generateStationPageSchema(station: Station) {
    return {
        '@context': 'https://schema.org',
        '@graph': [
            generateStationSchema(station),
            generateBreadcrumbSchema([
                { name: 'Home', url: '/' },
                { name: 'Stations', url: '/stations' },
                { name: station.name, url: `/station/${station.code}` },
            ]),
        ],
    };
}

/**
 * Generate combined schema for home page
 */
export function generateHomePageSchema() {
    return {
        '@context': 'https://schema.org',
        '@graph': [
            generateWebsiteSchema(),
            generateOrganizationSchema(),
            generateWebAppSchema(),
        ],
    };
}
