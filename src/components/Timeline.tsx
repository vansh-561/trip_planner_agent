'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MapPin, DollarSign, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import type { IDay } from '@/types';

const categoryColors: Record<string, string> = {
  accommodation: '#6366f1',
  food: '#f97316',
  activity: '#0ea5e9',
  transport: '#10b981',
};

const categoryLabels: Record<string, string> = {
  accommodation: 'Stay',
  food: 'Food',
  activity: 'Activity',
  transport: 'Transport',
};

interface TimelineProps {
  trip: any;
  onTripUpdate: (updatedTrip: any) => void;
}

export function Timeline({ trip, onTripUpdate }: TimelineProps) {
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set([1]));
  const [regeneratingDay, setRegeneratingDay] = useState<number | null>(null);

  const toggleDay = (dayNum: number) => {
    setExpandedDays((prev) => {
      const next = new Set(prev);
      if (next.has(dayNum)) next.delete(dayNum);
      else next.add(dayNum);
      return next;
    });
  };

  const regenerateDay = async (dayNumber: number) => {
    setRegeneratingDay(dayNumber);
    try {
      const res = await fetch(`/api/trips/${trip.id}/regenerate-day`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dayNumber }),
      });
      if (!res.ok) throw new Error('Failed to regenerate');
      const data = await res.json();
      onTripUpdate(data.trip);
    } catch (err) {
      console.error('Regenerate failed:', err);
    } finally {
      setRegeneratingDay(null);
    }
  };

  return (
    <div style={{ position: 'relative', paddingLeft: '40px' }}>
      {/* Vertical line */}
      <div style={{
        position: 'absolute', left: '15px', top: '20px', bottom: '20px',
        width: '2px',
        background: 'linear-gradient(to bottom, #0ea5e9 0%, #f97316 50%, #6366f1 100%)',
        opacity: 0.35,
      }} />

      {trip.itinerary.map((day: IDay, dayIdx: number) => {
        const isExpanded = expandedDays.has(day.dayNumber);
        const isRegenerating = regeneratingDay === day.dayNumber;
        const dayTotal = day.activities.reduce((sum, a) => sum + (a.estimatedCost || 0), 0);

        return (
          <motion.div
            key={day.dayNumber}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: dayIdx * 0.08 }}
            style={{ marginBottom: '24px' }}
          >
            {/* Day node circle */}
            <div style={{
              position: 'absolute', left: '6px',
              width: '20px', height: '20px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0ea5e9, #f97316)',
              border: '3px solid var(--bg-primary)',
              boxShadow: '0 0 16px rgba(14, 165, 233, 0.5)',
              zIndex: 1,
              marginTop: '18px',
            }} />

            {/* Day header card */}
            <div
              onClick={() => toggleDay(day.dayNumber)}
              style={{
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(148, 163, 184, 0.08)',
                borderRadius: '14px',
                padding: '16px 20px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(14, 165, 233, 0.25)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.08)')}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{
                    padding: '3px 10px',
                    background: 'rgba(14, 165, 233, 0.12)',
                    border: '1px solid rgba(14, 165, 233, 0.2)',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#38bdf8',
                  }}>
                    Day {day.dayNumber}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#475569' }}>{day.date}</span>
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', marginTop: '4px' }}>
                  {day.title}
                </h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: '#475569' }}>Day total</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0ea5e9' }}>
                    {trip.currency} {dayTotal.toFixed(0)}
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); regenerateDay(day.dayNumber); }}
                  className="btn btn-ghost btn-sm"
                  disabled={isRegenerating}
                  title="Regenerate this day"
                  style={{ padding: '6px 10px' }}
                >
                  <RefreshCw size={14} style={{ animation: isRegenerating ? 'spin-slow 1s linear infinite' : 'none' }} />
                  {isRegenerating ? 'Regen...' : 'Regen Day'}
                </button>
                {isExpanded ? <ChevronUp size={16} color="#94a3b8" /> : <ChevronDown size={16} color="#94a3b8" />}
              </div>
            </div>

            {/* Activities list */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ overflow: 'hidden', paddingTop: '8px', paddingLeft: '8px' }}
                >
                  {isRegenerating ? (
                    <div style={{ padding: '24px', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>
                      <RefreshCw size={20} color="#0ea5e9" style={{ animation: 'spin-slow 1s linear infinite', marginBottom: '8px' }} />
                      <p>AI is regenerating Day {day.dayNumber}...</p>
                    </div>
                  ) : (
                    day.activities.map((activity, actIdx) => {
                      const color = categoryColors[activity.category] || '#94a3b8';
                      return (
                        <motion.div
                          key={actIdx}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: actIdx * 0.05 }}
                          className="activity-card"
                        >
                          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#94a3b8', fontSize: '0.8rem' }}>
                                  <Clock size={12} />
                                  {activity.time}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#94a3b8', fontSize: '0.8rem' }}>
                                  <MapPin size={12} />
                                  {activity.location}
                                </div>
                                <span className={`badge badge-${activity.category}`}>
                                  {categoryLabels[activity.category] || activity.category}
                                </span>
                              </div>
                              <p style={{ fontSize: '0.9rem', color: '#e2e8f0', lineHeight: 1.5 }}>{activity.description}</p>
                            </div>
                            <div style={{
                              flexShrink: 0,
                              padding: '6px 12px',
                              background: `${color}18`,
                              border: `1px solid ${color}35`,
                              borderRadius: '8px',
                              fontSize: '0.85rem',
                              fontWeight: 700,
                              color: color,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}>
                              <DollarSign size={12} />
                              {activity.estimatedCost}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
