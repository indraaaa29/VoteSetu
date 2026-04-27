'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/lib/LanguageContext';

const LINKS = [
  { href: '/',           label: 'nav.home' },
  { href: '/documents',  label: 'nav.documents' },
  { href: '/checklist',  label: 'nav.checklist' },
  { href: '/chat',       label: 'nav.chat' },
];

export default function Nav() {
  const path = usePathname();
  const { lang, setLang, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="nav-container" style={{
      position: 'fixed', top: 0, left: 0, right: 0, height: 'var(--nav-h)',
      background: 'var(--bg)', borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 2rem', zIndex: 100,
    }}>
      <style jsx>{`
        @media (max-width: 900px) {
          .nav-container { padding: 0 1rem !important; }
          .desktop-links { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
          .logo-text { font-size: 0.85rem !important; }
        }
        .mobile-overlay {
          position: fixed; top: var(--nav-h); left: 0; right: 0; bottom: 0;
          background: #fff; z-index: 99; display: flex; flex-direction: column;
          padding: 2rem; gap: 1.5rem;
        }
      `}</style>

      <Link href="/" className="logo-text" style={{
        fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '0.95rem',
        color: 'var(--navy)', letterSpacing: '-0.01em',
      }}>
        Vote<span style={{ color: 'var(--saffron)' }}>Setu</span>
      </Link>

      {/* Desktop Links */}
      <div className="desktop-links" style={{ display: 'flex', gap: '0' }}>
        {LINKS.map(({ href, label }) => {
          const active = path === href || (href !== '/' && path.startsWith(href));
          return (
            <Link key={href} href={href} className="nav-link-item" style={{
              fontFamily: 'var(--font-body)', fontSize: '0.82rem', fontWeight: active ? 600 : 400,
              color: active ? 'var(--navy)' : 'var(--muted)',
              padding: '0 1rem', height: 'var(--nav-h)', display: 'flex', alignItems: 'center',
              borderBottom: `2px solid ${active ? 'var(--saffron)' : 'transparent'}`,
              transition: 'color 0.15s, border-color 0.15s',
            }}>
              {t(label)}
            </Link>
          );
        })}
        <button
          onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
          className="lang-toggle"
          style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 600,
            color: 'var(--navy)', marginLeft: '1rem', display: 'flex', alignItems: 'center',
            gap: '0.3rem'
          }}
        >
          <span style={{ opacity: lang === 'en' ? 1 : 0.5 }}>EN</span>
          <span style={{ opacity: 0.5 }}>|</span>
          <span style={{ opacity: lang === 'hi' ? 1 : 0.5, fontSize: '0.85rem' }}>हिंदी</span>
        </button>
      </div>

      {/* Mobile Menu Button */}
      <div style={{ display: 'none', alignItems: 'center', gap: '1rem' }} className="mobile-menu-btn">
        <button
          onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
          style={{
            background: 'transparent', border: 'none',
            fontFamily: 'var(--font-mono)', fontSize: '0.65rem', fontWeight: 600, color: 'var(--navy)'
          }}
        >
          {lang === 'en' ? 'HI' : 'EN'}
        </button>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          style={{ background: 'none', border: 'none', padding: '0.5rem', cursor: 'pointer' }}
        >
          <div style={{ width: '18px', height: '2px', background: 'var(--navy)', marginBottom: '4px', transition: '0.3s' }} />
          <div style={{ width: '18px', height: '2px', background: 'var(--navy)', marginBottom: '4px', transition: '0.3s' }} />
          <div style={{ width: '18px', height: '2px', background: 'var(--navy)', transition: '0.3s' }} />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="mobile-overlay" onClick={() => setIsOpen(false)}>
          {LINKS.map(({ href, label }) => (
            <Link key={href} href={href} style={{
              fontFamily: 'var(--font-head)', fontSize: '1.5rem', fontWeight: 600,
              color: path === href ? 'var(--saffron)' : 'var(--navy)'
            }}>
              {t(label)}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
