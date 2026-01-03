# RailRadar API Integration Guide

## Overview

Your RailYatra app now uses **RailRadar.in** as the primary API source with automatic fallback to the free Indian Railway API. This provides:

- ✅ **1,000 free requests/month** with RailRadar
- ✅ **Production-ready reliability** (99.9% uptime SLA)
- ✅ **Fast response times** (3-200ms depending on endpoint)
- ✅ **Live train tracking** with real-time position updates
- ✅ **Automatic fallback** when RailRadar is unavailable

## Setup Instructions

### 1. Configure API Key in Vercel

Since you mentioned using Vercel for deployment, add the RailRadar API key as an environment variable:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add a new variable:
   - **Name**: `VITE_RAILRADAR_API_KEY`
   - **Value**: `rr_y88izau0l9rbvtn8mys5p23wkjiglrf3`
   - **Environment**: Production, Preview, Development (select all)
4. Click **Save**
5. Redeploy your application

### 2. Local Development Setup

For local testing, update your `.env` file:

```bash
# Add this to your .env file (NOT .env.example)
VITE_RAILRADAR_API_KEY=rr_y88izau0l9rbvtn8mys5p23wkjiglrf3
```

> ⚠️ **Note**: The `.env` file is gitignored for security. Never commit API keys to git!

## New Features

### 🚂 Live Train Tracking

A brand new feature powered by RailRadar! Access it at `/live` route.

**Features:**
- Real-time train position
- Delay information (on-time or minutes late)
- Next station and ETA
- Complete route with all stations
- Running days information

**Usage:**
```javascript
import { getLiveTrainStatus } from './services/railRadarApi';

const trainData = await getLiveTrainStatus('12951');
console.log(trainData.liveData.currentPosition);
```

### 🔄 Automatic Fallback System

The app intelligently switches between APIs:

1. **Primary**: RailRadar API (when configured)
2. **Fallback**: Indian Railway API (if RailRadar fails)
3. **Demo Data**: Static data (if both APIs are down)

You'll see console logs indicating which API is being used:
- 🚀 Using RailRadar API
- 🔄 Using fallback Indian Railway API
- ⚠️ All APIs unavailable, returning demo data

## API Endpoints Available

### RailRadar Endpoints

| Endpoint | Function | Response Time |
|----------|----------|---------------|
| `/api/v1/trains/{trainNumber}` | Live train status | 80-150ms |
| `/api/v1/trains/between` | Trains between stations | 50-100ms |
| `/api/v1/search/trains` | Fast train search | 3-20ms |
| `/api/v1/stations/{code}/live` | Live station board | 100-200ms |

### Authentication

All RailRadar requests use the `X-API-Key` header:

```javascript
headers: {
  'X-API-Key': 'your_api_key_here'
}
```

## Files Modified

### New Files Created
- `src/services/railRadarApi.js` - RailRadar API service
- `src/pages/LiveTrainStatus.jsx` - Live tracking page
- `src/styles/LiveTrainStatus.css` - Live tracking styles

### Files Updated
- `src/services/railwayApi.js` - Added RailRadar integration with fallback
- `src/App.jsx` - Added `/live` route
- `.env.example` - Added RailRadar API key configuration

## Usage Monitoring

**Free Tier Limits:**
- 1,000 requests/month
- Resets monthly
- No credit card required

**Tips to Stay Within Limits:**
- Caching is enabled by default (1 hour cache duration)
- Fallback API is unlimited (but less reliable)
- Monitor usage in RailRadar dashboard

## Upgrading

If you need more requests:

| Plan | Requests/Month | Price |
|------|----------------|-------|
| Free | 1,000 | ₹0 |
| Basic | 20,000 | ₹1,000 |
| Pro | 100,000 | ₹3,000 |
| Enterprise | Custom | Custom |

## Testing

### Test Live Train Tracking

1. Start your dev server: `npm run dev`
2. Navigate to `http://localhost:5173/#/live`
3. Enter a train number (e.g., `12951`)
4. Click "Track Live"

### Test Train Search with RailRadar

1. Go to train search page
2. Search for trains between stations (e.g., BSB to NDLS)
3. Check browser console for "🚀 Using RailRadar API" message

## Troubleshooting

### API Key Not Working

- Verify the key is correctly set in Vercel environment variables
- Check that the variable name is exactly `VITE_RAILRADAR_API_KEY`
- Redeploy after adding environment variables

### Fallback Always Being Used

- Check browser console for error messages
- Verify API key is loaded: `import.meta.env.VITE_RAILRADAR_API_KEY`
- Ensure you're not hitting rate limits (1,000/month)

### Live Tracking Not Working

- RailRadar API key must be configured
- Some trains may not have live data available
- Check network tab for API response errors

## Support

- **RailRadar Docs**: https://railradar.in/api/v1/openapi
- **RailRadar Dashboard**: https://railradar.in/register
- **Free Tier**: 1,000 requests/month, no support
- **Paid Plans**: Email support included

---

**🎉 Your app is now powered by RailRadar with production-ready reliability!**
