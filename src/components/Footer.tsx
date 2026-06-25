'use client';

import Link from 'next/link';
import { Plane, Twitter, Github, Linkedin, Mail, Heart } from 'lucide-react';

const footerLinks = {
  Product: [
    { label: 'Plan a Trip', href: '/plan-trip' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'How It Works', href: '/#how-it-works' },
  ],
  Account: [
    { label: 'Login', href: '/login' },
    { label: 'Register', href: '/register' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
  ],
};

const socialLinks = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Mail, href: 'mailto:hello@wanderlust.ai', label: 'Email' },
];

export function Footer() {
  return (
    <footer style={{
      background: '#020617',
      borderTop: '1px solid rgba(148, 163, 184, 0.08)',
      paddingTop: '64px',
    }}>
      <div className="container">
        {/* Top: Logo + Links */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr',
          gap: '48px',
          marginBottom: '48px',
        }}>
          {/* Brand */}
          <div>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: 36, height: 36,
                background: 'linear-gradient(135deg, #0ea5e9, #f97316)',
                borderRadius: '10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Plane size={18} color="white" />
              </div>
              <span style={{
                fontFamily: 'var(--font-poppins)', fontWeight: 700, fontSize: '1.1rem',
                background: 'linear-gradient(135deg, #0ea5e9, #f97316)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                Wanderlust AI
              </span>
            </Link>
            <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.7, maxWidth: '280px' }}>
              Your autonomous AI travel concierge. Plan smarter trips with real-time data and budget-aware itineraries.
            </p>
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              {socialLinks.map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  aria-label={social.label}
                  style={{
                    width: 36, height: 36,
                    background: 'rgba(30, 41, 59, 0.6)',
                    border: '1px solid rgba(148, 163, 184, 0.1)',
                    borderRadius: '8px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#94a3b8',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color = '#0ea5e9';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(14, 165, 233, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = '#94a3b8';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(148, 163, 184, 0.1)';
                  }}
                >
                  <social.icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {title}
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      style={{ fontSize: '0.9rem', color: '#475569', transition: 'color 0.2s ease' }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#94a3b8'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#475569'; }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(148, 163, 184, 0.06)',
          padding: '24px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          <p style={{ fontSize: '0.85rem', color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
            © 2025 Wanderlust AI. Made with <Heart size={14} color="#ef4444" fill="#ef4444" /> for explorers.
          </p>
          <p style={{ fontSize: '0.85rem', color: '#334155' }}>
            Powered by LangGraph + OpenAI
          </p>
        </div>
      </div>
    </footer>
  );
}
