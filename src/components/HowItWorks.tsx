'use client';

import { motion } from 'framer-motion';
import { MessageSquare, Zap, MapPin, ChevronRight } from 'lucide-react';

const steps = [
  {
    icon: MessageSquare,
    number: '01',
    title: 'Tell Us Your Dream Trip',
    description:
      'Enter your destination, total budget, travel dates, and personal preferences — like "I love street food" or "avoid crowded tourist spots".',
    color: '#0ea5e9',
    glow: 'rgba(14, 165, 233, 0.15)',
  },
  {
    icon: Zap,
    number: '02',
    title: 'AI Searches Real-Time Data',
    description:
      'Our LangGraph AI agent autonomously searches the web for current hotel prices, attraction costs, and local tips tailored to your budget.',
    color: '#f97316',
    glow: 'rgba(249, 115, 22, 0.15)',
  },
  {
    icon: MapPin,
    number: '03',
    title: 'Get Your Perfect Itinerary',
    description:
      'Receive a detailed day-by-day travel plan with time slots, cost breakdowns, and the ability to regenerate any day you don\'t like.',
    color: '#6366f1',
    glow: 'rgba(99, 102, 241, 0.15)',
  },
];

export function HowItWorks() {
  return (
    <section style={{
      padding: '120px 0',
      background: 'linear-gradient(180deg, #020617 0%, #0a1628 100%)',
      position: 'relative',
    }}>
      <div className="container">
        {/* Header */}
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="section-badge">
            <Zap size={14} />
            How It Works
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800, color: '#f8fafc', marginBottom: '16px' }}>
            Three Steps to Your{' '}
            <span className="gradient-text">Perfect Adventure</span>
          </h2>
          <p style={{ fontSize: '1rem', color: '#94a3b8', maxWidth: '560px', margin: '0 auto', lineHeight: 1.7 }}>
            Our agentic AI handles all the research, budget calculations, and scheduling — you just pick your destination.
          </p>
        </motion.div>

        {/* Steps */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '32px',
          position: 'relative',
        }}>
          {/* Connector line */}
          <div style={{
            position: 'absolute',
            top: '80px',
            left: '25%',
            right: '25%',
            height: '2px',
            background: 'linear-gradient(90deg, #0ea5e9, #f97316, #6366f1)',
            opacity: 0.2,
            display: 'none', // hidden on mobile, shown via media query
          }} />

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              style={{
                background: 'rgba(15, 23, 42, 0.6)',
                border: `1px solid ${step.color}22`,
                borderRadius: '20px',
                padding: '32px',
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              }}
              whileHover={{ y: -6, boxShadow: `0 24px 48px ${step.glow}` }}
            >
              {/* Background glow */}
              <div style={{
                position: 'absolute', top: 0, right: 0,
                width: '200px', height: '200px',
                background: `radial-gradient(circle at top right, ${step.glow} 0%, transparent 70%)`,
              }} />

              {/* Step number */}
              <div style={{
                fontSize: '4rem', fontWeight: 800,
                color: `${step.color}15`,
                lineHeight: 1,
                marginBottom: '16px',
                fontFamily: 'var(--font-poppins)',
              }}>
                {step.number}
              </div>

              {/* Icon */}
              <div style={{
                width: 52, height: 52,
                borderRadius: '14px',
                background: `${step.color}18`,
                border: `1px solid ${step.color}35`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '20px',
              }}>
                <step.icon size={24} color={step.color} />
              </div>

              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', marginBottom: '12px' }}>
                {step.title}
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.7 }}>
                {step.description}
              </p>

              {i < steps.length - 1 && (
                <div style={{
                  position: 'absolute', right: '-20px', top: '80px',
                  color: '#475569', zIndex: 2,
                }}>
                  <ChevronRight size={24} />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
