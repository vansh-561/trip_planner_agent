'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  MapPin, Calendar, DollarSign, Plus, Sparkles,
  Plane, BarChart2, Clock, Trash2
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';

interface TripCardData {
  id: string;
  destination: string;
  budget: number;
  currency: string;
  startDate: Date | string;
  endDate: Date | string;
  status: 'DRAFT' | 'FINALIZED';
  totalEstimatedCost: number;
  createdAt: Date | string;
}

interface DashboardClientProps {
  trips: TripCardData[];
  userName: string;
}

export function DashboardClient({ trips, userName }: DashboardClientProps) {
  const [tripList, setTripList] = useState(trips);

  const formatDate = (d: Date | string) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const deleteTrip = async (id: string) => {
    if (!confirm('Delete this trip?')) return;
    await fetch(`/api/trips/${id}`, { method: 'DELETE' });
    setTripList((prev) => prev.filter((t) => t.id !== id));
  };

  const destinationEmojis: Record<string, string> = {
    paris: '🗼', tokyo: '🏯', bali: '🌴', london: '🎡',
    'new york': '🗽', dubai: '🌆', rome: '🏛️', sydney: '🦘',
  };
  const getEmoji = (dest: string) =>
    destinationEmojis[dest.toLowerCase()] || '🌍';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />

      <div className="container" style={{ padding: '100px 24px 80px' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '48px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <p style={{ color: '#94a3b8', marginBottom: '4px' }}>Welcome back,</p>
              <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 800, color: '#f8fafc' }}>
                {userName} <span style={{ fontSize: '1.5rem' }}>✈️</span>
              </h1>
            </div>
            <Link href="/plan-trip" className="btn btn-primary">
              <Sparkles size={18} />
              Plan New Trip
            </Link>
          </div>

          {/* Stats */}
          {tripList.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginTop: '32px' }}>
              {[
                { icon: Plane, label: 'Total Trips', value: tripList.length },
                { icon: MapPin, label: 'Destinations', value: new Set(tripList.map((t) => t.destination)).size },
                { icon: BarChart2, label: 'Finalized', value: tripList.filter((t) => t.status === 'FINALIZED').length },
                {
                  icon: DollarSign,
                  label: 'Total Budgeted',
                  value: `$${tripList.reduce((s, t) => s + t.budget, 0).toLocaleString()}`,
                },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  style={{
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid rgba(148, 163, 184, 0.08)',
                    borderRadius: '12px',
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'rgba(14, 165, 233, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <stat.icon size={18} color="#0ea5e9" />
                  </div>
                  <div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>{stat.value}</div>
                    <div style={{ fontSize: '0.75rem', color: '#475569' }}>{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Trips Grid */}
        {tripList.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: 'center', padding: '80px 24px' }}
          >
            <div style={{ fontSize: '80px', marginBottom: '24px' }}>🗺️</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#94a3b8', marginBottom: '12px' }}>
              No trips yet
            </h2>
            <p style={{ color: '#475569', marginBottom: '32px' }}>
              Ready to explore? Let our AI plan your perfect first trip.
            </p>
            <Link href="/plan-trip" className="btn btn-primary btn-lg">
              <Plus size={18} /> Plan Your First Trip
            </Link>
          </motion.div>
        ) : (
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#94a3b8', marginBottom: '24px' }}>
              Your Trips ({tripList.length})
            </h2>
            <div className="grid-responsive">
              {tripList.map((trip, i) => (
                <motion.div
                  key={trip.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link
                    href={`/dashboard/trips/${trip.id}`}
                    style={{ textDecoration: 'none', display: 'block' }}
                  >
                    <div
                      className="card"
                      style={{ position: 'relative', overflow: 'hidden', cursor: 'pointer' }}
                    >
                      {/* Gradient top bar */}
                      <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                        background: 'linear-gradient(90deg, #0ea5e9, #f97316)',
                      }} />

                      {/* Destination emoji + header */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px', paddingTop: '8px' }}>
                        <div>
                          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{getEmoji(trip.destination)}</div>
                          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>{trip.destination}</h3>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                          <span className={`badge badge-${trip.status.toLowerCase()}`}>{trip.status}</span>
                          <button
                            onClick={(e) => { e.preventDefault(); deleteTrip(trip.id); }}
                            className="btn btn-ghost btn-sm"
                            style={{ padding: '4px 8px', color: '#ef4444' }}
                            title="Delete trip"
                            aria-label="Delete trip"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Trip details */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#94a3b8' }}>
                          <Calendar size={14} />
                          {formatDate(trip.startDate)} → {formatDate(trip.endDate)}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#94a3b8' }}>
                          <DollarSign size={14} />
                          Budget: {trip.currency} {trip.budget.toLocaleString()}
                        </div>
                        {trip.totalEstimatedCost > 0 && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#0ea5e9' }}>
                            <BarChart2 size={14} />
                            Est. cost: {trip.currency} {trip.totalEstimatedCost.toLocaleString()}
                          </div>
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#475569' }}>
                          <Clock size={12} />
                          Created {formatDate(trip.createdAt)}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}

              {/* Add new trip card */}
              <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: tripList.length * 0.06 }}>
                <Link href="/plan-trip" style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
                  <div style={{
                    background: 'rgba(14, 165, 233, 0.04)',
                    border: '2px dashed rgba(14, 165, 233, 0.2)',
                    borderRadius: '16px',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    minHeight: '200px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(14, 165, 233, 0.4)'; (e.currentTarget as HTMLElement).style.background = 'rgba(14, 165, 233, 0.07)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(14, 165, 233, 0.2)'; (e.currentTarget as HTMLElement).style.background = 'rgba(14, 165, 233, 0.04)'; }}
                  >
                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(14, 165, 233, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Plus size={24} color="#0ea5e9" />
                    </div>
                    <span style={{ color: '#0ea5e9', fontWeight: 600, fontSize: '0.95rem' }}>Plan New Trip</span>
                  </div>
                </Link>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
