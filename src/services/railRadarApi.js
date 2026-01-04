/**
 * RailRadar API Service
 * Official RailRadar.in API integration with production-ready endpoints
 * API Docs: https://railradar.in/api/v1/openapi
 */

const RAILRADAR_BASE = 'https://api.railradar.in/api/v1';
const API_KEY = import.meta.env.VITE_RAILRADAR_API_KEY;
const TIMEOUT = 15000;

/**
 * Generic fetch with RailRadar authentication
 */
const railRadarFetch = async (endpoint, options = {}) => {
    if (!API_KEY) {
        throw new Error('RailRadar API key not configured');
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

    try {
        const response = await fetch(`${RAILRADAR_BASE}${endpoint}`, {
            ...options,
            headers: {
                'X-API-Key': API_KEY,
                'Content-Type': 'application/json',
                ...options.headers,
            },
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            throw new Error('Request timeout - please try again');
        }
        throw error;
    }
};

/**
 * Helper to convert minutes to HH:MM format
 */
const minutesToTime = (minutes) => {
    if (!minutes && minutes !== 0) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
};

/**
 * Helper to calculate duration in hours and minutes
 */
const calculateDuration = (travelTimeMinutes) => {
    if (!travelTimeMinutes) return 'N/A';
    const hours = Math.floor(travelTimeMinutes / 60);
    const mins = travelTimeMinutes % 60;
    return `${hours}h ${mins}m`;
};

/**
 * Get live train status with real-time position and delays
 * Endpoint: GET /api/v1/trains/{trainNumber}
 * Response time: 80-150ms
 */
export const getLiveTrainStatus = async (trainNumber) => {
    if (!trainNumber) {
        throw new Error('Train number is required');
    }

    try {
        const response = await railRadarFetch(`/trains/${trainNumber}`);

        // RailRadar returns data nested under 'data' key
        const trainData = response.data || response;
        const trainInfo = trainData.train || trainData;
        const liveData = trainData.liveData || trainInfo.liveData || {};
        const currentLocation = liveData.currentLocation || {};

        // Find current/next station from live route
        let nextStation = 'N/A';
        let eta = 'N/A';

        if (liveData.route && liveData.route.length > 0) {
            const now = Date.now() / 1000; // Convert to seconds
            const upcoming = liveData.route.find(station => {
                const arrivalTime = station.actualArrival || station.scheduledArrival;
                return arrivalTime > now;
            });

            if (upcoming) {
                nextStation = upcoming.stationCode || 'N/A';
                const arrivalTimestamp = upcoming.actualArrival || upcoming.scheduledArrival;
                if (arrivalTimestamp) {
                    eta = new Date(arrivalTimestamp * 1000).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                }
            }
        }

        // Build current position string
        let currentPosition = 'Position unavailable';
        let currentStationCode = currentLocation.stationCode || null;

        if (currentStationCode) {
            const status = currentLocation.status === 'AT_STATION' ? 'At' : 'Near';
            currentPosition = `${status} ${currentStationCode}`;
        } else if (liveData.overallDelayMinutes !== undefined) {
            currentPosition = `Running (${liveData.overallDelayMinutes > 0 ? `${liveData.overallDelayMinutes}m late` : 'On time'})`;
        }

        return {
            trainNumber: liveData.trainNumber || trainInfo.trainNumber || trainNumber,
            trainName: trainInfo.trainName || trainInfo.name || trainData.name || `Train ${trainNumber}`,
            liveData: {
                currentPosition,
                currentStationCode,
                status: currentLocation.status,
                delay: liveData.overallDelayMinutes || 0,
                nextStation,
                eta,
                lastUpdated: liveData.lastUpdatedAt || new Date().toISOString(),
                route: liveData.route || [], // Pass through the live route for station-wise details
            },
            route: (trainData.route || []).map(station => ({
                stationCode: station.stationCode,
                stationName: station.stationName,
                arrivalTime: minutesToTime(station.scheduledArrival),
                platform: station.platform || 'TBA',
                day: station.day || 1,
                isHalt: station.isHalt === 1 || station.isHalt === true,
                sequence: station.sequence,
            })),
            runningDays: trainData.runningDays || [],
        };
    } catch (error) {
        console.error('RailRadar Live Status Error:', error);
        throw new Error(`Unable to fetch live train status: ${error.message}`);
    }
};

/**
 * Find trains between two stations
 * Endpoint: GET /api/v1/trains/between
 * Response time: 50-100ms
 */
export const getTrainsBetweenStations = async (fromStation, toStation, date = null) => {
    if (!fromStation || !toStation) {
        throw new Error('Both source and destination stations are required');
    }

    try {
        const params = new URLSearchParams({
            from: fromStation.toUpperCase(),
            to: toStation.toUpperCase(),
        });

        if (date) {
            params.append('date', date);
        }

        const response = await railRadarFetch(`/trains/between?${params}`);

        // Extract data from nested structure
        const data = response.data || response;
        const trains = data.trains || data || [];

        if (!trains || trains.length === 0) {
            throw new Error('No trains found for this route');
        }

        return trains.map(train => ({
            trainNumber: train.trainNumber,
            trainName: train.trainName,
            departureTime: minutesToTime(train.fromStationSchedule?.departureMinutes),
            arrivalTime: minutesToTime(train.toStationSchedule?.arrivalMinutes),
            duration: calculateDuration(train.travelTimeMinutes),
            runningDays: train.runningDays?.days || [],
            classes: train.classes || [],
        }));
    } catch (error) {
        console.error('RailRadar Trains Between Stations Error:', error);
        throw new Error(`Unable to fetch trains: ${error.message}`);
    }
};

/**
 * Fast autocomplete search for trains
 * Endpoint: GET /api/v1/search/trains
 * Response time: 3-20ms
 */
export const searchTrains = async (query) => {
    if (!query || query.length < 2) {
        return [];
    }

    try {
        const params = new URLSearchParams({ q: query });
        const data = await railRadarFetch(`/search/trains?${params}`);

        return (data.results || []).map(train => ({
            trainNumber: train.trainNumber,
            trainName: train.trainName,
            from: train.from,
            to: train.to,
        }));
    } catch (error) {
        console.error('RailRadar Train Search Error:', error);
        return [];
    }
};

/**
 * Get live station board with real-time arrivals and departures
 * Endpoint: GET /api/v1/stations/{code}/live
 * Response time: 100-200ms
 */
export const getLiveStationBoard = async (stationCode) => {
    if (!stationCode) {
        throw new Error('Station code is required');
    }

    try {
        const data = await railRadarFetch(`/stations/${stationCode.toUpperCase()}/live`);

        return {
            stationCode: data.stationCode || stationCode,
            stationName: data.stationName || 'Unknown Station',
            arrivals: (data.arrivals || []).map(arr => ({
                trainNumber: arr.trainNumber,
                trainName: arr.trainName,
                scheduledTime: arr.scheduledTime,
                expectedTime: arr.expectedTime,
                delay: arr.delay || 0,
                platform: arr.platform || 'TBA',
            })),
            departures: (data.departures || []).map(dep => ({
                trainNumber: dep.trainNumber,
                trainName: dep.trainName,
                scheduledTime: dep.scheduledTime,
                expectedTime: dep.expectedTime,
                delay: dep.delay || 0,
                platform: dep.platform || 'TBA',
            })),
            lastUpdated: data.lastUpdated || new Date().toISOString(),
        };
    } catch (error) {
        console.error('RailRadar Station Board Error:', error);
        throw new Error(`Unable to fetch station board: ${error.message}`);
    }
};

/**
 * Check if RailRadar API is configured
 */
export const isRailRadarConfigured = () => {
    return !!API_KEY;
};

export default {
    getLiveTrainStatus,
    getTrainsBetweenStations,
    searchTrains,
    getLiveStationBoard,
    isRailRadarConfigured,
};
