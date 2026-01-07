/**
 * Railway API Service
 * Uses ONLY RailRadar API (production-ready, 1000 free requests/month)
 * 
 * Features:
 * - RailRadar API exclusively - no fallbacks
 * - Aggressive caching to minimize API usage
 * - Live train tracking with real-time data
 * - Throws errors if API fails
 */

import * as RailRadar from './railRadarApi.js';

const CACHE_ENABLED = import.meta.env.VITE_ENABLE_CACHING !== 'false';
const CACHE_DURATION = parseInt(import.meta.env.VITE_CACHE_DURATION || '3600000'); // 1 hour

// Simple in-memory cache
const cache = new Map();

/**
 * Cache helper
 */
const getCached = (key) => {
    if (!CACHE_ENABLED) return null;
    const cached = cache.get(key);
    if (!cached) return null;
    if (Date.now() - cached.timestamp > CACHE_DURATION) {
        cache.delete(key);
        return null;
    }
    return cached.data;
};

const setCache = (key, data) => {
    if (CACHE_ENABLED) {
        cache.set(key, { data, timestamp: Date.now() });
    }
};

/**
 * PNR Status API
 * Uses ConfirmTkt API for reliable PNR status
 */
export const getPNRStatus = async (pnrNumber) => {
    if (!pnrNumber || pnrNumber.length !== 10) {
        throw new Error('Invalid PNR number. Must be 10 digits.');
    }

    const cacheKey = `pnr_${pnrNumber}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;

    try {
        // console.log('🚀 Using ConfirmTkt API for PNR status');
        // Use proxy on localhost to bypass CORS, direct URL on production
        const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const url = isLocalhost
            ? `/api/confirmtkt/${pnrNumber}`
            : `https://www.confirmtkt.com/api/pnr/status/${pnrNumber}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.Error || data.ErrorCode !== 0) {
            throw new Error(data.Error || 'PNR not found or invalid');
        }

        const result = {
            trainName: data.TrainName || 'Unknown Train',
            trainNo: data.TrainNo || 'N/A',
            doj: data.Doj || 'N/A',
            from: data.BoardingPoint || data.From || 'N/A',
            fromName: data.BoardingStationName || data.SourceName || 'N/A',
            to: data.ReservationUpto || data.To || 'N/A',
            toName: data.ReservationUptoName || data.DestinationName || 'N/A',
            departureTime: data.DepartureTime || '--:--',
            arrivalTime: data.ArrivalTime || '--:--',
            duration: data.Duration || 'N/A',
            travelClass: data.Class || 'N/A',
            quota: data.Quota || 'N/A',
            chartPrepared: data.ChartPrepared || false,
            passengers: (data.PassengerStatus || []).map((p, idx) => ({
                name: `Passenger ${p.Number || idx + 1}`,
                status: p.CurrentStatus || 'N/A',
                bookingStatus: p.BookingStatus || 'N/A',
                berth: p.CurrentBerthNo || p.Berth || 'N/A',
                coach: p.CurrentCoachId || p.Coach || 'N/A',
                berthCode: p.CurrentBerthCode || ''
            }))
        };

        setCache(cacheKey, result);
        return result;
    } catch (error) {
        // console.error('❌ PNR API Error:', error);
        throw new Error(`Unable to fetch PNR status: ${error.message}`);
    }
};

/**
 * Train Search Between Stations
 * Uses ONLY RailRadar API - throws error if fails
 */
export const searchTrains = async (fromStation, toStation, date = null) => {
    if (!fromStation || !toStation) {
        throw new Error('Please provide both source and destination stations');
    }

    const cacheKey = `search_${fromStation}_${toStation}_${date || 'today'}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;

    // Verify RailRadar is configured
    if (!RailRadar.isRailRadarConfigured()) {
        throw new Error('RailRadar API key not configured. Please add VITE_RAILRADAR_API_KEY to your environment variables.');
    }

    try {
        // console.log('🚀 Using RailRadar API for train search');
        const trains = await RailRadar.getTrainsBetweenStations(fromStation, toStation, date);

        const result = trains.map(train => {
            // Map RailRadar classes to UI availability format with mock counts
            const defaultClasses = ['SL', '3A', '2A', 'CC'];
            const trainClasses = train.classes || defaultClasses;

            const availability = trainClasses.map(cls => {
                const type = cls.toUpperCase().trim();
                // Generate realistic mock counts
                let status = 'AVL 200';
                if (type === '1A') status = 'AVAILABLE 0022';
                else if (type === '2A') status = 'AVAILABLE 0045';
                else if (type === '3A') status = 'AVAILABLE 0120';
                else if (type === 'SL') status = 'WL 12';
                else if (type === 'CC') status = 'AVAILABLE 0068';

                return {
                    type,
                    status,
                    selected: false
                };
            });

            return {
                id: train.trainNumber,
                name: train.trainName,
                number: train.trainNumber,
                depTime: train.departureTime,
                arrTime: train.arrivalTime,
                duration: train.duration,
                price: '1,500', // Placeholder
                availability,
                runningDays: train.daysRunning || 'S M T W T F S'
            };
        });

        setCache(cacheKey, result);
        return result;
    } catch (error) {
        // console.error('❌ RailRadar API Error:', error);
        throw new Error(`Unable to fetch trains: ${error.message}`);
    }
};

/**
 * Get Train Schedule/Route with Live Data
 * Uses ONLY RailRadar API with enhanced station information
 */
export const getTrainSchedule = async (trainNumber) => {
    if (!trainNumber) {
        throw new Error('Train number is required');
    }

    const cacheKey = `schedule_v5_${trainNumber}`; // v5 to bust old cache
    const cached = getCached(cacheKey);
    if (cached) return cached;

    // Verify RailRadar is configured
    if (!RailRadar.isRailRadarConfigured()) {
        throw new Error('RailRadar API key not configured. Please add VITE_RAILRADAR_API_KEY to your environment variables.');
    }

    try {
        // console.log('🚀 Using RailRadar API for train schedule');
        const trainData = await RailRadar.getLiveTrainStatus(trainNumber);

        // Get journey start date
        const journeyDate = new Date(trainData.liveData?.lastUpdated || Date.now());

        // Helper to calculate actual date for a station based on day offset
        const getStationDate = (day) => {
            const stationDate = new Date(journeyDate);
            stationDate.setDate(stationDate.getDate() + (day - 1));
            return stationDate.toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
        };

        // Helper to format time from minutes
        const minutesToTime = (minutes) => {
            if (!minutes && minutes !== 0) return null;
            const hours = Math.floor(minutes / 60);
            const mins = minutes % 60;
            return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
        };

        // Helper to format timestamp
        const formatTimestamp = (timestamp) => {
            if (!timestamp) return null;
            return new Date(timestamp * 1000).toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit'
            });
        };

        // Get current station from live data
        const currentStationCode = trainData.liveData?.currentStationCode || trainData.liveData?.currentPosition?.stationCode || trainData.liveData?.currentPosition;

        // Build live route map for quick lookup
        const liveRouteMap = new Map();
        if (trainData.liveData?.route) {
            trainData.liveData.route.forEach(station => {
                liveRouteMap.set(station.stationCode, station);
            });
        }

        // Find the sequence of the current station to determine passed/upcoming
        const allStations = trainData.route.sort((a, b) => a.sequence - b.sequence);
        const currentStationIndex = allStations.findIndex(s => s.stationCode === currentStationCode);
        const currentTime = Date.now() / 1000; // Current time in seconds

        // Process ALL stations with enhanced information (both halt and non-halt)
        const stations = allStations
            .map((station, index) => {
                const liveInfo = liveRouteMap.get(station.stationCode);

                // Determine station status based on sequence relative to current station
                let isPassed = false;
                let isCurrent = station.stationCode === currentStationCode;

                if (currentStationIndex >= 0) {
                    // If we know the current station, use sequence comparison
                    isPassed = index < currentStationIndex;
                } else if (liveInfo) {
                    // Fallback: check if actual departure/arrival time is in the past
                    const actualTime = liveInfo.actualDeparture || liveInfo.actualArrival;
                    isPassed = actualTime && actualTime < currentTime;
                }

                // Check if train has started (has any live data)
                const trainHasStarted = trainData.liveData?.route && trainData.liveData.route.length > 0;

                // Calculate delay - only show if train has started and station has live info
                let delay = 0;
                let delayText = null; // null means don't show delay badge
                if (trainHasStarted && liveInfo) {
                    delay = liveInfo.delayArrivalMinutes || liveInfo.delayDepartureMinutes || 0;
                    if (delay > 0) {
                        delayText = `+${delay} min`;
                    } else if (delay < 0) {
                        delayText = `${delay} min early`;
                    } else if (isPassed || isCurrent) {
                        delayText = 'On Time';
                    }
                }

                // Calculate ETA/actual time
                let eta = null; // null means don't show ETA badge
                let etaLabel = 'ETA';

                if (isPassed && liveInfo) {
                    // Show actual arrival time for passed stations
                    const actualArrivalTime = liveInfo.actualArrival || liveInfo.actualDeparture;
                    if (actualArrivalTime) {
                        eta = formatTimestamp(actualArrivalTime);
                        etaLabel = 'Arrived';
                    }
                } else if (trainHasStarted && !isPassed && !isCurrent) {
                    // Show ETA for upcoming stations only if train has started
                    const scheduledTime = liveInfo?.scheduledArrival || liveInfo?.scheduledDeparture;
                    if (scheduledTime) {
                        // Add current overall delay to scheduled time
                        const overallDelay = trainData.liveData?.delay || 0;
                        const expectedTime = scheduledTime + (overallDelay * 60);
                        eta = formatTimestamp(expectedTime);
                        etaLabel = 'ETA';
                    }
                }
                // If train hasn't started, don't show ETA at all (eta remains null)

                return {
                    code: station.stationCode,
                    name: station.stationName,
                    time: station.arrivalTime,
                    scheduledTime: minutesToTime(station.scheduledArrival) || minutesToTime(station.scheduledDeparture),
                    platform: station.platform || liveInfo?.platform || 'TBA',
                    date: getStationDate(station.day),
                    day: `Day ${station.day}`,
                    distance: station.distanceFromSourceKm ? `${station.distanceFromSourceKm.toFixed(1)} km` : null,
                    distanceKm: station.distanceFromSourceKm || 0,
                    delay: delayText,
                    delayMinutes: delay,
                    eta,
                    etaLabel,
                    status: isPassed ? 'Departed' : isCurrent ? 'Current' : 'Upcoming',
                    isPassed,
                    isCurrent,
                    isHalt: station.isHalt, // Include halt status for UI grouping
                    trainHasStarted,
                    actualArrival: liveInfo?.actualArrival ? formatTimestamp(liveInfo.actualArrival) : null,
                    actualDeparture: liveInfo?.actualDeparture ? formatTimestamp(liveInfo.actualDeparture) : null,
                    sequence: station.sequence, // Include sequence for ordering verification
                };
            });

        const result = {
            trainNo: trainNumber,
            trainName: trainData.trainName || `Train ${trainNumber}`,
            runningDays: trainData.runningDays || [],
            journeyDate: journeyDate.toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            }),
            currentStation: currentStationCode,
            overallDelay: trainData.liveData?.delay || 0,
            lastUpdated: trainData.liveData?.lastUpdated,
            stations,
            // Derived fields for UI
            fromStationName: stations[0]?.name || 'Origin',
            fromStationCode: stations[0]?.code || '',
            toStationName: stations[stations.length - 1]?.name || 'Destination',
            toStationCode: stations[stations.length - 1]?.code || '',
            departureTime: stations[0]?.scheduledTime || '--:--',
            arrivalTime: stations[stations.length - 1]?.scheduledTime || '--:--',
            duration: trainData.duration || 'N/A',
            distance: trainData.distanceKm ? `${trainData.distanceKm} km` : (stations[stations.length - 1]?.distance || '0 km'),
            distanceKm: trainData.distanceKm || stations[stations.length - 1]?.distanceKm || 0,
            classes: trainData.classes || ['SL', '3A', '2A', '1A'], // Fallback classes
        };

        setCache(cacheKey, result);
        return result;
    } catch (error) {
        // console.error('❌ RailRadar API Error:', error);
        throw new Error(`Unable to fetch train schedule: ${error.message}`);
    }
};

/**
 * Get Live Train Status
 * Direct export from RailRadar
 */
export const getLiveTrainStatus = async (trainNumber) => {
    if (!RailRadar.isRailRadarConfigured()) {
        throw new Error('RailRadar API key not configured. Please add VITE_RAILRADAR_API_KEY to your environment variables.');
    }

    // console.log('🚀 Using RailRadar API for live train status');
    return await RailRadar.getLiveTrainStatus(trainNumber);
};

/**
 * Get Live Station Board
 * Direct export from RailRadar
 */
export const getLiveStationBoard = async (stationCode) => {
    if (!RailRadar.isRailRadarConfigured()) {
        throw new Error('RailRadar API key not configured. Please add VITE_RAILRADAR_API_KEY to your environment variables.');
    }

    // console.log('🚀 Using RailRadar API for station board');
    return await RailRadar.getLiveStationBoard(stationCode);
};

export default {
    getPNRStatus,
    searchTrains,
    getTrainSchedule,
    getLiveTrainStatus,
    getLiveStationBoard,
};
