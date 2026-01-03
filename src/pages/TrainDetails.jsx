import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, MoreVertical } from 'lucide-react';
import GoogleAd from '../components/GoogleAd';

const TrainDetails = () => {
    const { trainNo } = useParams();
    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            // Threshold increased to 50px to clear the hero text area
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Mock Data
    const schedule = [
        { code: "NDLS", name: "New Delhi", time: "16:55", date: "Day 1", status: "On Time" },
        { code: "KOTA", name: "Kota Jn", time: "21:30", date: "Day 1", status: "On Time" },
        { code: "BRC", name: "Vadodara Jn", time: "03:52", date: "Day 2", status: "Delayed 5m" },
        { code: "MMCT", name: "Mumbai Central", time: "08:35", date: "Day 2", status: "On Time" },
    ];

    return (
        <div className="fade-in" style={{ paddingBottom: '100px' }}>

            {/* Sticky Navbar */}
            <div style={{
                position: 'sticky',
                top: 0,
                zIndex: 50,
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: isScrolled ? 'rgba(15, 23, 42, 0.95)' : 'transparent',
                backdropFilter: isScrolled ? 'blur(12px)' : 'none',
                WebkitBackdropFilter: isScrolled ? 'blur(12px)' : 'none',
                borderBottom: isScrolled ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent',
                transition: 'all 0.3s ease'
            }}>
                <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'white' }}>
                    <ArrowLeft size={24} />
                </button>

                {/* Navbar Title - Fades in on Scroll */}
                <h2 style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    opacity: isScrolled ? 1 : 0,
                    transform: isScrolled ? 'translateY(0)' : 'translateY(10px)',
                    transition: 'all 0.3s ease',
                    position: 'absolute',
                    left: '50%',
                    transform: `translateX(-50%) ${isScrolled ? 'translateY(0)' : 'translateY(10px)'}`,
                    whiteSpace: 'nowrap'
                }}>
                    {trainNo || "12952"} - Rajdhani Exp
                </h2>

                <MoreVertical size={24} />
            </div>

            {/* Hero Section (Scrolls naturally) */}
            <div style={{
                padding: '0 20px 24px 20px',
                marginTop: '-10px'
            }}>
                <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '4px' }}>{trainNo || "12952"}</h1>
                <p style={{ color: 'var(--accent-color)', fontWeight: 500 }}>New Delhi Rajdhani Express</p>
                <div style={{
                    display: 'flex',
                    gap: '12px',
                    marginTop: '12px',
                    fontSize: '12px',
                    color: 'var(--text-secondary)'
                }}>
                    <span>Runs Daily</span>
                    <span>•</span>
                    <span>Superfast</span>
                </div>
            </div>

            {/* Ad Placement - Between info and schedule */}
            <div style={{ padding: '0 20px' }}>
                <GoogleAd slot="train-details-ad" format="horizontal" />
            </div>

            {/* Timeline */}
            <div style={{ padding: '20px', paddingTop: '0' }}>
                {schedule.map((stop, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '20px', marginBottom: '0', position: 'relative' }}>

                        {/* Thread Line */}
                        {idx !== schedule.length - 1 && (
                            <div style={{
                                position: 'absolute',
                                left: '27px',
                                top: '40px',
                                bottom: '-20px',
                                width: '2px',
                                background: 'rgba(255,255,255,0.1)'
                            }}></div>
                        )}

                        {/* Time Column */}
                        <div style={{ width: '50px', paddingTop: '4px', textAlign: 'right' }}>
                            <div style={{ fontWeight: 600 }}>{stop.time}</div>
                            <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{stop.date}</div>
                        </div>

                        {/* Icon Column */}
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <div style={{
                                width: '16px',
                                height: '16px',
                                borderRadius: '50%',
                                background: idx === 0 || idx === schedule.length - 1 ? 'var(--accent-color)' : 'var(--bg-primary)',
                                border: `2px solid var(--accent-color)`,
                                marginTop: '6px'
                            }}></div>
                        </div>

                        {/* Details Column */}
                        <div style={{ flex: 1, paddingBottom: '32px' }}>
                            <div style={{ fontWeight: 600, fontSize: '16px' }}>{stop.name}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{stop.code}</div>
                            <span style={{
                                fontSize: '10px',
                                padding: '4px 8px',
                                borderRadius: '12px',
                                background: stop.status.includes('Delayed') ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)',
                                color: stop.status.includes('Delayed') ? 'var(--danger)' : 'var(--success)'
                            }}>
                                {stop.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TrainDetails;
