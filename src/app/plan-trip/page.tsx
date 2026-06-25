'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, DollarSign, Calendar, Heart, Sparkles, ChevronRight, ChevronLeft, AlertCircle } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { ThinkingAgentUI } from '@/components/ThinkingAgentUI';

// Destination backgrounds / emoji map
const destinationEmojis: Record<string, string> = {
  paris: '🗼', tokyo: '🏯', bali: '🌴', london: '🎡', new_york: '🗽',
  dubai: '🌆', rome: '🏛️', sydney: '🦘', barcelona: '⛪', default: '🌍',
};

function getDestinationEmoji(dest: string) {
  const key = dest.toLowerCase().replace(/\s+/g, '_');
  return destinationEmojis[key] || destinationEmojis.default;
}

const CURRENCIES = ['USD', 'EUR', 'INR', 'GBP', 'JPY', 'AUD', 'CAD', 'SGD'];

export default function PlanTripPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    budget: 500,
    currency: 'USD',
    startDate: '',
    endDate: '',
    preferences: '',
  });

  const today = new Date().toISOString().split('T')[0];

  const handleGenerate = () => {
    if (!formData.destination || !formData.startDate || !formData.endDate) {
      setError('Please fill in all required fields');
      return;
    }
    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      setError('End date must be after start date');
      return;
    }
    setError('');
    setIsGenerating(true);
  };

  const handleComplete = (tripId: string) => {
    setTimeout(() => router.push(`/dashboard/trips/${tripId}`), 1500);
  };

  const handleError = (errMsg: string) => {
    setError(errMsg);
    setIsGenerating(false);
  };

  const numDays = formData.startDate && formData.endDate
    ? Math.max(1, Math.ceil((new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / 86400000))
    : 0;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />

      <div style={{
        maxWidth: '720px', margin: '0 auto',
        padding: '120px 24px 80px',
      }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: '48px' }}
        >
          <div className="section-badge" style={{ marginBottom: '16px' }}>
            <Sparkles size={14} /> Plan Your Trip
          </div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#f8fafc', marginBottom: '12px' }}>
            Tell Us About Your{' '}
            <span className="gradient-text">Dream Trip</span>
          </h1>
          <p style={{ color: '#94a3b8' }}>
            Answer a few questions and our AI will build your perfect itinerary.
          </p>
        </motion.div>

        {/* Step progress indicator */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '40px' }}>
          {[1, 2, 3].map((s) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: s <= step ? 'linear-gradient(135deg, #0ea5e9, #f97316)' : 'rgba(30, 41, 59, 0.8)',
                border: `2px solid ${s <= step ? 'transparent' : 'rgba(148, 163, 184, 0.15)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.8rem', fontWeight: 700,
                color: s <= step ? 'white' : '#475569',
                transition: 'all 0.3s ease',
              }}>
                {s}
              </div>
              {s < 3 && <div style={{ width: 48, height: 2, background: s < step ? 'linear-gradient(90deg, #0ea5e9, #f97316)' : 'rgba(148, 163, 184, 0.1)', borderRadius: '1px', transition: 'background 0.3s ease' }} />}
            </div>
          ))}
        </div>

        {/* Step labels */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0', marginBottom: '40px' }}>
          {['Locations', 'Budget & Dates', 'Preferences'].map((label, i) => (
            <div key={i} style={{ width: '33%', textAlign: 'center', fontSize: '0.75rem', color: i + 1 === step ? '#0ea5e9' : '#475569', fontWeight: i + 1 === step ? 600 : 400 }}>
              {label}
            </div>
          ))}
        </div>

        {/* Form Steps */}
        <AnimatePresence mode="wait">
          {!isGenerating && (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* ─── Step 1: Destination ─────────────────────── */}
              {step === 1 && (
                <div style={{
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(148, 163, 184, 0.08)',
                  borderRadius: '20px', padding: '40px',
                }}>
                  {/* Destination preview emoji */}
                  {formData.destination && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      style={{ textAlign: 'center', fontSize: '80px', marginBottom: '24px' }}
                    >
                      {getDestinationEmoji(formData.destination)}
                    </motion.div>
                  )}

                  <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#f8fafc', marginBottom: '8px' }}>
                    Where are you traveling?
                  </h2>
                  <p style={{ color: '#94a3b8', marginBottom: '28px', fontSize: '0.9rem' }}>
                    Enter your departure and dream destination.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                    <div>
                      <label htmlFor="origin" className="label">Origin / Departure City</label>
                      <div style={{ position: 'relative' }}>
                        <MapPin size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                        <input
                          id="origin"
                          type="text"
                          placeholder="e.g. London, New York..."
                          className="input"
                          style={{ paddingLeft: '42px', fontSize: '1rem' }}
                          value={formData.origin}
                          onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                          autoFocus
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="destination" className="label">Destination</label>
                      <div style={{ position: 'relative' }}>
                        <MapPin size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#0ea5e9' }} />
                        <input
                          id="destination"
                          type="text"
                          placeholder="e.g. Paris, Tokyo, Bali..."
                          className="input"
                          style={{ paddingLeft: '42px', fontSize: '1rem', borderColor: formData.destination ? 'rgba(14, 165, 233, 0.3)' : undefined }}
                          value={formData.destination}
                          onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Popular destinations */}
                  <div style={{ marginBottom: '28px' }}>
                    <p style={{ fontSize: '0.8rem', color: '#475569', marginBottom: '10px' }}>Popular destinations:</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {['Paris', 'Tokyo', 'Bali', 'New York', 'Rome', 'Dubai'].map((dest) => (
                        <button
                          key={dest}
                          onClick={() => setFormData({ ...formData, destination: dest })}
                          className="btn btn-ghost btn-sm"
                          style={{ fontSize: '0.8rem' }}
                        >
                          {getDestinationEmoji(dest.toLowerCase())} {dest}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => formData.destination && setStep(2)}
                    className="btn btn-primary"
                    style={{ width: '100%', justifyContent: 'center' }}
                    disabled={!formData.destination}
                  >
                    Continue <ChevronRight size={18} />
                  </button>
                </div>
              )}

              {/* ─── Step 2: Budget & Dates ───────────────────── */}
              {step === 2 && (
                <div style={{
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(148, 163, 184, 0.08)',
                  borderRadius: '20px', padding: '40px',
                }}>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#f8fafc', marginBottom: '8px' }}>
                    Budget & Travel Dates
                  </h2>
                  <p style={{ color: '#94a3b8', marginBottom: '28px', fontSize: '0.9rem' }}>
                    Set your total trip budget and travel window.
                  </p>

                  {/* Currency + Budget */}
                  <div style={{ marginBottom: '28px' }}>
                    <label className="label">Currency & Total Budget</label>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <select
                        className="input"
                        style={{ width: '120px', flexShrink: 0 }}
                        value={formData.currency}
                        onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                        aria-label="Currency"
                      >
                        {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
                      </select>
                      <div style={{ position: 'relative', flex: 1 }}>
                        <DollarSign size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                        <input
                          type="number"
                          min="50"
                          className="input"
                          style={{ paddingLeft: '42px' }}
                          value={formData.budget}
                          onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                          aria-label="Budget amount"
                        />
                      </div>
                    </div>
                    {/* Budget slider */}
                    <input
                      type="range"
                      min="100"
                      max="10000"
                      step="50"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                      style={{ width: '100%', marginTop: '12px', accentColor: '#0ea5e9' }}
                      aria-label="Budget slider"
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#475569' }}>
                      <span>100</span>
                      <span style={{ color: '#0ea5e9', fontWeight: 600 }}>{formData.currency} {formData.budget.toLocaleString()}</span>
                      <span>10,000</span>
                    </div>
                  </div>

                  {/* Dates */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px' }}>
                    <div>
                      <label htmlFor="start-date" className="label">Start Date</label>
                      <div style={{ position: 'relative' }}>
                        <Calendar size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                        <input
                          id="start-date"
                          type="date"
                          className="input"
                          style={{ paddingLeft: '42px' }}
                          min={today}
                          value={formData.startDate}
                          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="end-date" className="label">End Date</label>
                      <div style={{ position: 'relative' }}>
                        <Calendar size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                        <input
                          id="end-date"
                          type="date"
                          className="input"
                          style={{ paddingLeft: '42px' }}
                          min={formData.startDate || today}
                          value={formData.endDate}
                          onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  {numDays > 0 && (
                    <div style={{
                      padding: '12px 16px',
                      background: 'rgba(14, 165, 233, 0.08)',
                      border: '1px solid rgba(14, 165, 233, 0.2)',
                      borderRadius: '10px',
                      marginBottom: '24px',
                      fontSize: '0.9rem',
                      color: '#38bdf8',
                    }}>
                      🗓️ {numDays} day{numDays !== 1 ? 's' : ''} • ~{formData.currency} {Math.round(formData.budget / numDays)} per day
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => setStep(1)} className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }}>
                      <ChevronLeft size={18} /> Back
                    </button>
                    <button
                      onClick={() => formData.startDate && formData.endDate && setStep(3)}
                      className="btn btn-primary"
                      style={{ flex: 2, justifyContent: 'center' }}
                      disabled={!formData.startDate || !formData.endDate}
                    >
                      Continue <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              )}

              {/* ─── Step 3: Preferences ──────────────────────── */}
              {step === 3 && (
                <div style={{
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(148, 163, 184, 0.08)',
                  borderRadius: '20px', padding: '40px',
                }}>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#f8fafc', marginBottom: '8px' }}>
                    Personal Preferences
                  </h2>
                  <p style={{ color: '#94a3b8', marginBottom: '28px', fontSize: '0.9rem' }}>
                    Tell the AI what you love — food, activities, pace, anything.
                  </p>

                  <label htmlFor="preferences" className="label">Travel Preferences (optional)</label>
                  <textarea
                    id="preferences"
                    placeholder="e.g. I love street food and art museums. Avoid crowded tourist traps. Prefer walking-friendly neighborhoods. Vegetarian meals preferred."
                    className="input"
                    style={{ minHeight: '120px', resize: 'vertical', padding: '14px', lineHeight: 1.6 }}
                    value={formData.preferences}
                    onChange={(e) => setFormData({ ...formData, preferences: e.target.value })}
                  />

                  {/* Quick preference tags */}
                  <div style={{ marginTop: '16px', marginBottom: '28px' }}>
                    <p style={{ fontSize: '0.8rem', color: '#475569', marginBottom: '10px' }}>Quick add:</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {[
                        '🍜 Street food lover', '🏛️ History & museums', '🌿 Nature & hiking',
                        '🛍️ Shopping', '🎭 Arts & culture', '🏖️ Beach & relax',
                        '🌙 Nightlife', '📸 Photography spots',
                      ].map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => {
                            const clean = tag.split(' ').slice(1).join(' ');
                            setFormData((prev) => ({
                              ...prev,
                              preferences: prev.preferences
                                ? `${prev.preferences}, ${clean}`
                                : clean,
                            }));
                          }}
                          className="btn btn-ghost btn-sm"
                          style={{ fontSize: '0.8rem' }}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Trip summary */}
                  <div style={{
                    background: 'rgba(14, 165, 233, 0.05)',
                    border: '1px solid rgba(14, 165, 233, 0.15)',
                    borderRadius: '12px',
                    padding: '16px',
                    marginBottom: '28px',
                  }}>
                    <p style={{ fontSize: '0.8rem', color: '#475569', marginBottom: '8px', fontWeight: 600 }}>TRIP SUMMARY</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      {[
                        { label: 'Origin', value: formData.origin || 'Unknown' },
                        { label: 'Destination', value: formData.destination },
                        { label: 'Budget', value: `${formData.currency} ${formData.budget.toLocaleString()}` },
                        { label: 'Duration', value: `${numDays} days` },
                        { label: 'Dates', value: `${formData.startDate} → ${formData.endDate}` },
                      ].map((item) => (
                        <div key={item.label}>
                          <span style={{ fontSize: '0.75rem', color: '#475569' }}>{item.label}</span>
                          <p style={{ fontSize: '0.9rem', color: '#e2e8f0', fontWeight: 500 }}>{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {error && (
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      padding: '12px', background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      borderRadius: '10px', marginBottom: '16px',
                      color: '#fca5a5', fontSize: '0.9rem',
                    }}>
                      <AlertCircle size={16} color="#ef4444" />
                      {error}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => setStep(2)} className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }}>
                      <ChevronLeft size={18} /> Back
                    </button>
                    <button
                      id="generate-itinerary-btn"
                      onClick={handleGenerate}
                      className="btn btn-primary"
                      style={{ flex: 2, justifyContent: 'center' }}
                    >
                      <Sparkles size={18} />
                      Generate Itinerary
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Agent UI */}
        {isGenerating && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ marginBottom: '24px', textAlign: 'center' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc', marginBottom: '8px' }}>
                <span className="gradient-text">AI Agent Working...</span>
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                Planning your perfect trip to <strong style={{ color: '#0ea5e9' }}>{formData.destination}</strong>
              </p>
            </div>
            <ThinkingAgentUI
              isActive={isGenerating}
              onComplete={handleComplete}
              onError={handleError}
              requestData={formData}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}
