import React, { useEffect } from 'react';
import { Shield, Lock, Eye, Cookie, FileText, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SEOHead from '../components/SEOHead';

const Privacy = () => {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const Section = ({ icon: Icon, title, children }) => (
        <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{
                    background: 'rgba(45, 212, 191, 0.1)',
                    padding: '8px',
                    borderRadius: '10px',
                    color: 'var(--accent-color)'
                }}>
                    <Icon size={20} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>{title}</h3>
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
                {children}
            </div>
        </div>
    );

    return (
        <div className="fade-in" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <SEOHead
                title="Privacy Policy - RailYatra"
                description="Privacy Policy for RailYatra. Learn how we handle your data, cookies, and privacy."
            />
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px', marginTop: '12px' }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: 'none',
                        padding: '8px',
                        borderRadius: '50%',
                        color: 'white',
                        cursor: 'pointer'
                    }}
                >
                    <ChevronLeft size={24} />
                </button>
                <h2 style={{ fontSize: '24px', fontWeight: 800, margin: 0 }}>
                    Privacy <span className="text-gradient">Policy</span>
                </h2>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '32px', lineHeight: '1.6' }}>
                Last Updated: January 4, 2026. Your privacy is important to us. This policy explains how we collect, use, and protect your information when you use RailYatra.
            </p>

            <Section icon={Eye} title="Information We Collect">
                <p>We do not require user accounts or store personal identification information like names or phone numbers on our servers. The app primarily processes:</p>
                <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
                    <li><strong>Search Queries:</strong> Train numbers or station codes you search for are processed to fetch live data.</li>
                    <li><strong>PNR Numbers:</strong> When you check a PNR, the number is sent to our partner API to retrieve status. We do not store these numbers.</li>
                    <li><strong>Device Info:</strong> Basic Technical data like browser type and OS for optimization.</li>
                </ul>
            </Section>

            <Section icon={Cookie} title="Google AdSense & Cookies">
                <p>We use Google AdSense to show advertisements to help keep this service free. Google uses cookies to serve ads based on your prior visits to our website or other websites.</p>
                <p style={{ marginTop: '10px' }}>Google's use of advertising cookies enables it and its partners to serve ads to you based on your visit to our sites and/or other sites on the Internet.</p>
                <p style={{ marginTop: '10px' }}><strong>Opt-out:</strong> You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-color)' }}>Ads Settings</a>.</p>
            </Section>

            <Section icon={Lock} title="Data Security">
                <p>We implement a variety of security measures to maintain the safety of your information. All API communications are executed over secure HTTPS protocols. Since we do not store sensitive personal data, the risk of data compromise is significantly minimized.</p>
            </Section>

            <Section icon={FileText} title="Third-Party Services">
                <p>Our app integrates with third-party APIs (like RailRadar and PNR APIs) to provide real-time information. These services have their own privacy policies. We are not responsible for the content or activities of these linked services.</p>
            </Section>

            <Section icon={Shield} title="Your Consent">
                <p>By using our site, you consent to our privacy policy. If we decide to change our privacy policy, we will post those changes on this page.</p>
            </Section>

            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-secondary)', fontSize: '13px' }}>
                &copy; 2026 RailYatra. Built for Indian Railway Travelers.
            </div>
        </div>
    );
};

export default Privacy;
