import fetch from 'node-fetch';

const API_BASE = 'https://indianrailapi.com/api/v2';

async function testApi() {
    console.log('Testing Railway API...');
    try {
        // Test 1: Train Search (NDLS to Mumbai)
        console.log('\n1. Searching for trains between NDLS and MMCT...');
        const searchUrl = `${API_BASE}/trains/between/NDLS/MMCT`;
        const searchRes = await fetch(searchUrl);
        const searchData = await searchRes.json();

        if (searchData.trains && searchData.trains.length > 0) {
            console.log(`✅ Success! Found ${searchData.trains.length} trains.`);
            console.log('Sample Train:', searchData.trains[0].train_name, `(${searchData.trains[0].train_number})`);
        } else {
            console.log('❌ Search failed or no trains found:', searchData);
        }

        // Test 2: PNR Status (using a dummy PNR to check response structure)
        // Note: Real PNR needed for success, but we check if endpoint is reachable
        console.log('\n2. Testing PNR endpoint reachability...');
        const pnrUrl = `https://pnrapi.com/api/pnr/1234567890`; // Dummy PNR
        const pnrRes = await fetch(pnrUrl);
        const pnrData = await pnrRes.json();

        console.log('PNR API Response:', pnrData);

    } catch (error) {
        console.error('❌ API Test Failed:', error.message);
    }
}

testApi();
