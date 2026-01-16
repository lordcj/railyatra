import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import { Suspense } from 'react';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { Analytics } from '@/components/analytics/Analytics';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const viewport: Viewport = {
  themeColor: '#0f172a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://railyatra.co.in'),
  title: {
    default: 'RailYatra - Indian Railway PNR Status, Live Train Status & Schedule',
    template: '%s | RailYatra',
  },
  description:
    'Check confirmed PNR status, live train running status, seat availability and train time table. Fast, simple, and ad-free experience on RailYatra.',
  keywords: [
    'PNR status',
    'live train status',
    'train running status',
    'Indian Railway',
    'IRCTC PNR',
    'train schedule',
    'seat availability',
    'RailYatra',
  ],
  authors: [{ name: 'RailYatra' }],
  creator: 'RailYatra',
  publisher: 'RailYatra',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://railyatra.co.in',
    siteName: 'RailYatra',
    title: 'RailYatra - PNR Status & Live Train Status',
    description:
      'Check PNR status, live train running status & Indian Railway information instantly. Fast, free & accurate.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'RailYatra - Indian Railway Information',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RailYatra - PNR Status & Live Train Status',
    description: 'Check PNR status & live train status instantly',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/logo_small.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [{ url: '/icon-192.png' }],
  },
  verification: {
    google: 'YOUR_VERIFICATION_TOKEN_HERE',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Google AdSense - Lazy Loaded for Performance */}
        <Script
          id="adsense-init"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8792747031835209"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
      </head>
      <body>
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
        <Header />
        <main className="app-container" style={{ paddingBottom: '120px' }}>
          {children}
        </main>
        <Footer />
        <Navbar />
      </body>
    </html >
  );
}
