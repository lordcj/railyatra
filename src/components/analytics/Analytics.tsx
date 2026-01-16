'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import ReactGA from 'react-ga4';

const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // Replace with your GA4 ID

export function Analytics() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        // Initialize GA4
        if (typeof window !== 'undefined' && GA_MEASUREMENT_ID.startsWith('G-')) {
            ReactGA.initialize(GA_MEASUREMENT_ID);
        }
    }, []);

    useEffect(() => {
        // Track page views
        if (pathname) {
            const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
            ReactGA.send({ hitType: 'pageview', page: url });
        }
    }, [pathname, searchParams]);

    return null;
}
