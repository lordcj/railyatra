import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, MoreVertical, Clock, AlertCircle, ChevronDown, ChevronRight } from 'lucide-react';
import GoogleAd from '../components/GoogleAd';
import SEOHead from '../components/SEOHead';
import FAQSection from '../components/FAQSection';
import { getTrainSchedule } from '../services/railwayApi';

// Helper to generate TrainTrip Schema
const getTrainJsonLd = (trainData) => {
    if (!trainData) return null;

    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "TrainTrip",
                "trainName": trainData.trainName,
                "trainNumber": trainData.trainNo,
                "departureStation": {
                    "@type": "TrainStation",
                    "name": trainData.fromStationName || trainData.fromStation || "Origin"
                },
                "arrivalStation": {
                    "@type": "TrainStation",
                    "name": trainData.toStationName || trainData.toStation || "Destination"
                },
                "departureTime": trainData.departureTime,
                "arrivalTime": trainData.arrivalTime,
                "provider": {
                    "@type": "Organization",
                    "name": "Indian Railways"
                }
            },
            {
                "@type": "FAQPage",
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": `What are the running days of ${trainData.trainNo} ${trainData.trainName}?`,
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": `${trainData.trainName} (${trainData.trainNo}) runs on ${trainData.runningDays || 'Scheduled days'}. Check the full schedule for details.`
                        }
                    },
                    {
                        "@type": "Question",
                        "name": `How many stops does ${trainData.trainNo} have?`,
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": `${trainData.trainName} has ${trainData.stations?.length || 'several'} stops on its route from ${trainData.fromStationName || 'Origin'} to ${trainData.toStationName || 'Destination'}.`
                        }
                    }
                ]
            }
        ]
    };
};

// Component for displaying a collapsible group of non-halt stations
const NonHaltStationsGroup = ({ stations, isExpanded, onToggle }) => {
    if (stations.length === 0) return null;

    return (
        <div style={{ marginLeft: '60px', marginBottom: '16px' }}>
            {/* Collapsible Header */}
            <div
                onClick={onToggle}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 14px',
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    border: '1px dashed rgba(255,255,255,0.15)',
                    transition: 'all 0.2s ease'
                }}
            >
                {isExpanded ? (
                    <ChevronDown size={16} color="var(--text-secondary)" />
                ) : (
                    <ChevronRight size={16} color="var(--text-secondary)" />
                )}
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    {stations.length} pass-through station{stations.length > 1 ? 's' : ''}
                </span>
                <span style={{
                    fontSize: '10px',
                    padding: '2px 8px',
                    borderRadius: '8px',
                    background: 'rgba(255,165,0,0.15)',
                    color: '#ffa500',
                    marginLeft: 'auto'
                }}>
                    No Halt
                </span>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
                <div style={{
                    marginTop: '8px',
                    paddingLeft: '12px',
                    borderLeft: '2px dashed rgba(255,255,255,0.1)'
                }}>
                    {stations.map((station, idx) => (
                        <div
                            key={idx}
                            style={{
                                padding: '10px 14px',
                                background: 'rgba(255,255,255,0.02)',
                                borderRadius: '8px',
                                marginBottom: '6px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}
                        >
                            <div>
                                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                                    {station.name}
                                </div>
                                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>
                                    {station.code} {station.distance && `• ${station.distance}`}
                                </div>
                            </div>
                            <span style={{
                                fontSize: '10px',
                                padding: '2px 8px',
                                borderRadius: '8px',
                                background: 'rgba(255,165,0,0.1)',
                                color: '#ffa500'
                            }}>
                                No Halt
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// Component for displaying a halt station
const HaltStationCard = ({ stop, isLast, trainData }) => (
    <div style={{ display: 'flex', gap: '8px', marginBottom: '0', position: 'relative' }}>
        {/* Thread Line */}
        {!isLast && (
            <div style={{
                position: 'absolute',
                left: '50px',
                top: '32px',
                bottom: '-12px',
                width: '3px',
                background: stop.isPassed ? 'linear-gradient(to bottom, var(--success), rgba(34, 197, 94, 0.3))' : 'rgba(255,255,255,0.1)'
            }}></div>
        )}

        {/* Time Column */}
        <div style={{ width: '42px', paddingTop: '4px', textAlign: 'right' }}>
            <div style={{ fontWeight: 600, fontSize: '14px' }}>{stop.scheduledTime}</div>
            <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '2px' }}>{stop.date}</div>
        </div>

        {/* Icon Column */}
        <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: stop.isCurrent ? 'var(--accent-color)' :
                    stop.isPassed ? 'var(--success)' : 'var(--bg-primary)',
                border: `3px solid ${stop.isCurrent ? 'var(--accent-color)' :
                    stop.isPassed ? 'var(--success)' : 'rgba(255,255,255,0.3)'}`,
                marginTop: '4px',
                boxShadow: stop.isCurrent ? '0 0 12px var(--accent-color)' : 'none'
            }}></div>
        </div>

        {/* Details Column */}
        <div style={{ flex: 1, paddingBottom: '24px', display: 'flex', justifyContent: 'space-between' }}>
            <div>
                <div style={{
                    fontWeight: 600,
                    fontSize: '15px',
                    color: stop.isCurrent ? 'var(--accent-color)' : 'white'
                }}>
                    {stop.name}
                    {stop.isCurrent && <span style={{ marginLeft: '8px', fontSize: '11px' }}>● CURRENT</span>}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    {stop.code} • Platform {stop.platform}
                </div>
            </div>

            {/* Right Side: Actual Time for passed stations */}
            {stop.isPassed && stop.actualArrival && (
                <div style={{ textAlign: 'right', minWidth: '80px' }}>
                    <div style={{
                        fontSize: '14px',
                        fontWeight: 600,
                        color: stop.delayMinutes > 0 ? 'var(--danger)' : 'var(--success)'
                    }}>
                        {stop.actualArrival}
                    </div>
                    {stop.delayMinutes > 0 && (
                        <div style={{
                            fontSize: '10px',
                            color: 'var(--danger)',
                            marginTop: '2px'
                        }}>
                            +{stop.delayMinutes} min late
                        </div>
                    )}
                    {stop.delayMinutes < 0 && (
                        <div style={{
                            fontSize: '10px',
                            color: 'var(--success)',
                            marginTop: '2px'
                        }}>
                            {Math.abs(stop.delayMinutes)} min early
                        </div>
                    )}
                    {stop.delayMinutes === 0 && (
                        <div style={{
                            fontSize: '10px',
                            color: 'var(--success)',
                            marginTop: '2px'
                        }}>
                            On time
                        </div>
                    )}
                </div>
            )}

            {/* Right Side: ETA for upcoming stations */}
            {!stop.isPassed && stop.eta && (
                <div style={{ textAlign: 'right', minWidth: '80px' }}>
                    <div style={{
                        fontSize: '14px',
                        fontWeight: 500,
                        color: 'var(--text-secondary)'
                    }}>
                        {stop.eta}
                    </div>
                    {stop.delayMinutes > 0 && (
                        <span style={{
                            fontSize: '9px',
                            padding: '2px 6px',
                            borderRadius: '8px',
                            background: 'rgba(239, 68, 68, 0.2)',
                            color: 'var(--danger)',
                            marginTop: '4px',
                            display: 'inline-block'
                        }}>
                            +{stop.delayMinutes} min
                        </span>
                    )}
                </div>
            )}
        </div>
    </div>
);

// Component for showing train's current position between stations
const TrainPositionIndicator = ({ fromStation, toStation, trainData }) => {
    // Calculate position based on time elapsed
    const calculatePosition = () => {
        if (!fromStation || !toStation) return 50;

        // Get departure time from last station and arrival at next
        const now = Date.now() / 1000;
        const departureTime = fromStation.actualDepartureTimestamp || fromStation.scheduledDepartureTimestamp;

        // Use scheduled arrival + current delay for a better estimation
        const baseArrival = toStation.scheduledArrivalTimestamp;
        const currentDelay = (trainData?.overallDelay || 0) * 60;
        const expectedArrival = baseArrival + currentDelay;

        if (!departureTime || !expectedArrival) return 50;

        const totalDuration = expectedArrival - departureTime;
        const elapsed = now - departureTime;

        if (totalDuration <= 0) return 95; // Already arriving

        const position = Math.min(Math.max((elapsed / totalDuration) * 100, 5), 95);
        return position;
    };

    const position = calculatePosition();
    const delayMinutes = trainData?.overallDelay || 0;

    return (
        <div style={{
            marginLeft: '60px',
            marginBottom: '20px',
            position: 'relative',
            zIndex: 5
        }}>
            {/* Connection line from previous station */}
            <div style={{
                position: 'absolute',
                left: '-7px',
                top: '-16px',
                width: '3px',
                height: '16px',
                background: 'var(--success)'
            }}></div>

            {/* Main Indicator Card */}
            <div style={{
                background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.9))',
                borderRadius: '16px',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                padding: '16px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                backdropFilter: 'blur(12px)',
                overflow: 'hidden'
            }}>
                {/* Header: Status & Live Pulse */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="live-pulse" style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--success)',
                            boxShadow: '0 0 8px var(--success)'
                        }}></div>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--success)', letterSpacing: '0.5px' }}>LIVE STATUS</span>
                    </div>
                    {delayMinutes > 0 ? (
                        <div style={{
                            fontSize: '11px',
                            padding: '4px 10px',
                            borderRadius: '20px',
                            background: 'rgba(239, 68, 68, 0.15)',
                            color: 'var(--danger)',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            fontWeight: 600
                        }}>
                            DELAYED {delayMinutes}m
                        </div>
                    ) : (
                        <div style={{
                            fontSize: '11px',
                            padding: '4px 10px',
                            borderRadius: '20px',
                            background: 'rgba(34, 197, 94, 0.15)',
                            color: 'var(--success)',
                            border: '1px solid rgba(34, 197, 94, 0.2)',
                            fontWeight: 600
                        }}>
                            ON TIME
                        </div>
                    )}
                </div>

                {/* Body: En Route Info */}
                <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>CURRENTLY BETWEEN</div>
                    <div style={{ fontSize: '15px', fontWeight: 600, color: 'white' }}>
                        {fromStation?.name} <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>&</span> {toStation?.name}
                    </div>
                </div>

                {/* Visual Track */}
                <div style={{ position: 'relative', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', margin: '24px 0 12px 0' }}>
                    {/* Progress Fill */}
                    <div style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        height: '100%',
                        width: `${position}%`,
                        background: 'linear-gradient(to right, var(--success), #3b82f6)',
                        borderRadius: '2px',
                        transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}></div>

                    {/* Animated Train Icon */}
                    <div style={{
                        position: 'absolute',
                        left: `${position}%`,
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        zIndex: 10
                    }}>
                        <div style={{
                            fontSize: '22px',
                            filter: 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.5))',
                            animation: 'trainMove 2.5s ease-in-out infinite'
                        }}>
                            🚂
                        </div>
                    </div>
                </div>

                {/* Footer: ETA & Info */}
                <div style={{
                    marginTop: '20px',
                    padding: '12px',
                    background: 'rgba(59, 130, 246, 0.08)',
                    borderRadius: '12px',
                    border: '1px solid rgba(59, 130, 246, 0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>NEXT STATION ETA</span>
                        <span style={{ fontSize: '14px', fontWeight: 700, color: delayMinutes > 0 ? 'var(--danger)' : '#60a5fa' }}>{toStation?.eta || '---'}</span>
                    </div>
                    {toStation?.scheduledTime && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>SCHEDULED AT</span>
                            <span style={{ fontSize: '11px', color: 'white', fontWeight: 500 }}>{toStation.scheduledTime}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Connection line to next station */}
            <div style={{
                position: 'absolute',
                left: '-7px',
                bottom: '-16px',
                width: '3px',
                height: '16px',
                background: 'rgba(255,255,255,0.1)'
            }}></div>
        </div>
    );
};

// Add CSS animations
const animationsStyle = `
@keyframes trainMove {
    0%, 100% { transform: translate(-50%, -50%) translateX(-2px); }
    50% { transform: translate(-50%, -50%) translateX(2px); }
}
@keyframes pulse {
    0% { transform: scale(0.95); opacity: 0.5; }
    50% { transform: scale(1.05); opacity: 1; }
    100% { transform: scale(0.95); opacity: 0.5; }
}
.live-pulse {
    animation: pulse 2s infinite ease-in-out;
}
`;

// Inject the animation style
if (typeof document !== 'undefined' && !document.getElementById('train-position-animations')) {
    const styleEl = document.createElement('style');
    styleEl.id = 'train-position-animations';
    styleEl.textContent = animationsStyle;
    document.head.appendChild(styleEl);
    document.head.appendChild(styleEl);
}

// Generate dynamic train summary text
const TrainSummary = ({ trainData }) => {
    if (!trainData) return null;

    return (
        <div style={{ padding: '0 20px', marginBottom: '16px' }}>
            <div style={{
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '12px',
                padding: '16px',
                border: '1px solid rgba(255,255,255,0.05)',
                fontSize: '14px',
                lineHeight: '1.6',
                color: 'var(--text-secondary)'
            }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'white', marginBottom: '8px' }}>
                    About {trainData.trainName}
                </h3>
                <p>
                    The <strong>{trainData.trainNo} {trainData.trainName}</strong> is a popular train operated by Indian Railways that connects <strong>{trainData.fromStationName} ({trainData.fromStationCode})</strong> to <strong>{trainData.toStationName} ({trainData.toStationCode})</strong>.
                </p>
                <div style={{ marginTop: '12px' }}>
                    It covers a total route of approximately <strong>{trainData.distance}</strong> with {trainData.stations?.filter(s => s.isHalt)?.length} official halts.
                    The train offers multiple classes including {trainData.classes?.join(', ') || 'SL, 3A, 2A'} for a comfortable journey.
                </div>
            </div>
        </div>
    );
};

const TrainDetails = () => {
    const { trainNo } = useParams();
    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);
    const [trainData, setTrainData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedGroups, setExpandedGroups] = useState({}); // Track which non-halt groups are expanded

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const fetchTrainDetails = async () => {
            setLoading(true);
            setError(null);

            try {
                const data = await getTrainSchedule(trainNo);
                setTrainData(data);
            } catch (err) {
                setError(err.message || 'Failed to fetch train details');
            } finally {
                setLoading(false);
            }
        };

        if (trainNo) {
            fetchTrainDetails();
        }
    }, [trainNo]);

    // Group stations: collect consecutive non-halt stations between halt stations
    const getGroupedStations = () => {
        if (!trainData?.stations) return [];

        const grouped = [];
        let currentNonHaltGroup = [];

        trainData.stations.forEach((station, idx) => {
            if (station.isHalt) {
                // If there are accumulated non-halt stations, add them as a group
                if (currentNonHaltGroup.length > 0) {
                    grouped.push({
                        type: 'non-halt-group',
                        stations: [...currentNonHaltGroup],
                        id: `group-${idx}`
                    });
                    currentNonHaltGroup = [];
                }
                // Add the halt station
                grouped.push({
                    type: 'halt',
                    station,
                    id: `halt-${idx}`
                });
            } else {
                // Accumulate non-halt stations
                currentNonHaltGroup.push(station);
            }
        });

        // Handle trailing non-halt stations (if any)
        if (currentNonHaltGroup.length > 0) {
            grouped.push({
                type: 'non-halt-group',
                stations: currentNonHaltGroup,
                id: 'group-final'
            });
        }

        return grouped;
    };

    const toggleGroup = (groupId) => {
        setExpandedGroups(prev => ({
            ...prev,
            [groupId]: !prev[groupId]
        }));
    };

    if (loading) {
        return (
            <div className="fade-in" style={{ padding: '20px', textAlign: 'center', paddingTop: '100px' }}>
                <div style={{ fontSize: '16px', color: 'var(--text-secondary)' }}>Loading train details...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="fade-in" style={{ padding: '20px', paddingTop: '80px' }}>
                <div style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '12px',
                    padding: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                }}>
                    <AlertCircle size={24} color="var(--danger)" />
                    <div>
                        <div style={{ fontWeight: 600, marginBottom: '4px' }}>Unable to fetch train details</div>
                        <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{error}</div>
                    </div>
                </div>
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        marginTop: '20px',
                        padding: '12px 24px',
                        background: 'var(--accent-color)',
                        border: 'none',
                        borderRadius: '8px',
                        color: 'white',
                        fontWeight: 600,
                        cursor: 'pointer'
                    }}
                >
                    Go Back
                </button>
            </div>
        );
    }

    const groupedStations = getGroupedStations();
    const haltStations = groupedStations.filter(g => g.type === 'halt');

    // Find train's current position (between which stations)
    const getTrainPosition = () => {
        if (!trainData?.stations) return null;

        const haltOnlyStations = trainData.stations.filter(s => s.isHalt);
        let lastPassedStation = null;
        let nextStation = null;

        for (let i = 0; i < haltOnlyStations.length; i++) {
            const station = haltOnlyStations[i];
            if (station.isPassed) {
                lastPassedStation = station;
            } else if (!nextStation) {
                nextStation = station;
                break;
            }
        }

        // Only show train position if we have both a passed station and upcoming station
        if (lastPassedStation && nextStation) {
            return {
                fromStation: lastPassedStation,
                toStation: nextStation
            };
        }
        return null;
    };

    const trainPosition = getTrainPosition();

    // Find the index in groupedStations where to insert train position indicator
    const findTrainPositionInsertIndex = () => {
        if (!trainPosition) return -1;

        for (let i = 0; i < groupedStations.length; i++) {
            const item = groupedStations[i];
            if (item.type === 'halt' && !item.station.isPassed) {
                return i; // Insert before first non-passed halt station
            }
        }
        return -1;
    };

    const trainPositionIndex = findTrainPositionInsertIndex();

    // Generate FAQ data dynamically
    const trainFaqs = trainData ? [
        {
            question: `What are the running days of ${trainData.trainNo} ${trainData.trainName}?`,
            answer: `${trainData.trainName} runs on ${Array.isArray(trainData.runningDays) ? trainData.runningDays.join(', ') : (trainData.runningDays || 'scheduled days')}. Please check the detailed timetable above for exact timings.`
        },
        {
            question: `How many stops does ${trainData.trainNo} have?`,
            answer: `${trainData.trainName} stops at ${trainData.stations?.filter(s => s.isHalt).length || 'several'} stations between ${trainData.fromStationName} and ${trainData.toStationName}.`
        },
        {
            question: `What is the departure time of ${trainData.trainName} from ${trainData.fromStationName}?`,
            answer: `The train departs from ${trainData.fromStationName} at ${trainData.departureTime} and arrives at ${trainData.toStationName} at ${trainData.arrivalTime}. The total journey duration is approximately ${trainData.duration}.`
        }
    ] : [];

    return (
        <div className="fade-in" style={{ paddingBottom: '100px' }}>
            {/* Dynamic SEO Meta Tags */}
            <SEOHead
                title={trainData ? `${trainData.trainNo} ${trainData.trainName} - Schedule & Route | RailYatra` : 'Train Schedule & Route Information | RailYatra'}
                description={trainData ? `${trainData.trainName} (${trainData.trainNo}) route, schedule, status and time table. Check stops, arrival/departure times, and running days at RailYatra.` : 'Check Indian Railways train schedule, route, and running status.'}
                keywords={`train schedule, ${trainData ? `${trainData.trainNo}, ${trainData.trainName},` : ''} train route, time table, indian railway`}
                canonical={`https://railyatra.co.in/train/${trainNo}`}
                jsonLd={getTrainJsonLd(trainData)}
            />

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
                <button
                    onClick={() => (window.history.state && window.history.state.idx > 0) ? navigate(-1) : navigate('/')}
                    style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
                    aria-label="Go Back"
                >
                    <ArrowLeft size={24} />
                </button>

                <h2 style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    opacity: isScrolled ? 1 : 0,
                    transition: 'all 0.3s ease',
                    position: 'absolute',
                    left: '50%',
                    transform: `translateX(-50%) ${isScrolled ? 'translateY(0)' : 'translateY(10px)'}`,
                    whiteSpace: 'nowrap'
                }}>
                    {trainData?.trainNo} - {trainData?.trainName}
                </h2>

                <MoreVertical size={24} />
            </div>

            {/* Hero Section */}
            <div style={{
                padding: '0 20px 8px 20px',
                marginTop: '-10px'
            }}>
                <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '2px' }}>
                    {trainData?.trainNo}
                    {(() => {
                        const cleaned = trainData?.trainName?.replace(/^Train\s+/i, '').replace(new RegExp(`^${trainData?.trainNo}\\s*`), '').replace(/^-\s*/, '').trim();
                        return cleaned ? <span style={{ fontWeight: 400, opacity: 0.8 }}> - {cleaned}</span> : null;
                    })()}
                </h1>
                <div style={{
                    display: 'flex',
                    gap: '12px',
                    marginTop: '8px',
                    fontSize: '12px',
                    color: 'var(--text-secondary)',
                    alignItems: 'center'
                }}>
                    <span>Journey: {trainData?.journeyDate}</span>
                    <span>•</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <div className="live-pulse" style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--success)' }}></div>
                        <span style={{ color: 'var(--success)', fontWeight: 600 }}>Live Updates</span>
                    </div>
                </div>

                {trainData?.lastUpdated && (
                    <div style={{ marginTop: '8px', fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>
                        Last updated: {trainData.lastUpdated}
                    </div>
                )}
            </div>



            {/* Ad Placement - reduced padding, constrained height for mobile */}
            <div style={{ padding: '0 20px 8px 20px', maxHeight: '280px', overflow: 'hidden' }}>
                <GoogleAd slot="train-details-ad" format="horizontal" />
            </div>

            {/* Timeline with Collapsible Groups */}
            <div style={{ padding: '4px 20px 20px 20px' }}>
                {groupedStations.map((item, idx) => {
                    const elements = [];

                    // Insert train position indicator before the first upcoming halt station
                    if (idx === trainPositionIndex && trainPosition) {
                        elements.push(
                            <TrainPositionIndicator
                                key="train-position"
                                fromStation={trainPosition.fromStation}
                                toStation={trainPosition.toStation}
                                trainData={trainData}
                            />
                        );
                    }

                    if (item.type === 'halt') {
                        const haltIndex = haltStations.findIndex(h => h.id === item.id);
                        const isLast = haltIndex === haltStations.length - 1;
                        elements.push(
                            <HaltStationCard
                                key={item.id}
                                stop={item.station}
                                isLast={isLast}
                                trainData={trainData}
                            />
                        );
                    } else {
                        elements.push(
                            <NonHaltStationsGroup
                                key={item.id}
                                stations={item.stations}
                                isExpanded={expandedGroups[item.id] || false}
                                onToggle={() => toggleGroup(item.id)}
                            />
                        );
                    }

                    return elements;
                })}
            </div>

            {/* About Section (Replaces FAQ) */}
            {trainData && (
                <div style={{ padding: '0 20px', marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'white', marginBottom: '12px' }}>
                        About {trainData.trainName}
                    </h3>
                    <div style={{
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '12px',
                        padding: '16px',
                        border: '1px solid rgba(255,255,255,0.05)',
                        fontSize: '14px',
                        lineHeight: '1.6',
                        color: 'var(--text-secondary)'
                    }}>
                        <p style={{ marginBottom: '12px' }}>
                            The <strong>{trainData.trainNo} {trainData.trainName}</strong> is a popular train operated by Indian Railways that connects <strong>{trainData.fromStationName} ({trainData.fromStationCode})</strong> to <strong>{trainData.toStationName} ({trainData.toStationCode})</strong>.
                        </p>
                        <p>
                            It covers a total route of approximately <strong>{trainData.distanceKm?.toFixed(0) || 0} km</strong> with {trainData.stations?.filter(s => s.isHalt)?.length} official halts.
                            The train offers multiple classes including {trainData.classes?.join(', ') || 'SL, 3A, 2A, 1A'} for a comfortable journey.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};


export default TrainDetails;
