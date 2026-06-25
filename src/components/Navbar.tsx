'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { Plane, Menu, X, LayoutDashboard, LogOut, LogIn, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: 'all 0.3s ease',
        background: isScrolled
          ? 'rgba(2, 6, 23, 0.85)'
          : 'transparent',
        backdropFilter: isScrolled ? 'blur(16px)' : 'none',
        borderBottom: isScrolled ? '1px solid rgba(148, 163, 184, 0.08)' : 'none',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px' }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: 36, height: 36,
            background: 'linear-gradient(135deg, #0ea5e9, #f97316)',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Plane size={18} color="white" />
          </div>
          <span style={{
            fontFamily: 'var(--font-poppins)',
            fontWeight: 700,
            fontSize: '1.1rem',
            background: 'linear-gradient(135deg, #0ea5e9, #f97316)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Wanderlust AI
          </span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {session ? (
            <>
              <Link href="/dashboard" className="btn btn-ghost btn-sm" style={{ display: 'flex', gap: '6px' }}>
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
              <Link href="/plan-trip" className="btn btn-primary btn-sm">
                <Sparkles size={16} />
                Plan Trip
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="btn btn-ghost btn-sm"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-ghost btn-sm">
                <LogIn size={16} />
                Login
              </Link>
              <Link href="/register" className="btn btn-primary btn-sm">
                Get Started Free
              </Link>
            </>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="btn btn-ghost btn-sm"
            style={{ display: 'none' }}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              background: 'rgba(2, 6, 23, 0.95)',
              backdropFilter: 'blur(16px)',
              borderBottom: '1px solid rgba(148, 163, 184, 0.08)',
              padding: '16px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            {session ? (
              <>
                <Link href="/dashboard" className="btn btn-ghost" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                <Link href="/plan-trip" className="btn btn-primary" onClick={() => setIsMenuOpen(false)}>Plan Trip</Link>
                <button onClick={() => signOut({ callbackUrl: '/' })} className="btn btn-ghost">Logout</button>
              </>
            ) : (
              <>
                <Link href="/login" className="btn btn-ghost" onClick={() => setIsMenuOpen(false)}>Login</Link>
                <Link href="/register" className="btn btn-primary" onClick={() => setIsMenuOpen(false)}>Get Started Free</Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
