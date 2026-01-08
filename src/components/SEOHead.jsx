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
    title = 'RailYatra - Indian Railway PNR Status, Live Train Status & Schedule',
    description = 'Check confirmed PNR status, live train running status, seat availability and train time table. Fast, simple, and ad-free experience on RailYatra.',
    keywords = 'PNR status, live train status, train running status, indian railway, irctc pnr, train schedule, seat availability',
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

            {/* Google Search Console Verification */}
            <meta name="google-site-verification" content="YOUR_VERIFICATION_TOKEN_HERE" />

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
            {/* JSON-LD Structured Data */}
            <script type="application/ld+json">
                {JSON.stringify(jsonLd || {
                    "@context": "https://schema.org",
                    "@type": "WebSite",
                    "url": canonical,
                    "name": title,
                    "description": description,
                    "publisher": {
                        "@type": "Organization",
                        "name": "RailYatra",
                        "logo": {
                            "@type": "ImageObject",
                            "url": "https://railyatra.co.in/icon-192.png",
                            "width": 192,
                            "height": 192
                        }
                    }
                })}
            </script>
        </Helmet>
    );
};

export default SEOHead;
