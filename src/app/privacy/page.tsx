import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy',
    description: 'RailYatra Privacy Policy - Learn how we collect, use, and protect your information when you use our railway information services.',
    alternates: {
        canonical: 'https://railyatra.co.in/privacy',
    },
};

export default function PrivacyPage() {
    return (
        <div className="fade-in" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '24px' }}>
                Privacy Policy
            </h1>

            <div style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '14px' }}>
                <p style={{ marginBottom: '16px' }}>
                    Last updated: January 2026
                </p>

                <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '32px', marginBottom: '12px' }}>
                    Information We Collect
                </h2>
                <p style={{ marginBottom: '16px' }}>
                    RailYatra collects minimal information to provide railway information services. This includes:
                </p>
                <ul style={{ marginBottom: '16px', paddingLeft: '20px' }}>
                    <li>PNR numbers entered for status checking (not stored)</li>
                    <li>Train numbers searched</li>
                    <li>Basic analytics data (page views, device type)</li>
                </ul>

                <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '32px', marginBottom: '12px' }}>
                    How We Use Your Information
                </h2>
                <p style={{ marginBottom: '16px' }}>
                    We use the information to:
                </p>
                <ul style={{ marginBottom: '16px', paddingLeft: '20px' }}>
                    <li>Provide PNR status and train information</li>
                    <li>Improve our services based on usage patterns</li>
                    <li>Display relevant advertisements</li>
                </ul>

                <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '32px', marginBottom: '12px' }}>
                    Third-Party Services
                </h2>
                <p style={{ marginBottom: '16px' }}>
                    We use the following third-party services:
                </p>
                <ul style={{ marginBottom: '16px', paddingLeft: '20px' }}>
                    <li>Google Analytics for website analytics</li>
                    <li>Google AdSense for advertisements</li>
                    <li>Indian Railways API for train data</li>
                </ul>

                <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '32px', marginBottom: '12px' }}>
                    Data Security
                </h2>
                <p style={{ marginBottom: '16px' }}>
                    We do not store your PNR numbers or personal travel information. All data is transmitted
                    securely using HTTPS encryption.
                </p>

                <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '32px', marginBottom: '12px' }}>
                    Contact Us
                </h2>
                <p style={{ marginBottom: '16px' }}>
                    If you have questions about this privacy policy, please contact us at privacy@railyatra.co.in
                </p>
            </div>
        </div>
    );
}
