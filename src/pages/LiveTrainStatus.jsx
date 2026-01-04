import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getLiveTrainStatus } from '../services/railRadarApi';
import SEOHead from '../components/SEOHead';
import '../styles/LiveTrainStatus.css';

export default function LiveTrainStatus() {
    const { trainNumber: urlTrainNumber } = useParams();
    const [trainNumber, setTrainNumber] = useState(urlTrainNumber || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [trainData, setTrainData] = useState(null);

    // Scroll to top when component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Auto-search if train number is in URL
    useEffect(() => {
        if (urlTrainNumber && urlTrainNumber.length >= 4) {
            handleSearchDirect(urlTrainNumber);
        }
    }, [urlTrainNumber]);

    const handleSearchDirect = async (number) => {
        if (!number) return;
        setLoading(true);
        setError('');
        setTrainData(null);
        try {
            const data = await getLiveTrainStatus(number);
            setTrainData(data);
        } catch (err) {
            setError(err.message || 'Unable to fetch live train status');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();

        if (!trainNumber || trainNumber.length < 4) {
            setError('Please enter a valid train number');
            return;
        }

        setLoading(true);
        setError('');
        setTrainData(null);

        try {
            const data = await getLiveTrainStatus(trainNumber);
            setTrainData(data);
        } catch (err) {
            setError(err.message || 'Unable to fetch live train status');
        } finally {
            setLoading(false);
        }
    };

    const formatDelay = (delay) => {
        if (!delay || delay === 0) return 'On Time';
        return `${delay} min ${delay > 0 ? 'late' : 'early'}`;
    };

    // Dynamic SEO Data
    const seoTitle = trainData
        ? `Live Status: ${trainData.trainName} (${trainData.trainNumber}) - RailYatra`
        : 'Live Train Running Status - Track Train Position | RailYatra';

    const seoDesc = trainData
        ? `Check live running status of ${trainData.trainName} (${trainData.trainNumber}). Current location: ${trainData.liveData.currentPosition}. Delay: ${formatDelay(trainData.liveData.delay)}.`
        : 'Track live train status, current position, delay updates, and expected arrival time for any Indian Railways train. Real-time updates powered by RailRadar.';

    // Static FAQs for Live Status
    const liveFaqs = [
        {
            question: "How accurate is the live train status?",
            answer: "RailYatra uses real-time GPS tracking data from RailRadar to provide the most accurate live train status updates, usually delayed by only a few minutes."
        },
        {
            question: "Can I track any train in India?",
            answer: "Yes, you can track the live status of any scheduled Indian Railways train by entering its 5-digit number or name."
        },
        {
            question: "What does 'Last Updated' mean?",
            answer: "The 'Last Updated' time indicates when the train's location was last reported to the system. If it's old, the train might be in a no-network zone."
        }
    ];

    return (
        <div className="live-train-status-page">
            <SEOHead
                title={seoTitle}
                description={seoDesc}
                keywords={`live train status, train running status, ${trainData ? `${trainData.trainNumber} live status, ${trainData.trainName} running status,` : ''} where is my train, rail radar`}
                canonical={`https://railyatra.co.in/live${trainNumber ? `/${trainNumber}` : ''}`}
            />

            <div className="live-status-container">
                <div className="live-status-header">
                    <h1>🚂 Live Train Tracking</h1>
                    <p>Real-time train position, delays, and ETA powered by RailRadar</p>
                </div>

                <form onSubmit={handleSearch} className="live-search-form">
                    <div className="search-input-group">
                        <input
                            type="text"
                            placeholder="Enter Train Number (e.g., 12951)"
                            value={trainNumber}
                            onChange={(e) => setTrainNumber(e.target.value)}
                            className="live-search-input"
                            maxLength="5"
                        />
                        <button
                            type="submit"
                            className="live-search-btn"
                            disabled={loading}
                        >
                            {loading ? '🔄 Tracking...' : '📍 Track Live'}
                        </button>
                    </div>
                </form>

                {error && (
                    <div className="live-error-message">
                        <span>⚠️</span>
                        <p>{error}</p>
                    </div>
                )}

                {trainData && (
                    <div className="live-train-data">
                        <div className="train-header-info">
                            <div className="train-title">
                                <h2>{trainData.trainName}</h2>
                                <span className="train-number-badge">#{trainData.trainNumber}</span>
                            </div>
                            <div className="last-updated">
                                Last updated: {new Date(trainData.liveData.lastUpdated).toLocaleTimeString()}
                            </div>
                        </div>

                        <div className="live-status-cards">
                            <div className="status-card current-position">
                                <div className="card-icon">📍</div>
                                <div className="card-content">
                                    <h3>Current Position</h3>
                                    <p className="status-value">{trainData.liveData.currentPosition}</p>
                                </div>
                            </div>

                            <div className="status-card delay-info">
                                <div className="card-icon">⏱️</div>
                                <div className="card-content">
                                    <h3>Status</h3>
                                    <p className={`status-value ${trainData.liveData.delay > 0 ? 'delayed' : 'ontime'}`}>
                                        {formatDelay(trainData.liveData.delay)}
                                    </p>
                                </div>
                            </div>

                            <div className="status-card next-station">
                                <div className="card-icon">🚉</div>
                                <div className="card-content">
                                    <h3>Next Station</h3>
                                    <p className="status-value">{trainData.liveData.nextStation}</p>
                                </div>
                            </div>

                            <div className="status-card eta-info">
                                <div className="card-icon">🕐</div>
                                <div className="card-content">
                                    <h3>Expected Arrival</h3>
                                    <p className="status-value">{trainData.liveData.eta}</p>
                                </div>
                            </div>
                        </div>

                        {trainData.route && trainData.route.length > 0 && (
                            <div className="route-section">
                                <h3>📋 Route Information</h3>
                                <div className="route-list">
                                    {trainData.route.map((station, index) => (
                                        <div key={index} className="route-station">
                                            <div className="station-marker"></div>
                                            <div className="station-info">
                                                <span className="station-name">{station.stationName || station.name}</span>
                                                <span className="station-time">{station.arrivalTime || station.time}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {trainData.runningDays && trainData.runningDays.length > 0 && (
                            <div className="running-days-section">
                                <h4>🗓️ Running Days</h4>
                                <div className="days-list">
                                    {trainData.runningDays.map((day, index) => (
                                        <span key={index} className="day-badge">{day}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {trainData && !loading && !error && (
                    <div className="live-placeholder">
                        <div className="placeholder-icon">🔍</div>
                        <h3>Track Your Train in Real-Time</h3>
                        <p>Enter a train number to see live position, delays, and arrival information</p>
                        <div className="feature-list">
                            <div className="feature-item">✅ Real-time position updates</div>
                            <div className="feature-item">✅ Delay information</div>
                            <div className="feature-item">✅ Next station & ETA</div>
                            <div className="feature-item">✅ Complete route details</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
