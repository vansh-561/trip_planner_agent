'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, DollarSign, ArrowLeft, Share2, Printer } from 'lucide-react';
import Link from 'next/link';
import { Timeline } from '@/components/Timeline';
import { BudgetBreakdown } from '@/components/BudgetBreakdown';

interface ITrip {
  id: string;
  destination: string;
  status: string;
  startDate: Date | string;
  endDate: Date | string;
  totalEstimatedCost: number;
  budget: number;
  currency: string;
  itinerary: any[];
}

interface TripViewClientProps {
  initialTrip: ITrip;
}

export function TripViewClient({ initialTrip }: TripViewClientProps) {
  const [trip, setTrip] = useState<ITrip>(initialTrip);

  const formatDate = (d: Date | string) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const numDays = trip.itinerary.length;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #020617 0%, #0f172a 40%, #0c1e3b 100%)',
        padding: '100px 24px 60px',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(148, 163, 184, 0.08)',
      }}>
        {/* Background orbs */}
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', bottom: '-30px', left: '-30px', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 70%)', filter: 'blur(40px)' }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <Link href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '0.9rem', marginBottom: '24px', transition: 'color 0.2s' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#f8fafc')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}>
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '3rem' }}>✈️</span>
                  <div>
                    <span className={`badge badge-${trip.status.toLowerCase()}`} style={{ marginBottom: '6px', display: 'inline-flex' }}>
                      {trip.status}
                    </span>
                    <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, color: '#f8fafc' }}>
                      {trip.destination}
                    </h1>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '0.9rem' }}>
                    <Calendar size={15} />
                    {formatDate(trip.startDate)} → {formatDate(trip.endDate)}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '0.9rem' }}>
                    <MapPin size={15} />
                    {numDays} day{numDays !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>

              {/* Cost summary card */}
              <div style={{
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(14, 165, 233, 0.2)',
                borderRadius: '16px',
                padding: '20px 24px',
                minWidth: '200px',
              }}>
                <div style={{ fontSize: '0.75rem', color: '#475569', marginBottom: '4px' }}>TOTAL ESTIMATED COST</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, background: 'linear-gradient(135deg, #0ea5e9, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  {trip.currency} {trip.totalEstimatedCost.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '4px' }}>
                  Budget: {trip.currency} {trip.budget.toLocaleString()}
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  <button className="btn btn-ghost btn-sm" title="Share">
                    <Share2 size={14} /> Share
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => window.print()} title="Print">
                    <Printer size={14} /> Print
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main content */}
      <div className="container" style={{ padding: '48px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '40px', alignItems: 'start' }}>
          {/* Left: Timeline */}
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#f8fafc', marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={20} color="#0ea5e9" />
              Day-by-Day Itinerary
            </h2>
            <Timeline trip={trip} onTripUpdate={setTrip} />
          </div>

          {/* Right: Budget Breakdown */}
          <div style={{ position: 'sticky', top: '24px' }}>
            <div style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(148, 163, 184, 0.08)',
              borderRadius: '16px',
              padding: '24px',
            }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <DollarSign size={18} color="#0ea5e9" />
                Budget Breakdown
              </h2>
              <BudgetBreakdown
                itinerary={trip.itinerary}
                totalBudget={trip.budget}
                currency={trip.currency}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
