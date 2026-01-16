import { Metadata } from 'next';
import { generatePNRMetadata } from '@/lib/seo/metadata';
import { PNRForm } from './PNRForm';
import { generateFAQSchema, generateBreadcrumbSchema } from '@/components/seo/schema';

export const metadata: Metadata = generatePNRMetadata();

const pnrFaqs = [
    {
        question: 'What is PNR Status?',
        answer: 'PNR (Passenger Name Record) Status shows the current booking status of your Indian Railway ticket. It indicates whether your ticket is Confirmed (CNF), Waitlisted (WL), or RAC (Reservation Against Cancellation).',
    },
    {
        question: 'How to check PNR Status?',
        answer: 'Enter your 10-digit PNR number from your ticket in the search box above. You can find the PNR number on the top-left corner of your e-ticket or printed ticket.',
    },
    {
        question: 'What does CNF, WL, RAC mean?',
        answer: 'CNF means Confirmed - you have a guaranteed seat/berth. WL means Waitlisted - your booking is pending and depends on cancellations. RAC means you have a seat but may need to share a berth.',
    },
    {
        question: 'How often is PNR status updated?',
        answer: 'PNR status is updated in real-time by Indian Railways. The status typically changes after chart preparation, which happens 4 hours before train departure.',
    },
    {
        question: 'Can I travel with a WL ticket?',
        answer: 'You cannot board the train with a WL (Waitlisted) ticket. If your status remains WL after chart preparation, your ticket is automatically cancelled and you receive a refund.',
    },
];

export default function PNRPage() {
    const faqSchema = generateFAQSchema(pnrFaqs);
    const breadcrumbSchema = generateBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'PNR Status', url: '/pnr' },
    ]);

    return (
        <div className="fade-in" style={{ padding: '20px' }}>
            {/* JSON-LD Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@graph': [faqSchema, breadcrumbSchema] }) }}
            />

            {/* Header */}
            <header style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>
                    Check <span className="text-gradient">PNR Status</span>
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                    Get instant PNR status for Indian Railway tickets
                </p>
            </header>

            {/* PNR Form */}
            <PNRForm />

            {/* Info Section */}
            <section className="glass-panel" style={{ padding: '24px', marginTop: '32px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>
                    About PNR Status
                </h2>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '14px', marginBottom: '16px' }}>
                    PNR (Passenger Name Record) is a unique 10-digit number assigned to every Indian Railway booking.
                    It contains all the details of your journey including train number, date of travel, coach, seat/berth number,
                    and current booking status.
                </p>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '14px' }}>
                    RailYatra provides the fastest PNR status check. Simply enter your PNR number above to get
                    instant results including confirmation probability, current status, and chart preparation status.
                </p>
            </section>

            {/* FAQ Section */}
            <section style={{ marginTop: '32px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>
                    Frequently Asked Questions
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {pnrFaqs.map((faq, index) => (
                        <details
                            key={index}
                            className="glass-panel"
                            style={{ padding: '16px' }}
                        >
                            <summary style={{
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: 600,
                                color: 'var(--text-primary)',
                                listStyle: 'none',
                            }}>
                                {faq.question}
                            </summary>
                            <p style={{
                                marginTop: '12px',
                                color: 'var(--text-secondary)',
                                fontSize: '13px',
                                lineHeight: '1.6',
                            }}>
                                {faq.answer}
                            </p>
                        </details>
                    ))}
                </div>
            </section>
        </div>
    );
}
