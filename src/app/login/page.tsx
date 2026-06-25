'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Mail, Lock, Plane, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await signIn('credentials', {
      email: formData.email,
      password: formData.password,
      redirect: false,
    });

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '420px' }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '40px' }}>
          <div style={{
            width: 40, height: 40,
            background: 'linear-gradient(135deg, #0ea5e9, #f97316)',
            borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Plane size={20} color="white" />
          </div>
          <span style={{
            fontFamily: 'var(--font-poppins)', fontWeight: 700, fontSize: '1.2rem',
            background: 'linear-gradient(135deg, #0ea5e9, #f97316)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Wanderlust AI
          </span>
        </div>

        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', marginBottom: '8px' }}>
          Welcome back
        </h1>
        <p style={{ color: '#94a3b8', marginBottom: '32px' }}>
          Don&apos;t have an account?{' '}
          <Link href="/register" style={{ color: '#0ea5e9', fontWeight: 500 }}>Create one free</Link>
        </p>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '12px 16px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '10px',
              marginBottom: '24px',
              color: '#fca5a5',
              fontSize: '0.9rem',
            }}
          >
            <AlertCircle size={16} color="#ef4444" />
            {error}
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label htmlFor="login-email" className="label">Email address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
              <input
                id="login-email"
                type="email"
                placeholder="you@example.com"
                className="input"
                style={{ paddingLeft: '42px' }}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <label htmlFor="login-password" className="label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="input"
                style={{ paddingLeft: '42px', paddingRight: '42px' }}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: '#475569',
                }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            id="login-submit"
            type="submit"
            className="btn btn-primary"
            style={{ marginTop: '8px', justifyContent: 'center', width: '100%' }}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin-slow 0.8s linear infinite' }} />
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Left: Travel imagery panel */}
      <div style={{
        flex: 1,
        background: 'linear-gradient(135deg, #020617 0%, #0f172a 40%, #0c2d4a 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative orbs */}
        <div style={{ position: 'absolute', top: '15%', left: '10%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,165,233,0.12) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', bottom: '15%', right: '5%', width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.1) 0%, transparent 70%)', filter: 'blur(40px)' }} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          style={{ textAlign: 'center', zIndex: 1 }}
        >
          {/* Globe SVG illustration */}
          <div style={{ fontSize: '80px', marginBottom: '32px' }}>🌍</div>

          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc', marginBottom: '16px', lineHeight: 1.2 }}>
            Plan Your Next<br />
            <span className="gradient-text">Adventure</span>
          </h2>
          <p style={{ color: '#64748b', lineHeight: 1.7, maxWidth: '320px', margin: '0 auto' }}>
            Join thousands of travelers using AI to build perfect, budget-conscious itineraries in seconds.
          </p>

          {/* Destinations marquee */}
          <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { dest: '🗼 Paris, France', budget: '$350 budget', days: '3 days' },
              { dest: '🏯 Tokyo, Japan', budget: '$800 budget', days: '7 days' },
              { dest: '🌴 Bali, Indonesia', budget: '$500 budget', days: '5 days' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.15 }}
                style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(148, 163, 184, 0.08)',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                }}
              >
                <span style={{ fontSize: '0.9rem', color: '#e2e8f0' }}>{item.dest}</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#0ea5e9', background: 'rgba(14,165,233,0.1)', padding: '2px 8px', borderRadius: '20px' }}>{item.budget}</span>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{item.days}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right: Login form */}
      <div style={{
        width: '480px',
        background: '#0f172a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px',
        borderLeft: '1px solid rgba(148, 163, 184, 0.08)',
      }}>
        <Suspense fallback={<div style={{ color: '#94a3b8' }}>Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
