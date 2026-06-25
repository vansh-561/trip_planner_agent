'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Plane, Eye, EyeOff, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || 'Registration failed');
      setIsLoading(false);
      return;
    }

    // Auto sign-in after registration
    const signInResult = await signIn('credentials', {
      email: formData.email,
      password: formData.password,
      redirect: false,
    });

    if (signInResult?.error) {
      router.push('/login');
    } else {
      router.push('/dashboard');
    }
  };

  const passwordStrength = formData.password.length >= 8 ? 'strong' : formData.password.length >= 5 ? 'medium' : 'weak';

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Left: Form */}
      <div style={{
        width: '520px',
        background: '#0f172a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px',
        borderRight: '1px solid rgba(148, 163, 184, 0.08)',
      }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '40px' }}>
              <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg, #0ea5e9, #f97316)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Plane size={20} color="white" />
              </div>
              <span style={{ fontFamily: 'var(--font-poppins)', fontWeight: 700, fontSize: '1.2rem', background: 'linear-gradient(135deg, #0ea5e9, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Wanderlust AI
              </span>
            </div>

            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', marginBottom: '8px' }}>Create your account</h1>
            <p style={{ color: '#94a3b8', marginBottom: '32px' }}>
              Already have an account?{' '}
              <Link href="/login" style={{ color: '#0ea5e9', fontWeight: 500 }}>Sign in</Link>
            </p>

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

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label htmlFor="reg-name" className="label">Full name</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                  <input id="reg-name" type="text" placeholder="Jane Doe" className="input" style={{ paddingLeft: '42px' }}
                    value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required autoComplete="name" />
                </div>
              </div>

              <div>
                <label htmlFor="reg-email" className="label">Email address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                  <input id="reg-email" type="email" placeholder="you@example.com" className="input" style={{ paddingLeft: '42px' }}
                    value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required autoComplete="email" />
                </div>
              </div>

              <div>
                <label htmlFor="reg-password" className="label">Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                  <input id="reg-password" type={showPassword ? 'text' : 'password'} placeholder="Min. 8 characters" className="input" style={{ paddingLeft: '42px', paddingRight: '42px' }}
                    value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required autoComplete="new-password" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#475569' }}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {/* Password strength */}
                {formData.password && (
                  <div style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
                    {['weak', 'medium', 'strong'].map((level, i) => (
                      <div key={i} style={{
                        flex: 1, height: '3px', borderRadius: '2px',
                        background: i <= (['weak', 'medium', 'strong'].indexOf(passwordStrength))
                          ? (passwordStrength === 'strong' ? '#10b981' : passwordStrength === 'medium' ? '#f59e0b' : '#ef4444')
                          : 'rgba(148, 163, 184, 0.2)',
                        transition: 'background 0.3s ease',
                      }} />
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="reg-confirm-password" className="label">Confirm password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                  <input id="reg-confirm-password" type={showPassword ? 'text' : 'password'} placeholder="Repeat password" className="input" style={{ paddingLeft: '42px' }}
                    value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} required autoComplete="new-password" />
                  {formData.confirmPassword && formData.password === formData.confirmPassword && (
                    <CheckCircle size={16} color="#10b981" style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  )}
                </div>
              </div>

              <button id="register-submit" type="submit" className="btn btn-primary"
                style={{ marginTop: '8px', justifyContent: 'center', width: '100%' }} disabled={isLoading}>
                {isLoading ? (
                  <><div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin-slow 0.8s linear infinite' }} />Creating account...</>
                ) : (
                  <>Create Free Account <ArrowRight size={16} /></>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Right: Visual panel */}
      <div style={{
        flex: 1,
        background: 'linear-gradient(135deg, #0c2d4a 0%, #0f172a 50%, #020617 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '48px', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '20%', right: '10%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,165,233,0.1) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '5%', width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)', filter: 'blur(40px)' }} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          style={{ textAlign: 'center', zIndex: 1 }}
        >
          <div style={{ fontSize: '80px', marginBottom: '32px' }}>✈️</div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc', marginBottom: '16px', lineHeight: 1.2 }}>
            Travel Smarter<br /><span className="gradient-text">with AI</span>
          </h2>
          <p style={{ color: '#64748b', lineHeight: 1.7, maxWidth: '320px', margin: '0 auto 40px' }}>
            Get personalized itineraries crafted by an AI agent that searches real-time data for the best deals.
          </p>

          {/* Feature checklist */}
          {[
            'Real-time hotel & activity prices',
            'Budget-aware route planning',
            'Regenerate any day instantly',
            'Download & share your itinerary',
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', justifyContent: 'center' }}
            >
              <CheckCircle size={18} color="#10b981" />
              <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>{feature}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
