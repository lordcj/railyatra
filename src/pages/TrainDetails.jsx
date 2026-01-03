import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, MoreVertical, Clock, AlertCircle, ChevronDown, ChevronRight } from 'lucide-react';
import GoogleAd from '../components/GoogleAd';
import { getTrainSchedule } from '../services/railwayApi';

// Component for displaying a collapsible group of non-halt stations
const NonHaltStationsGroup = ({ stations, isExpanded, onToggle }) => {
    if (stations.length === 0) return null;

    return (
        <div style={{ marginLeft: '66px', marginBottom: '16px' }}>
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
    <div style={{ display: 'flex', gap: '16px', marginBottom: '0', position: 'relative' }}>
        {/* Thread Line */}
        {!isLast && (
            <div style={{
                position: 'absolute',
                left: '59px',
                top: '32px',
                bottom: '-12px',
                width: '3px',
                background: stop.isPassed ? 'linear-gradient(to bottom, var(--success), rgba(34, 197, 94, 0.3))' : 'rgba(255,255,255,0.1)'
            }}></div>
        )}

        {/* Time Column */}
        <div style={{ width: '50px', paddingTop: '4px', textAlign: 'right' }}>
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
                <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
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
                <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '2px' }}>{trainData?.trainNo}</h1>
                <p style={{ color: 'var(--accent-color)', fontWeight: 500, marginBottom: '0' }}>{trainData?.trainName}</p>
                <div style={{
                    display: 'flex',
                    gap: '12px',
                    marginTop: '8px',
                    fontSize: '12px',
                    color: 'var(--text-secondary)'
                }}>
                    <span>Journey: {trainData?.journeyDate}</span>
                    {trainData?.overallDelay > 0 && (
                        <>
                            <span>•</span>
                            <span style={{ color: 'var(--danger)' }}>Delayed {trainData.overallDelay} min</span>
                        </>
                    )}
                </div>
            </div>

            {/* Ad Placement - reduced padding */}
            <div style={{ padding: '0 20px 8px 20px' }}>
                <GoogleAd slot="train-details-ad" format="horizontal" />
            </div>

            {/* Timeline with Collapsible Groups */}
            <div style={{ padding: '4px 20px 20px 20px' }}>
                {groupedStations.map((item, idx) => {
                    if (item.type === 'halt') {
                        const haltIndex = haltStations.findIndex(h => h.id === item.id);
                        const isLast = haltIndex === haltStations.length - 1;
                        return (
                            <HaltStationCard
                                key={item.id}
                                stop={item.station}
                                isLast={isLast}
                                trainData={trainData}
                            />
                        );
                    } else {
                        return (
                            <NonHaltStationsGroup
                                key={item.id}
                                stations={item.stations}
                                isExpanded={expandedGroups[item.id] || false}
                                onToggle={() => toggleGroup(item.id)}
                            />
                        );
                    }
                })}
            </div>
        </div>
    );
};

export default TrainDetails;
