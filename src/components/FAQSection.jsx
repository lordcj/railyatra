import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div style={{
            marginBottom: '10px',
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            overflow: 'hidden'
        }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '100%',
                    padding: '16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'transparent',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    textAlign: 'left'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <HelpCircle size={18} color="var(--accent-color)" />
                    <span style={{ fontWeight: 600, fontSize: '15px' }}>{question}</span>
                </div>
                {isOpen ? <ChevronUp size={20} color="var(--text-secondary)" /> : <ChevronDown size={20} color="var(--text-secondary)" />}
            </button>

            {isOpen && (
                <div className="fade-in" style={{
                    padding: '0 16px 16px 46px',
                    color: 'var(--text-secondary)',
                    fontSize: '14px',
                    lineHeight: '1.5'
                }}>
                    {answer}
                </div>
            )}
        </div>
    );
};

const FAQSection = ({ faqs, title = "Frequently Asked Questions" }) => {
    if (!faqs || faqs.length === 0) return null;

    return (
        <section style={{ marginTop: '32px', marginBottom: '32px' }}>
            <h2 style={{
                fontSize: '20px',
                fontWeight: 700,
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            }}>
                {title}
            </h2>
            <div>
                {faqs.map((faq, index) => (
                    <FAQItem key={index} question={faq.question} answer={faq.answer} />
                ))}
            </div>
        </section>
    );
};

export default FAQSection;
