'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Loader2, MapPin, AlertTriangle, RefreshCw, ChevronRight, ChevronDown } from 'lucide-react';
import { Train } from '@/data/trains';

// Format minutes to human-readable duration
const formatDuration = (minutes: number): string => {
    if (minutes < 0) return 'N/A';
    if (minutes === 0) return 'On time';

    const days = Math.floor(minutes / 1440);
    const hours = Math.floor((minutes % 1440) / 60);
    const mins = minutes % 60;

    const parts: string[] = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (mins > 0) parts.push(`${mins}m`);

    return parts.join(' ') || '0m';
};

interface LiveStation {
    stationCode: string;
    stationName?: string;
    scheduledArrival?: number;
    actualArrival?: number;
    scheduledDeparture?: number;
    actualDeparture?: number;
    delayArrivalMinutes?: number;
    delayDepartureMinutes?: number;
    platform?: string;
}

interface RouteStation {
    stationCode: string;
    stationName: string;
    arrivalTime: string;
    departureTime?: string;
    platform: string;
    day: number;
    isHalt: boolean;
    sequence: number;
    distanceFromSourceKm: number;
}

interface LiveData {
    currentPosition: string;
    currentStationCode: string | null;
    status: string;
    delay: number;
    nextStation: string;
    eta: string;
    lastUpdated: string;
    route: LiveStation[];
}

interface TrainData {
    trainNumber: string;
    trainName: string;
    distanceKm: number;
    liveData: LiveData;
    route: RouteStation[];
    runningDays: string[];
    error?: string;
    configured?: boolean;
}

interface LiveTrainClientProps {
    trainNo: string;
    staticTrain: Train | undefined;
}

// Station Card Component - matching original design
function StationCard({
    station,
    liveStation,
    isLast,
    isCurrent,
    isPassed
}: {
    station: RouteStation;
    liveStation?: LiveStation;
    isLast: boolean;
    isCurrent: boolean;
    isPassed: boolean;
}) {
    const delay = liveStation?.delayArrivalMinutes || liveStation?.delayDepartureMinutes || 0;
    const actualTime = liveStation?.actualArrival
        ? new Date(liveStation.actualArrival * 1000).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
        : null;

    return (
        <div style={{ display: 'flex', gap: '8px', marginBottom: '0', position: 'relative' }}>
            {/* Thread Line */}
            {!isLast && (
                <div style={{
                    position: 'absolute',
                    left: '50px',
                    top: '32px',
                    bottom: '-12px',
                    width: '3px',
                    background: isPassed
                        ? 'linear-gradient(to bottom, var(--success), rgba(34, 197, 94, 0.3))'
                        : 'rgba(255,255,255,0.1)',
                }} />
            )}

            {/* Time Column */}
            <div style={{ width: '42px', paddingTop: '4px', textAlign: 'right' }}>
                <div style={{ fontWeight: 600, fontSize: '14px' }}>{station.arrivalTime}</div>
                <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Day {station.day}
                </div>
            </div>

            {/* Icon Column */}
            <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: isCurrent ? 'var(--accent-color)' :
                        isPassed ? 'var(--success)' : 'var(--bg-primary)',
                    border: `3px solid ${isCurrent ? 'var(--accent-color)' :
                        isPassed ? 'var(--success)' : 'rgba(255,255,255,0.3)'}`,
                    marginTop: '4px',
                    boxShadow: isCurrent ? '0 0 12px var(--accent-color)' : 'none',
                }} />
            </div>

            {/* Details Column */}
            <div style={{ flex: 1, paddingBottom: '24px', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    <div style={{
                        fontWeight: 600,
                        fontSize: '15px',
                        color: isCurrent ? 'var(--accent-color)' : 'white',
                    }}>
                        {station.stationName || station.stationCode}
                        {isCurrent && <span style={{ marginLeft: '8px', fontSize: '11px' }}>● CURRENT</span>}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                        {station.stationCode} • Platform {station.platform}
                    </div>
                </div>

                {/* Right Side: Actual Time for passed stations */}
                {isPassed && actualTime && (
                    <div style={{ textAlign: 'right', minWidth: '80px' }}>
                        <div style={{
                            fontSize: '14px',
                            fontWeight: 600,
                            color: delay > 0 ? 'var(--danger)' : 'var(--success)',
                        }}>
                            {actualTime}
                        </div>
                        {delay > 0 && (
                            <div style={{ fontSize: '10px', color: 'var(--danger)', marginTop: '2px' }}>
                                +{formatDuration(delay)} late
                            </div>
                        )}
                        {delay < 0 && (
                            <div style={{ fontSize: '10px', color: 'var(--success)', marginTop: '2px' }}>
                                {formatDuration(Math.abs(delay))} early
                            </div>
                        )}
                        {delay === 0 && (
                            <div style={{ fontSize: '10px', color: 'var(--success)', marginTop: '2px' }}>
                                On time
                            </div>
                        )}
                    </div>
                )}

                {/* Right Side: ETA for upcoming stations */}
                {!isPassed && (
                    <div style={{ textAlign: 'right', minWidth: '80px' }}>
                        <div style={{
                            fontSize: '14px',
                            fontWeight: 500,
                            color: 'var(--text-secondary)',
                        }}>
                            {station.arrivalTime}
                        </div>
                        {delay > 0 && (
                            <span style={{
                                fontSize: '9px',
                                padding: '2px 6px',
                                borderRadius: '8px',
                                background: 'rgba(239, 68, 68, 0.2)',
                                color: 'var(--danger)',
                                marginTop: '4px',
                                display: 'inline-block',
                            }}>
                                +{formatDuration(delay)}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export function LiveTrainClient({ trainNo, staticTrain }: LiveTrainClientProps) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<TrainData | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [expandedRoute, setExpandedRoute] = useState(true);

    const fetchLiveData = async (isRefresh = false) => {
        try {
            if (isRefresh) setRefreshing(true);
            else setLoading(true);
            setError(null);

            const response = await fetch(`/api/train/${trainNo}`);
            const result = await response.json();

            if (!response.ok) {
                if (result.configured === false) {
                    throw new Error('Live tracking API not configured. Contact admin.');
                }
                throw new Error(result.error || 'Failed to fetch live status');
            }

            setData(result);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchLiveData();
        const interval = setInterval(() => fetchLiveData(true), 120000);
        return () => clearInterval(interval);
    }, [trainNo]);

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <Loader2 size={40} className="live-pulse" color="var(--accent-color)" style={{ margin: '0 auto 16px' }} />
                <p style={{ color: 'var(--text-secondary)' }}>Fetching live status...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
                <AlertTriangle size={40} color="rgb(251, 146, 60)" style={{ margin: '0 auto 16px' }} />
                <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>Unable to fetch live status</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '16px' }}>{error}</p>

                {staticTrain && (
                    <div style={{ textAlign: 'left', marginTop: '24px' }}>
                        <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>Static Schedule</h4>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <div>
                                <div style={{ fontSize: '18px', fontWeight: 700 }}>{staticTrain.departureTime}</div>
                                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{staticTrain.source}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '18px', fontWeight: 700 }}>{staticTrain.arrivalTime}</div>
                                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{staticTrain.destination}</div>
                            </div>
                        </div>
                    </div>
                )}

                <button onClick={() => fetchLiveData()} className="btn-primary" style={{ marginTop: '16px' }}>
                    <RefreshCw size={16} /> Try Again
                </button>
            </div>
        );
    }

    if (!data) return null;

    const delay = data.liveData.delay;
    const haltStations = data.route.filter(s => s.isHalt);

    return (
        <>
            {/* Live Position Card - Premium Design */}
            <section style={{
                background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.9))',
                borderRadius: '16px',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                padding: '20px',
                marginBottom: '20px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                backdropFilter: 'blur(12px)',
            }}>
                {/* Header with live pulse */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="live-pulse" style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--success)',
                            boxShadow: '0 0 8px var(--success)',
                        }} />
                        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--success)', letterSpacing: '0.5px' }}>
                            LIVE STATUS
                        </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            fontSize: '11px',
                            padding: '4px 10px',
                            borderRadius: '20px',
                            background: delay > 0 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)',
                            color: delay > 0 ? 'var(--danger)' : 'var(--success)',
                            border: `1px solid ${delay > 0 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)'}`,
                            fontWeight: 600,
                        }}>
                            {delay > 0 ? `DELAYED ${formatDuration(delay)}` : 'ON TIME'}
                        </div>

                        <button
                            onClick={() => fetchLiveData(true)}
                            disabled={refreshing}
                            style={{
                                background: 'rgba(255,255,255,0.1)',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '8px',
                                cursor: 'pointer',
                            }}
                        >
                            <RefreshCw size={16} color="var(--text-secondary)" className={refreshing ? 'live-pulse' : ''} />
                        </button>
                    </div>
                </div>

                {/* Current Position */}
                <div style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                        CURRENT POSITION
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <MapPin size={20} color="var(--accent-color)" />
                        {data.liveData.currentPosition}
                    </div>
                </div>

                {/* Animated Train Track */}
                <div style={{ position: 'relative', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', margin: '24px 0' }}>
                    <div style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        height: '100%',
                        width: '60%',
                        background: 'linear-gradient(to right, var(--success), #3b82f6)',
                        borderRadius: '2px',
                        transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    }} />

                    <div style={{
                        position: 'absolute',
                        left: '60%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 10,
                    }}>
                        <div style={{
                            fontSize: '24px',
                            filter: 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.5))',
                            animation: 'trainMove 2.5s ease-in-out infinite',
                        }}>
                            🚂
                        </div>
                    </div>
                </div>

                {/* Next Station ETA */}
                <div style={{
                    padding: '12px',
                    background: 'rgba(59, 130, 246, 0.08)',
                    borderRadius: '12px',
                    border: '1px solid rgba(59, 130, 246, 0.1)',
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>NEXT STATION</span>
                        <span style={{ fontSize: '14px', fontWeight: 700, color: '#60a5fa' }}>
                            {data.liveData.nextStation}
                        </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>ETA</span>
                        <span style={{
                            fontSize: '16px',
                            fontWeight: 700,
                            color: delay > 0 ? 'var(--danger)' : '#60a5fa'
                        }}>
                            {data.liveData.eta}
                        </span>
                    </div>
                </div>

                <div style={{ marginTop: '12px', fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>
                    Last updated: {new Date(data.liveData.lastUpdated).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                    })}
                </div>
            </section>

            {/* Route Timeline - Matching Original Design */}
            <section style={{ marginBottom: '24px' }}>
                <button
                    onClick={() => setExpandedRoute(!expandedRoute)}
                    style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: 'none',
                        border: 'none',
                        color: 'white',
                        cursor: 'pointer',
                        padding: '12px 0',
                        marginBottom: expandedRoute ? '16px' : '0',
                    }}
                >
                    <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>Route Timeline</h2>
                    {expandedRoute ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                </button>

                {expandedRoute && (
                    <div style={{ paddingLeft: '0' }}>
                        {haltStations.map((station, index) => {
                            const liveStation = data.liveData.route.find(ls => ls.stationCode === station.stationCode);

                            // Find sequence of the current station to determine relative position
                            const currentStationCode = data.liveData.currentStationCode;
                            const currentStation = data.route.find(s => s.stationCode === currentStationCode);
                            const currentSequence = currentStation?.sequence || 0;

                            const isPassed = station.sequence < currentSequence;
                            const isCurrent = station.stationCode === currentStationCode;

                            return (
                                <StationCard
                                    key={station.stationCode}
                                    station={station}
                                    liveStation={liveStation}
                                    isLast={index === haltStations.length - 1}
                                    isCurrent={isCurrent}
                                    isPassed={isPassed}
                                />
                            );
                        })}
                    </div>
                )}
            </section>

            {/* Link to train details */}
            <Link
                href={`/train/${trainNo}`}
                className="btn-primary"
                style={{ display: 'flex', justifyContent: 'center', textDecoration: 'none' }}
            >
                View Train Details
            </Link>
        </>
    );
}
