import { NextRequest, NextResponse } from 'next/server';

const RAILRADAR_BASE = 'https://api.railradar.in/api/v1';
const API_KEY = process.env.RAILRADAR_API_KEY;

// Helper to convert minutes to HH:MM format
const minutesToTime = (minutes: number | null | undefined): string => {
    if (minutes === null || minutes === undefined) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
};

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ trainNumber: string }> }
) {
    const { trainNumber } = await params;

    // Validate train number
    if (!trainNumber || !/^\d{4,5}$/.test(trainNumber)) {
        return NextResponse.json(
            { error: 'Invalid train number' },
            { status: 400 }
        );
    }

    // Check if API key is configured
    if (!API_KEY) {
        return NextResponse.json(
            { error: 'RailRadar API key not configured', configured: false },
            { status: 503 }
        );
    }

    try {
        const response = await fetch(`${RAILRADAR_BASE}/trains/${trainNumber}`, {
            headers: {
                'X-API-Key': API_KEY,
                'Content-Type': 'application/json',
            },
            next: { revalidate: 60 }, // Cache for 1 minute for live data
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP ${response.status}`);
        }

        const responseData = await response.json();
        const trainData = responseData.data || responseData;
        const trainInfo = trainData.train || trainData;
        const liveData = trainData.liveData || trainInfo.liveData || {};
        const currentLocation = liveData.currentLocation || {};

        // Find next station from live route
        let nextStation = 'N/A';
        let eta = 'N/A';

        if (liveData.route && liveData.route.length > 0) {
            const now = Date.now() / 1000;
            const upcoming = liveData.route.find((station: { actualArrival?: number; scheduledArrival?: number }) => {
                const arrivalTime = station.actualArrival || station.scheduledArrival;
                return arrivalTime ? arrivalTime > now : false;
            });

            if (upcoming) {
                nextStation = upcoming.stationCode || 'N/A';
                const arrivalTimestamp = upcoming.actualArrival || upcoming.scheduledArrival;
                if (arrivalTimestamp) {
                    eta = new Date(arrivalTimestamp * 1000).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit',
                    });
                }
            }
        }

        // Build current position string
        let currentPosition = 'Position unavailable';
        const currentStationCode = currentLocation.stationCode || null;

        if (currentStationCode) {
            const status = currentLocation.status === 'AT_STATION' ? 'At' : 'Near';
            currentPosition = `${status} ${currentStationCode}`;
        } else if (liveData.overallDelayMinutes !== undefined) {
            currentPosition = `Running (${liveData.overallDelayMinutes > 0 ? `${liveData.overallDelayMinutes}m late` : 'On time'})`;
        }

        const result = {
            trainNumber: liveData.trainNumber || trainInfo.trainNumber || trainNumber,
            trainName: trainInfo.trainName || trainInfo.name || trainData.name || `Train ${trainNumber}`,
            distanceKm: trainInfo.distanceKm || 0,
            liveData: {
                currentPosition,
                currentStationCode,
                status: currentLocation.status || 'UNKNOWN',
                delay: liveData.overallDelayMinutes || 0,
                nextStation,
                eta,
                lastUpdated: liveData.lastUpdatedAt || new Date().toISOString(),
                route: (liveData.route || []).map((station: Record<string, unknown>) => ({
                    stationCode: station.stationCode,
                    stationName: station.stationName,
                    scheduledArrival: station.scheduledArrival,
                    actualArrival: station.actualArrival,
                    scheduledDeparture: station.scheduledDeparture,
                    actualDeparture: station.actualDeparture,
                    delayArrivalMinutes: station.delayArrivalMinutes,
                    delayDepartureMinutes: station.delayDepartureMinutes,
                    platform: station.platform || 'TBA',
                })),
            },
            route: (trainData.route || []).map((station: Record<string, unknown>) => ({
                stationCode: station.stationCode,
                stationName: station.stationName,
                arrivalTime: minutesToTime(station.scheduledArrival as number),
                departureTime: minutesToTime(station.scheduledDeparture as number),
                platform: station.platform || 'TBA',
                day: station.day || 1,
                isHalt: station.isHalt === 1 || station.isHalt === true,
                sequence: station.sequence,
                distanceFromSourceKm: station.distanceFromSource || station.distance || 0,
            })),
            runningDays: trainData.runningDays || [],
        };

        return NextResponse.json(result);
    } catch (error) {
        console.error('[Live Train API Error]:', error);
        return NextResponse.json(
            { error: `Unable to fetch live train status: ${(error as Error).message}` },
            { status: 500 }
        );
    }
}
