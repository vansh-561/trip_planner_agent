'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, MapPin, Calendar, DollarSign, ArrowRight, Star } from 'lucide-react';

// Mock itinerary preview card
function ItineraryMockup() {
  const days = [
    { day: 'Day 1', title: 'Arrival & Eiffel Tower', cost: '$120', color: '#0ea5e9' },
    { day: 'Day 2', title: 'Louvre Museum & Seine Cruise', cost: '$85', color: '#f97316' },
    { day: 'Day 3', title: 'Montmartre & Local Cuisine', cost: '$60', color: '#6366f1' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="animate-float"
      style={{
        background: 'rgba(15, 23, 42, 0.9)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(14, 165, 233, 0.2)',
        borderRadius: '20px',
        padding: '24px',
        width: '100%',
        maxWidth: '380px',
        boxShadow: '0 24px 64px rgba(0,0,0,0.6), 0 0 48px rgba(14, 165, 233, 0.1)',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <MapPin size={14} color="#0ea5e9" />
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Paris, France</span>
          </div>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>3-Day Paris Adventure</h4>
        </div>
        <div style={{
          padding: '6px 12px',
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '20px',
          fontSize: '0.75rem',
          color: '#34d399',
          fontWeight: 600,
        }}>
          FINALIZED
        </div>
      </div>

      {/* Budget bar */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Budget Used</span>
          <span style={{ fontSize: '0.75rem', color: '#0ea5e9', fontWeight: 600 }}>$265 / $350</span>
        </div>
        <div style={{ height: '4px', background: 'rgba(148, 163, 184, 0.15)', borderRadius: '2px' }}>
          <div style={{ height: '100%', width: '75%', background: 'linear-gradient(90deg, #0ea5e9, #f97316)', borderRadius: '2px' }} />
        </div>
      </div>

      {/* Timeline days */}
      <div style={{ position: 'relative', paddingLeft: '24px' }}>
        <div style={{
          position: 'absolute', left: '7px', top: '4px', bottom: '4px',
          width: '2px', background: 'linear-gradient(to bottom, #0ea5e9, #f97316)',
          opacity: 0.4,
        }} />
        {days.map((d, i) => (
          <div key={i} style={{ position: 'relative', marginBottom: i < days.length - 1 ? '16px' : 0 }}>
            <div style={{
              position: 'absolute', left: '-19px', top: '4px',
              width: '10px', height: '10px', borderRadius: '50%',
              background: d.color, boxShadow: `0 0 8px ${d.color}80`,
            }} />
            <div style={{
              background: 'rgba(30, 41, 59, 0.6)',
              border: '1px solid rgba(148, 163, 184, 0.08)',
              borderRadius: '10px',
              padding: '10px 12px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '2px' }}>{d.day}</div>
                <div style={{ fontSize: '0.85rem', color: '#f8fafc', fontWeight: 500 }}>{d.title}</div>
              </div>
              <div style={{ fontSize: '0.8rem', color: d.color, fontWeight: 600 }}>{d.cost}</div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export function HeroSection() {
  const stats = [
    { icon: MapPin, value: '150+', label: 'Destinations' },
    { icon: Star, value: '4.9★', label: 'User Rating' },
    { icon: Calendar, value: '<60s', label: 'Plan Time' },
  ];

  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #020617 0%, #0f172a 50%, #0c1e3b 100%)',
      position: 'relative',
      overflow: 'hidden',
      paddingTop: '80px',
    }}>
      {/* Background orbs */}
      <div style={{
        position: 'absolute', top: '20%', left: '-5%',
        width: '500px', height: '500px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(14, 165, 233, 0.08) 0%, transparent 70%)',
        filter: 'blur(40px)',
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', right: '-5%',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(249, 115, 22, 0.06) 0%, transparent 70%)',
        filter: 'blur(40px)',
      }} />

      <div className="container" style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '64px',
        alignItems: 'center',
        padding: '80px 24px',
      }}>
        {/* Left: Text */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="section-badge" style={{ marginBottom: '24px' }}>
              <Sparkles size={14} />
              AI-Powered Travel Planning
            </div>

            <h1 style={{
              fontSize: 'clamp(2.5rem, 5vw, 3.8rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: '24px',
              color: '#f8fafc',
            }}>
              Your Personal{' '}
              <span className="gradient-text">AI Travel</span>{' '}
              Concierge
            </h1>

            <p style={{
              fontSize: '1.1rem',
              color: '#94a3b8',
              lineHeight: 1.7,
              marginBottom: '40px',
              maxWidth: '500px',
            }}>
              Tell us your destination, budget, and dates. Our autonomous AI agent
              searches real-time data and builds you a perfect, personalized itinerary
              — in under 60 seconds.
            </p>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '48px' }}>
              <Link href="/register" className="btn btn-primary btn-lg">
                <Sparkles size={18} />
                Start Planning Free
                <ArrowRight size={18} />
              </Link>
              <Link href="/login" className="btn btn-ghost btn-lg">
                Sign In
              </Link>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: '32px' }}>
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <stat.icon size={16} color="#0ea5e9" />
                    <div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc' }}>{stat.value}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{stat.label}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right: Mockup */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <ItineraryMockup />
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '100px',
        background: 'linear-gradient(to bottom, transparent, #020617)',
      }} />
    </section>
  );
}
