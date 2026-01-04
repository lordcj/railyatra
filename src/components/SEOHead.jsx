import { Helmet } from 'react-helmet-async';

/**
 * SEOHead - Reusable SEO component for per-page meta tags and structured data
 * 
 * @param {string} title - Page title
 * @param {string} description - Meta description
 * @param {string} keywords - Meta keywords
 * @param {string} canonical - Canonical URL
 * @param {object} jsonLd - JSON-LD structured data object
 * @param {string} ogImage - Open Graph image URL
 */
const SEOHead = ({
    title = 'RailYatra - PNR Status & Live Train Status',
    description = 'Check PNR status, live train running status, train schedules & seat availability. Fast, free Indian Railway information.',
    keywords = 'PNR status, live train status, train running status, Indian railway, IRCTC PNR',
    canonical = 'https://railyatra.co.in',
    jsonLd = null,
    ogImage = 'https://railyatra.co.in/og-image.jpg',
    noindex = false
}) => {
    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            {noindex && <meta name="robots" content="noindex,nofollow" />}

            {/* Canonical URL */}
            <link rel="canonical" href={canonical} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={canonical} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:site_name" content="RailYatra" />
            <meta property="og:locale" content="en_IN" />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={ogImage} />

            {/* Additional SEO */}
            <meta name="author" content="RailYatra" />
            <meta name="geo.region" content="IN" />
            <meta name="geo.country" content="India" />
            <meta httpEquiv="content-language" content="en-IN" />

            {/* JSON-LD Structured Data */}
            {jsonLd && (
                <script type="application/ld+json">
                    {JSON.stringify(jsonLd)}
                </script>
            )}
        </Helmet>
    );
};

export default SEOHead;
