import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Search, Hash, Clock, AlertCircle, ArrowRight, Train } from 'lucide-react';
import GoogleAd from '../components/GoogleAd';
import SEOHead from '../components/SEOHead';
import FAQSection from '../components/FAQSection';
import { getPNRStatus } from '../services/railwayApi';

// JSON-LD Schema for PNR page with FAQ
const getPnrJsonLd = () => ({
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "WebApplication",
            "name": "RailYatra PNR Status Checker",
            "url": "https://railyatra.co.in/pnr",
            "applicationCategory": "TravelApplication",
            "operatingSystem": "Web Browser",
            "description": "Check your Indian Railways PNR status instantly. Get real-time updates on ticket confirmation, berth allocation, and coach details.",
            "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "INR"
            }
        },
        {
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What is PNR number?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "PNR (Passenger Name Record) is a unique 10-digit number assigned to every train ticket booked through Indian Railways. It contains all your journey details including passenger names, train number, boarding station, and ticket status."
                    }
                },
                {
                    "@type": "Question",
                    "name": "How to check PNR status?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Enter your 10-digit PNR number in the search box above and click 'Check Status'. You'll instantly see your ticket confirmation status, berth details, and coach number."
                    }
                },
                {
                    "@type": "Question",
                    "name": "What does CNF, RAC, and WL mean in PNR status?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "CNF means Confirmed (you have a reserved seat), RAC means Reservation Against Cancellation (you may need to share a berth), WL means Waitlist (no seat assigned yet, waiting for cancellations)."
                    }
                }
            ]
        }
    ]
});

const PNRStatus = () => {
    const { pnrNumber } = useParams(); // Get PNR from URL if available
    const [pnr, setPnr] = useState(pnrNumber || '');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Auto-fetch if PNR comes from URL
    useEffect(() => {
        if (pnrNumber && pnrNumber.length === 10) {
            handleSearchDirect(pnrNumber);
        }
    }, [pnrNumber]);

    const handleSearchDirect = async (pnrValue) => {
        setLoading(true);
        setError(null);
        setResult(null);
        try {
            const data = await getPNRStatus(pnrValue);
            setResult(data);
        } catch (err) {
            setError(err.message || 'Failed to fetch PNR status');
        } finally {
            setLoading(false);
        }
    };


    // Validation state
    const isValidLength = pnr.length === 10;
    const hasInput = pnr.length > 0;
    const isInvalid = hasInput && !isValidLength;

    // Handle input change - clear old results and errors
    const handleInputChange = (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 10); // Only digits, max 10
        setPnr(value);
        setError(null); // Clear error on input change
        if (result) setResult(null); // Clear old result when user edits
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (pnr.length !== 10) {
            setError('PNR must be 10 digits');
            setResult(null);
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const data = await getPNRStatus(pnr);
            setResult(data);
        } catch (err) {
            setError(err.message || 'Failed to fetch PNR status');
        } finally {
            setLoading(false);
        }
    };

    // Dynamic border color based on validation
    const getBorderColor = () => {
        if (!hasInput) return 'rgba(255,255,255,0.1)';
        if (isValidLength) return 'rgba(16, 185, 129, 0.6)'; // Green for valid
        return 'rgba(239, 68, 68, 0.6)'; // Red for invalid
    };

    return (
        <div className="fade-in" style={{ padding: '20px' }}>
            {/* SEO Meta Tags */}
            <SEOHead
                title="Check PNR Status Online - Indian Railway PNR Enquiry | RailYatra"
                description="Instant PNR status check for Indian Railways IRCTC tickets. Get real-time confirmation status, berth details, coach number & waiting list position. Free & fast PNR enquiry."
                keywords="PNR status, check PNR, IRCTC PNR status, Indian railway PNR, PNR enquiry, train ticket status, CNF RAC WL status"
                canonical="https://railyatra.co.in/pnr"
                jsonLd={getPnrJsonLd()}
            />

            <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px', marginTop: '12px' }}>
                PNR <span className="text-gradient">Status</span>
            </h1>

            <form onSubmit={handleSearch} className="glass-panel" style={{ padding: '24px', marginBottom: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent-color)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        PNR Number
                    </label>
                    <span style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        color: isValidLength ? 'var(--success)' : isInvalid ? 'var(--error)' : 'var(--text-secondary)'
                    }}>
                        {pnr.length}/10
                    </span>
                </div>
                <div style={{ position: 'relative', marginBottom: '16px' }}>
                    <Hash style={{ position: 'absolute', left: '16px', top: '16px', color: isInvalid ? 'var(--error)' : 'var(--text-secondary)' }} size={20} />
                    <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="e.g. 2447795565"
                        value={pnr}
                        onChange={handleInputChange}
                        style={{
                            width: '100%',
                            padding: '16px 16px 16px 48px',
                            background: 'rgba(0,0,0,0.2)',
                            border: `2px solid ${getBorderColor()}`,
                            borderRadius: '16px',
                            color: 'white',
                            fontSize: '18px',
                            fontWeight: 600,
                            outline: 'none',
                            boxSizing: 'border-box',
                            transition: 'all 0.3s'
                        }}
                        maxLength={10}
                    />
                    {isInvalid && (
                        <div style={{ fontSize: '11px', color: 'var(--error)', marginTop: '6px', paddingLeft: '4px' }}>
                            Enter all 10 digits of your PNR
                        </div>
                    )}
                </div>
                <button
                    type="submit"
                    className="btn-primary"
                    style={{
                        width: '100%',
                        height: '56px',
                        fontSize: '16px',
                        fontWeight: 700,
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        boxShadow: '0 8px 16px -4px rgba(45, 212, 191, 0.3)'
                    }}
                    disabled={loading || pnr.length !== 10}
                >
                    {loading ? 'Fetching...' : (
                        <>
                            Check Status <ArrowRight size={20} />
                        </>
                    )}
                </button>
            </form>

            {/* Top Ad - Moved below form for better UX */}
            <div style={{ marginBottom: '32px' }}>
                <GoogleAd slot="pnr-top-banner" format="horizontal" />
            </div>

            {/* Error Message */}
            {error && (
                <div style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '12px',
                    padding: '16px',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                }}>
                    <AlertCircle size={20} color="var(--danger)" />
                    <span style={{ color: 'var(--danger)', fontSize: '14px' }}>{error}</span>
                </div>
            )}

            {/* Result Ticket */}
            {result && (
                <div className="fade-in" style={{ marginTop: '32px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', marginLeft: '8px' }}>Ticket Details</h3>
                    <div className="glass-panel" style={{
                        padding: 0,
                        overflow: 'hidden',
                        position: 'relative',
                        color: 'white',
                        background: 'rgba(30, 41, 59, 0.6)'
                    }}>
                        {/* Header Strip */}
                        <div style={{
                            background: 'rgba(45, 212, 191, 0.1)',
                            borderBottom: '1px solid rgba(45, 212, 191, 0.2)',
                            padding: '16px 20px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Train size={18} color="var(--accent-color)" />
                                <span style={{ fontWeight: 600, color: 'var(--accent-color)' }}>{result.trainNo}</span>
                            </div>
                            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{result.trainName}</span>
                        </div>

                        {/* Main Body */}
                        <div style={{ padding: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                                <div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>From</div>
                                    <div style={{ fontSize: '24px', fontWeight: 800 }}>{result.from}</div>
                                    <div style={{ fontSize: '13px', fontWeight: 500 }}>{result.fromName}</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>{result.departureTime}</div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{result.duration}</div>
                                    <div style={{ width: '80%', height: '1px', background: 'rgba(255,255,255,0.1)', position: 'relative' }}>
                                        <div style={{ position: 'absolute', right: 0, top: '-3px', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text-secondary)' }}></div>
                                        <div style={{ position: 'absolute', left: 0, top: '-3px', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text-secondary)' }}></div>
                                    </div>
                                </div>

                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>To</div>
                                    <div style={{ fontSize: '24px', fontWeight: 800 }}>{result.to}</div>
                                    <div style={{ fontSize: '13px', fontWeight: 500 }}>{result.toName}</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>{result.arrivalTime}</div>
                                </div>
                            </div>

                            {/* Divider Dashed */}
                            <div style={{
                                borderTop: '2px dashed rgba(255,255,255,0.1)',
                                margin: '0 -20px 20px -20px',
                                position: 'relative'
                            }}>
                                <div style={{ position: 'absolute', left: '-10px', top: '-10px', width: '20px', height: '20px', borderRadius: '50%', background: '#0f172a' }}></div>
                                <div style={{ position: 'absolute', right: '-10px', top: '-10px', width: '20px', height: '20px', borderRadius: '50%', background: '#0f172a' }}></div>
                            </div>

                            {/* Passengers */}
                            <div>
                                {result.passengers.map((p, idx) => (
                                    <div key={idx} style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '12px',
                                        background: 'rgba(255,255,255,0.03)',
                                        borderRadius: '12px',
                                        marginBottom: idx !== result.passengers.length - 1 ? '8px' : 0,
                                        border: '1px solid rgba(255,255,255,0.05)'
                                    }}>
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: '14px' }}>{p.name}</div>
                                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                                                Coach: {p.coach} | Berth: {p.berth} {p.berthCode ? `(${p.berthCode})` : ''}
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{
                                                color: p.status.includes('CNF') ? 'var(--success)' : p.status.includes('RAC') ? 'var(--warning)' : 'var(--error)',
                                                fontWeight: 700,
                                                fontSize: '15px'
                                            }}>{p.status}</div>
                                            <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Booked: {p.bookingStatus}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Publisher Content: Comprehensive Guide */}
            <div className="glass-panel" style={{ padding: '32px', marginBottom: '32px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px' }}>Understanding <span className="text-gradient">PNR Status</span></h2>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                    <div>
                        <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px', color: 'var(--accent-color)' }}>What is PNR?</h3>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '14px' }}>
                            PNR stands for <strong>Passenger Name Record</strong>. It is a unique 10-digit number assigned to every train ticket booked via Indian Railways CRS (Computerized Reservation System). The PNR number is located on the top-left corner of your printed ticket or in the SMS received after booking. It holds vital information like passenger details, route, and current status.
                        </p>
                    </div>
                    <div>
                        <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px', color: 'var(--accent-color)' }}>Booking Status Codes</h3>
                        <ul style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '14px', paddingLeft: '20px' }}>
                            <li style={{ marginBottom: '8px' }}><strong style={{ color: 'var(--success)' }}>CNF (Confirmed)</strong>: Your seat is confirmed. You have been allotted a coach and berth number.</li>
                            <li style={{ marginBottom: '8px' }}><strong style={{ color: 'var(--warning)' }}>RAC (Reservation Against Cancellation)</strong>: You have a confirmed travel authority but may have to share a side-lower berth. You likely will get a full berth if others cancel.</li>
                            <li style={{ marginBottom: '8px' }}><strong style={{ color: 'var(--danger)' }}>WL (Waiting List)</strong>: No seat is allotted yet. You cannot board the train if your ticket remains WL after chart preparation.</li>
                        </ul>
                    </div>
                </div>

                <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>How to Check PNR Status?</h3>
                <ol style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '14px', paddingLeft: '20px', marginBottom: '24px' }}>
                    <li style={{ marginBottom: '8px' }}>Locate the 10-digit PNR number on your ticket.</li>
                    <li style={{ marginBottom: '8px' }}>Enter the number in the search box above.</li>
                    <li style={{ marginBottom: '8px' }}>Click on "Check Status" button.</li>
                    <li style={{ marginBottom: '8px' }}>View your current status, coach position, and platform number instantly.</li>
                </ol>

                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', borderLeft: '4px solid var(--accent-color)' }}>
                    <p style={{ margin: 0, fontSize: '14px', fontStyle: 'italic', color: 'var(--text-secondary)' }}>
                        <strong>Note:</strong> PNR status is dynamic. A Waiting List (WL) ticket can move to RAC or Confirmed (CNF) as other passengers cancel. We recommend checking the status periodically, especially 4 hours before departure when the final chart is prepared.
                    </p>
                </div>
            </div>

            {/* Visual FAQ Section */}
            <FAQSection faqs={[
                {
                    question: "Can I travel with a WL (Waitlisted) ticket?",
                    answer: "If you booked a ticket online (e-ticket) and it remains fully waitlisted after chart preparation, it gets automatically cancelled and refunded. You CANNOT travel. However, if you bought a counter ticket, you can technically board the general compartment, but it's not advised."
                },
                {
                    question: "What is Chart Preparation time?",
                    answer: "The final chart is usually prepared 4 hours before the train's scheduled departure from the originating station. For early morning trains, charts are prepared the previous night."
                },
                {
                    question: "What does PQWL, RLWL, and GNWL mean?",
                    answer: "GNWL (General Waiting List) has the highest chance of confirmation. RLWL (Remote Location WL) is for intermediate stations and has lower chances. PQWL (Pooled Quota WL) is for short distances and has the least chance of confirmation."
                }
            ]} />
        </div>
    );
};

export default PNRStatus;
