// Test RailRadar API response structure
const API_KEY = 'rr_ipfqtxu0x7ld4m162fdfrxi4dyqicu1m';

async function testRailRadarAPI() {
    try {
        console.log('Testing RailRadar API...\n');

        const response = await fetch('https://api.railradar.in/api/v1/trains/12951', {
            headers: {
                'X-API-Key': API_KEY
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Full API Response:');
        console.log(JSON.stringify(data, null, 2));

        console.log('\n\nKey fields:');
        console.log('trainNumber:', data.trainNumber);
        console.log('trainName:', data.trainName);
        console.log('liveData:', data.liveData);
        console.log('route:', data.route ? `${data.route.length} stations` : 'N/A');

    } catch (error) {
        console.error('Error:', error.message);
    }
}

testRailRadarAPI();
