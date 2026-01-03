# RailYatra - Indian Railway Information App

**Live at: [railyatra.co.in](https://railyatra.co.in)**

A modern, fast, and beautiful Progressive Web App (PWA) for checking Indian Railway information in real-time.

## Features

- 🚄 **PNR Status Check** - Real-time PNR status with passenger details
- 🔍 **Train Search** - Find trains between any two stations
- 📍 **Train Schedule** - View complete train routes and timings
- 📱 **Mobile First** - Optimized for mobile devices
- 💰 **Ad-Supported** - Free to use, supported by Google AdSense
- ⚡ **Lightning Fast** - Aggressive caching for instant results
- 🌐 **PWA** - Install on your phone like a native app

## Tech Stack

- **Frontend**: React 18 + Vite
- **Routing**: React Router v6
- **Styling**: Vanilla CSS (Glassmorphism design)
- **Icons**: Lucide React
- **API**: Free Indian Railway APIs
- **Hosting**: Vercel (Free tier)
- **Domain**: railyatra.co.in

## Quick Start

### Development
```bash
npm install
npm run dev
```

### Build
```bash
npm run build
npm run preview
```

## Deployment

See [DEPLOY.md](./DEPLOY.md) for detailed deployment instructions.

**Quick Deploy to Vercel:**
1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
VITE_RAILWAY_API_BASE_URL=https://indianrailapi.com/api/v2
VITE_ADSENSE_CLIENT_ID=ca-pub-YOUR_ACTUAL_ID
```

## Monetization

RailYatra is monetization-ready with:
- 4 strategic ad placements per user journey
- Google AdSense integration
- Expected revenue: ₹50,000-100,000/year (with 500+ daily users)

See [adsense_setup_guide.md](./adsense_setup_guide.md) for complete setup.

## SEO Optimized

- Optimized for keywords: "PNR status", "live train status", "Indian railway"
- Fast loading times (<2s)
- Mobile-first responsive design
- PWA for better engagement

## License

MIT

## Contact

Built with ❤️ for Indian Railway travelers

**Website**: [railyatra.co.in](https://railyatra.co.in)
