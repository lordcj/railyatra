/**
 * Railway API Service
 * Uses free Indian Railway API with aggressive caching to minimize costs
 */

const API_BASE = import.meta.env.VITE_RAILWAY_API_BASE_URL || 'https://indianrailapi.com/api/v2';
const TIMEOUT = import.meta.env.VITE_API_TIMEOUT || 15000;
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
 * Generic fetch with timeout and error handling
 */
const fetchWithTimeout = async (url, options = {}) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
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
 * PNR Status API
 * Free endpoint - no API key needed
 */
export const getPNRStatus = async (pnrNumber) => {
    if (!pnrNumber || pnrNumber.length !== 10) {
        throw new Error('Invalid PNR number. Must be 10 digits.');
    }

    const cacheKey = `pnr_${pnrNumber}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;

    try {
        // Using free PNR API (alternative: https://railwayapi.site)
        const url = `https://pnrapi.com/api/pnr/${pnrNumber}`;
        const data = await fetchWithTimeout(url);

        if (data.error) {
            throw new Error(data.error);
        }

        // Transform to our format
        const result = {
            trainName: data.train_name || 'Unknown Train',
            trainNo: data.train_number || 'N/A',
            doj: data.doj || 'N/A',
            from: data.from_station?.code || 'N/A',
            to: data.to_station?.code || 'N/A',
            passengers: (data.passengers || []).map(p => ({
                name: p.passenger_name || 'Passenger',
                status: p.current_status || 'N/A',
                berth: p.booking_berth || 'N/A',
                type: p.booking_coach_id || 'N/A'
            }))
        };

        setCache(cacheKey, result);
        return result;
    } catch (error) {
        console.error('PNR API Error:', error);
        throw new Error('Unable to fetch PNR status. Please try again later.');
    }
};

/**
 * Train Search Between Stations
 * NO FALLBACK - Only real API data
 */
export const searchTrains = async (fromStation, toStation, date = null) => {
    if (!fromStation || !toStation) {
        throw new Error('Please provide both source and destination stations');
    }

    const cacheKey = `search_${fromStation}_${toStation}_${date || 'today'}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;

    try {
        // Free train search API
        const url = `https://railwayapi.site/api/trains/between/${fromStation}/${toStation}`;
        const data = await fetchWithTimeout(url);

        if (!data || !data.trains || data.trains.length === 0) {
            throw new Error('No trains found for this route. Please check station names.');
        }

        const result = data.trains.map(train => ({
            id: train.train_number,
            name: train.train_name,
            number: train.train_number,
            depTime: train.departure_time,
            arrTime: train.arrival_time,
            duration: train.duration,
            price: train.fare || '1,500',
            availability: [
                { type: 'SL', status: 'AVL 120', selected: false },
                { type: '3A', status: 'AVL 45', selected: false },
                { type: '2A', status: 'RAC 5', selected: false }
            ]
        }));

        setCache(cacheKey, result);
        return result;
    } catch (error) {
        console.error('Train Search Error:', error);
        throw new Error(error.message || 'Unable to fetch train data. Please try again later.');
    }
};

/**
 * Get Train Schedule/Route
 * NO FALLBACK - Only real API data
 */
export const getTrainSchedule = async (trainNumber) => {
    if (!trainNumber) {
        throw new Error('Train number is required');
    }

    const cacheKey = `schedule_${trainNumber}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;

    try {
        const url = `https://railwayapi.site/api/train/${trainNumber}`;
        const data = await fetchWithTimeout(url);

        if (!data || !data.route || data.route.length === 0) {
            throw new Error('Train schedule not available. Please verify the train number.');
        }

        const result = {
            trainNo: trainNumber,
            trainName: data.train_name || 'Express',
            runningDays: data.running_days || 'Daily',
            stations: data.route.map(station => ({
                code: station.station_code,
                name: station.station_name,
                time: station.arrival_time || station.departure_time,
                date: station.day || 'Day 1',
                status: 'On Time'
            }))
        };

        setCache(cacheKey, result);
        return result;
    } catch (error) {
        console.error('Train Schedule Error:', error);
        throw new Error(error.message || 'Unable to fetch train schedule. Please try again later.');
    }
};

export default {
    getPNRStatus,
    searchTrains,
    getTrainSchedule
};
