# RailYatra Launch Checklist

## Pre-Launch (Before Deployment)

### 1. Domain Setup
- [x] Purchase railyatra.co.in domain
- [ ] Configure nameservers to Vercel
- [ ] Wait for DNS propagation (24-48 hours)

### 2. Google AdSense
- [ ] Sign up at https://www.google.com/adsense
- [ ] Submit site for review
- [ ] Get Publisher ID (ca-pub-XXXXXXXXXXXXXXXX)
- [ ] Update `.env` with your AdSense ID
- [ ] Update `index.html` with your AdSense ID

### 3. Code Preparation
- [x] App rebranded to "RailYatra"
- [x] SEO meta tags added
- [x] PWA manifest updated
- [x] API integration complete
- [x] Google AdSense components ready

### 4. GitHub Setup
- [ ] Install GitHub Desktop (https://desktop.github.com)
- [ ] Create repository: `railyatra`
- [ ] Publish to GitHub (make it public)

---

## Deployment

### 5. Vercel Deployment
- [ ] Sign up at https://vercel.com with GitHub
- [ ] Import `railyatra` repository
- [ ] Configure build settings:
  - Framework: Vite
  - Build Command: `npm run build`
  - Output Directory: `dist`
- [ ] Add environment variables:
  ```
  VITE_RAILWAY_API_BASE_URL=https://indianrailapi.com/api/v2
  VITE_API_TIMEOUT=15000
  VITE_ENABLE_CACHING=true
  VITE_CACHE_DURATION=3600000
  VITE_ADSENSE_CLIENT_ID=ca-pub-YOUR_ACTUAL_ID
  ```
- [ ] Deploy!

### 6. Custom Domain
- [ ] Go to Vercel project → Settings → Domains
- [ ] Add `railyatra.co.in`
- [ ] Copy nameservers
- [ ] Update domain registrar with Vercel nameservers
- [ ] Wait 24-48 hours for DNS propagation

---

## Post-Launch (First Week)

### 7. Testing
- [ ] Test PNR status check
- [ ] Test train search
- [ ] Test on mobile devices
- [ ] Verify ads are showing (may take 24-48 hours)
- [ ] Check page load speed (<2s)

### 8. SEO Setup
- [ ] Submit to Google Search Console
  - Add property: railyatra.co.in
  - Verify ownership
  - Submit sitemap
- [ ] Create Google Analytics account
  - Get tracking ID
  - Add to index.html
- [ ] Submit to Bing Webmaster Tools

### 9. Social Media
- [ ] Create Instagram page: @railyatra
- [ ] Create Twitter account: @railyatra
- [ ] Create Facebook page
- [ ] Post launch announcement

---

## Marketing (First Month)

### 10. Initial Promotion
- [ ] Share with friends and family
- [ ] Post in WhatsApp groups
- [ ] Share in college/office groups
- [ ] Post on Reddit:
  - r/india
  - r/indianrailways
  - r/delhi
  - r/mumbai
- [ ] Post on LinkedIn

### 11. Content Marketing
- [ ] Write blog post: "How to check PNR status"
- [ ] Create Instagram reels showing features
- [ ] Share tips on Twitter
- [ ] Create YouTube short demo

### 12. Monitor & Optimize
- [ ] Check Google Analytics daily
- [ ] Monitor AdSense revenue
- [ ] Track user feedback
- [ ] Fix bugs if any
- [ ] Optimize ad placement based on data

---

## Growth (Months 2-3)

### 13. Feature Expansion
- [ ] Add train alerts
- [ ] Add fare calculator
- [ ] Add platform information
- [ ] Add offline mode improvements

### 14. Monetization Optimization
- [ ] A/B test ad placements
- [ ] Add affiliate links (booking sites)
- [ ] Consider premium features
- [ ] Explore sponsorship opportunities

### 15. Scale
- [ ] Aim for 1,000 daily users
- [ ] Target ₹10,000+/month revenue
- [ ] Build email list
- [ ] Create mobile app (PWA already done!)

---

## Success Metrics

### Month 1 Goals
- [ ] 100+ daily users
- [ ] 500+ page views/day
- [ ] ₹2,000+ AdSense revenue
- [ ] 50+ social media followers

### Month 3 Goals
- [ ] 500+ daily users
- [ ] 2,000+ page views/day
- [ ] ₹10,000+ monthly revenue
- [ ] 200+ social media followers

### Month 6 Goals
- [ ] 1,000+ daily users
- [ ] 5,000+ page views/day
- [ ] ₹25,000+ monthly revenue
- [ ] 500+ social media followers

---

## Emergency Contacts

- **Vercel Support**: https://vercel.com/support
- **AdSense Help**: https://support.google.com/adsense
- **Domain Support**: Your registrar's support

---

## Notes

- Keep `.env` file secure (never commit to GitHub)
- Monitor costs (should be ₹0 with free tiers)
- Backup code regularly
- Respond to user feedback quickly

**Good luck with your launch! 🚀**
