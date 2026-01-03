import { useState } from 'react';
import { getLiveTrainStatus } from '../services/railRadarApi';
import '../styles/LiveTrainStatus.css';

export default function LiveTrainStatus() {
    const [trainNumber, setTrainNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [trainData, setTrainData] = useState(null);

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

    return (
        <div className="live-train-status-page">
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

                {!trainData && !loading && !error && (
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
