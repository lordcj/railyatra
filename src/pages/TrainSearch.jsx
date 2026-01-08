import React, { useState, useEffect } from 'react';
import { Search, Clock, ArrowRight, Train } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FAQSection from '../components/FAQSection';
import SEOHead from '../components/SEOHead';

const TrainSearch = () => {
    const navigate = useNavigate();
    const [trainNo, setTrainNo] = useState('');

    // Scroll to top when component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (trainNo) {
            navigate(`/train-details/${trainNo}`);
        }
    };

    const recentTrains = [
        { name: "Vande Bharat Exp", number: "22436" },
        { name: "Shatabdi Express", number: "12002" }
    ];

    return (
        <div className="fade-in" style={{ padding: '20px' }}>
            <SEOHead
                title="Train Schedule & Time Table - Check Route & Stoppages | RailYatra"
                description="Get detailed Indian Railways train schedule, time table, route map, and running days. Search by train number or name for accurate information."
                keywords="train schedule, train time table, indian railway time table, train route, train stoppages, check train schedule"
                canonical="https://railyatra.co.in/search-train"
            />
            <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px', marginTop: '12px' }}>
                Find <span className="text-gradient">Train</span>
            </h2>

            <div className="glass-panel" style={{ padding: '24px', marginBottom: '32px' }}>
                <form onSubmit={handleSearch}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                            Train Number or Name
                        </label>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            background: 'rgba(0,0,0,0.2)',
                            padding: '12px',
                            borderRadius: '12px',
                            border: '1px solid rgba(255,255,255,0.05)'
                        }}>
                            <Train size={20} color="var(--accent-color)" />
                            <input
                                type="text"
                                placeholder="Ex. 12951"
                                value={trainNo}
                                onChange={(e) => setTrainNo(e.target.value)}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'white',
                                    width: '100%',
                                    outline: 'none',
                                    fontSize: '16px',
                                    fontWeight: 500
                                }}
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn-primary">
                        Get Schedule
                    </button>
                </form>
            </div>

            <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: 600 }}>Recent Searches</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {recentTrains.map((train, idx) => (
                    <div key={idx}
                        onClick={() => navigate(`/train-details/${train.number}`)}
                        className="glass-panel"
                        style={{
                            padding: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '50%' }}>
                                <Clock size={20} color="var(--text-secondary)" />
                            </div>
                            <div>
                                <div style={{ fontWeight: 600 }}>{train.number}</div>
                                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{train.name}</div>
                            </div>
                        </div>
                        <ArrowRight size={20} color="var(--text-secondary)" />
                    </div>
                ))}
            </div>
            {/* Publisher Content: Schedule Guide */}
            <div className="glass-panel" style={{ padding: '32px', marginBottom: '32px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px' }}>Indian Railways <span className="text-gradient">Time Table</span></h2>

                <div style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '15px' }}>
                    <p style={{ marginBottom: '16px' }}>
                        The Indian Railways network is one of the largest in the world, operating over 13,000 passenger trains daily. Knowing the accurate schedule is crucial for a hassle-free journey. RailYatra provides the most up-to-date train time table, sourced directly from the National Train Enquiry System (NTES) data.
                    </p>

                    <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px', color: 'white', marginTop: '24px' }}>Reading the Train Schedule</h3>
                    <ul style={{ paddingLeft: '20px', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <li><strong>Arrival Time:</strong> The time a train reaches a specific station.</li>
                        <li><strong>Departure Time:</strong> The time a train leaves the station.</li>
                        <li><strong>Halt Time:</strong> The duration a train stops at a station (Departure - Arrival).</li>
                        <li><strong>Distance:</strong> Kilometers covered from the originating station.</li>
                        <li><strong>Day Count:</strong> Indicates if the train is on Day 1, Day 2, etc., of its journey.</li>
                    </ul>

                    <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px', color: 'white' }}>Types of Trains</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px' }}>
                            <strong style={{ color: 'var(--accent-color)', display: 'block', marginBottom: '4px' }}>Vande Bharat</strong>
                            <span style={{ fontSize: '13px' }}>India's semi-high speed train set, known for comfort and speed.</span>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px' }}>
                            <strong style={{ color: 'var(--accent-color)', display: 'block', marginBottom: '4px' }}>Rajdhani Express</strong>
                            <span style={{ fontSize: '13px' }}>Premium fully air-conditioned trains connecting state capitals to New Delhi.</span>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px' }}>
                            <strong style={{ color: 'var(--accent-color)', display: 'block', marginBottom: '4px' }}>Shatabdi Express</strong>
                            <span style={{ fontSize: '13px' }}>Day trains connecting major cities, returning to origin the same day.</span>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px' }}>
                            <strong style={{ color: 'var(--accent-color)', display: 'block', marginBottom: '4px' }}>Mail/Express</strong>
                            <span style={{ fontSize: '13px' }}>The backbone of Indian rail travel, connecting distant parts of the country.</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* About Section for SEO */}
            <div style={{ marginTop: '32px', color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
                <h3 style={{ color: 'white', marginBottom: '12px', fontSize: '18px' }}>About Train Schedule Search</h3>
                <p style={{ marginBottom: '12px' }}>
                    RailYatra allows you to check the latest Indian Railways train time table and schedule.
                    Enter any 5-digit train number (like 12951) or train name (like Rajdhani Express) to get detailed route information.
                </p>
                <p>
                    Check arrival & departure times, platform numbers, and halt duration for all stations easily.
                </p>
            </div>

            {/* FAQ Section */}
            <FAQSection
                title="Common Questions"
                faqs={[
                    {
                        question: "How do I find a train schedule?",
                        answer: "Simply enter the 5-digit train number or the name of the train in the search box above. Click 'Get Schedule' to see the full route and timing details."
                    },
                    {
                        question: "Is the time table accurate?",
                        answer: "We strive to provide the most recent schedule information. For live running status, please check the 'Live Train' feature to see current delays."
                    },
                    {
                        question: "Can I see platform numbers?",
                        answer: "Yes, the train schedule page displays the expected platform number for major stations. Please note that platform numbers can change last minute at the station manager's discretion."
                    }
                ]}
            />
        </div>
    );
};

export default TrainSearch;
