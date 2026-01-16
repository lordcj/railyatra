import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ pnrNumber: string }> }
) {
    const { pnrNumber } = await params;

    // Validate PNR
    if (!pnrNumber || pnrNumber.length !== 10 || !/^\d{10}$/.test(pnrNumber)) {
        return NextResponse.json(
            { error: 'Invalid PNR number. Must be 10 digits.' },
            { status: 400 }
        );
    }

    try {
        // Use ConfirmTkt API for PNR status
        const response = await fetch(
            `https://www.confirmtkt.com/api/pnr/status/${pnrNumber}`,
            {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Accept': 'application/json',
                },
                next: { revalidate: 60 }, // Cache for 1 minute
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.Error || data.ErrorCode !== 0) {
            return NextResponse.json(
                { error: data.Error || 'PNR not found or invalid' },
                { status: 404 }
            );
        }

        // Format response
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
            passengers: (data.PassengerStatus || []).map((p: Record<string, unknown>, idx: number) => ({
                name: `Passenger ${(p.Number as number) || idx + 1}`,
                status: (p.CurrentStatus as string) || 'N/A',
                bookingStatus: (p.BookingStatus as string) || 'N/A',
                berth: (p.CurrentBerthNo as string) || (p.Berth as string) || 'N/A',
                coach: (p.CurrentCoachId as string) || (p.Coach as string) || 'N/A',
                berthCode: (p.CurrentBerthCode as string) || '',
            })),
        };

        return NextResponse.json(result);
    } catch (error) {
        console.error('[PNR API Error]:', error);
        return NextResponse.json(
            { error: `Unable to fetch PNR status: ${(error as Error).message}` },
            { status: 500 }
        );
    }
}
