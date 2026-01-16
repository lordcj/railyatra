import { Metadata } from 'next';
import Link from 'next/link';
import { Train, Calendar, MapPin, AlertCircle, Search, ArrowRight } from 'lucide-react';
import { generateHomePageSchema } from '@/components/seo/schema';
import { getPopularTrains } from '@/data/trains';
import { majorStations } from '@/data/stations';

export const metadata: Metadata = {
  title: 'RailYatra - Indian Railway PNR Status & Live Train Status',
  description: 'Fastest PNR Status check for Indian Railways. Get live train running status, train schedule, seat availability, and confirmation probability. Simple, Fast & Ad-Lite.',
  keywords: 'PNR status, live train status, train running status, Indian Railways, IRCTC PNR, check PNR, train schedule, seat availability, RailYatra',
  alternates: {
    canonical: 'https://railyatra.co.in',
  },
};

export default function HomePage() {
  const popularTrains = getPopularTrains(10);
  const topStations = majorStations.slice(0, 12);

  return (
    <div className="fade-in" style={{ padding: '20px' }}>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateHomePageSchema()),
        }}
      />

      {/* Header */}
      <header style={{ marginBottom: '28px', marginTop: '8px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '4px', letterSpacing: '-0.01em' }}>
          Hello, <span style={{ color: 'var(--text-primary)' }}>Traveler</span> 👋
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px', fontWeight: 500 }}>
          Where is your next journey?
        </p>
      </header>

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '32px' }}>
        <Link href="/pnr" className="glass-panel" style={{
          padding: '20px 16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '14px',
          textDecoration: 'none',
        }}>
          <div style={{
            background: 'rgba(45, 212, 191, 0.15)',
            padding: '14px',
            borderRadius: '16px',
            color: 'rgb(45, 212, 191)',
          }}>
            <AlertCircle size={26} strokeWidth={2} />
          </div>
          <span style={{ color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600 }}>
            PNR Status
          </span>
        </Link>

        <Link href="/live" className="glass-panel" style={{
          padding: '20px 16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '14px',
          textDecoration: 'none',
        }}>
          <div style={{
            background: 'rgba(56, 189, 248, 0.15)',
            padding: '14px',
            borderRadius: '16px',
            color: 'rgb(56, 189, 248)',
          }}>
            <Train size={26} strokeWidth={2} />
          </div>
          <span style={{ color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600 }}>
            Live Train
          </span>
        </Link>

        <Link href="/trains" className="glass-panel" style={{
          padding: '20px 16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '14px',
          textDecoration: 'none',
        }}>
          <div style={{
            background: 'rgba(251, 146, 60, 0.15)',
            padding: '14px',
            borderRadius: '16px',
            color: 'rgb(251, 146, 60)',
          }}>
            <Calendar size={26} strokeWidth={2} />
          </div>
          <span style={{ color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600 }}>
            All Trains
          </span>
        </Link>

        <Link href="/stations" className="glass-panel" style={{
          padding: '20px 16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '14px',
          textDecoration: 'none',
        }}>
          <div style={{
            background: 'rgba(168, 85, 247, 0.15)',
            padding: '14px',
            borderRadius: '16px',
            color: 'rgb(168, 85, 247)',
          }}>
            <MapPin size={26} strokeWidth={2} />
          </div>
          <span style={{ color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600 }}>
            Stations
          </span>
        </Link>
      </div>

      {/* Popular Trains Section */}
      <section style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600 }}>Popular Trains</h2>
          <Link href="/trains" className="link" style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            View All <ArrowRight size={14} />
          </Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {popularTrains.map((train) => (
            <Link
              key={train.number}
              href={`/train/${train.number}`}
              className="glass-panel"
              style={{
                padding: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                textDecoration: 'none',
              }}
            >
              <div>
                <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {train.number} - {train.name.split(' ').slice(0, 3).join(' ')}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  {train.source} → {train.destination}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{
                  fontSize: '10px',
                  padding: '4px 8px',
                  borderRadius: '8px',
                  background: train.type === 'Vande Bharat' ? 'rgba(45, 212, 191, 0.15)' :
                    train.type === 'Rajdhani' ? 'rgba(251, 146, 60, 0.15)' :
                      'rgba(56, 189, 248, 0.15)',
                  color: train.type === 'Vande Bharat' ? 'rgb(45, 212, 191)' :
                    train.type === 'Rajdhani' ? 'rgb(251, 146, 60)' :
                      'rgb(56, 189, 248)',
                  fontWeight: 600,
                }}>
                  {train.type}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Major Stations Section */}
      <section style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600 }}>Major Stations</h2>
          <Link href="/stations" className="link" style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            View All <ArrowRight size={14} />
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {topStations.map((station) => (
            <Link
              key={station.code}
              href={`/station/${station.code}`}
              className="glass-panel"
              style={{
                padding: '12px',
                textAlign: 'center',
                textDecoration: 'none',
              }}
            >
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--accent-color)' }}>
                {station.code}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                {station.name}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Why Choose RailYatra */}
      <section className="glass-panel" style={{ padding: '32px', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px' }}>
          Why Choose <span className="text-gradient">RailYatra</span>?
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px', color: 'var(--accent-color)' }}>
              Fastest PNR Status Updates
            </h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '14px' }}>
              RailYatra provides the fastest and most accurate PNR status for Indian Railways bookings. Check your current booking status in milliseconds.
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px', color: 'var(--accent-color)' }}>
              Real-Time Train Tracking
            </h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '14px' }}>
              Never miss a train again with our live train running status. Get the exact location, ETA, and delay updates for all trains.
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px', color: 'var(--accent-color)' }}>
              Comprehensive Train Database
            </h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '14px' }}>
              Access schedules for 5,000+ Indian Railways trains. Search by train number, name, or route to find your perfect connection.
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px', color: 'var(--accent-color)' }}>
              User-Friendly & Fast
            </h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '14px' }}>
              Clean, premium design with blazing fast performance. Optimized for mobile with minimal ads for the best experience.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
