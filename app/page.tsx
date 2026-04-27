'use client';
import Link from 'next/link';
import ConstituencySearch from '../components/ConstituencySearch';
import { useLanguage } from '../lib/LanguageContext';

const STATS = [
  { value: '96.8 Cr',   label: 'home.registered_voters' },
  { value: '67.4%',     label: 'home.voter_turnout' },
  { value: '543',       label: 'home.constituencies' },
];

const ACTIONS = [
  { href: '/documents', arrow: '→', title: 'home.understand_title', desc: 'home.understand_desc' },
  { href: '/checklist', arrow: '→', title: 'home.checklist_title',  desc: 'home.checklist_desc' },
  { href: '/chat',      arrow: '→', title: 'home.assistant_title',  desc: 'home.assistant_desc' },
];

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '72px 2rem 6rem' }}>

      {/* System label */}
      <p style={{
        fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.16em',
        textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '2.5rem',
      }}>
        {t("home.footer_eci")}
      </p>

      {/* Headline */}
      <h1 style={{
        fontFamily: 'var(--font-head)', fontSize: 'clamp(2.2rem, 5vw, 3.25rem)',
        fontWeight: 700, color: 'var(--navy)', lineHeight: 1.1,
        letterSpacing: '-0.02em', marginBottom: '1.25rem',
      }}>
        {t("home.hero_title")}
      </h1>

      {/* Body */}
      <p style={{
        fontFamily: 'var(--font-body)', fontSize: '1rem', lineHeight: 1.75,
        color: 'var(--muted)', maxWidth: 520, marginBottom: '3rem',
      }}>
        {t("home.hero_desc")}
      </p>

      {/* Divider */}
      <div style={{ borderTop: '1px solid var(--border)', margin: '0 0 2.5rem' }} />

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0', marginBottom: '2.5rem' }}>
        {STATS.map((s, i) => (
          <div key={s.label} style={{
            padding: '0 0 0 1.5rem',
            borderLeft: i > 0 ? '1px solid var(--border)' : 'none',
          }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: '1.6rem', fontWeight: 700,
              color: 'var(--navy)', marginBottom: '0.2rem', letterSpacing: '-0.02em',
            }}>
              {s.value}
            </div>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.12em',
              textTransform: 'uppercase', color: 'var(--muted)',
            }}>
              {t(s.label)}
            </div>
          </div>
        ))}
      </div>

      {/* Personalization Section */}
      <ConstituencySearch />

      {/* Divider */}
      <div style={{ borderTop: '1px solid var(--border)', margin: '0 0 0' }} />

      {/* Actions */}
      {ACTIONS.map((a, i) => (
        <Link key={a.title} href={a.href} style={{
          display: 'grid', gridTemplateColumns: '1.5rem 1fr auto',
          alignItems: 'center', gap: '1rem',
          padding: '1.25rem 0',
          borderBottom: '1px solid var(--border)',
          color: 'var(--navy)', textDecoration: 'none',
          transition: 'background 0.1s',
        }}>
          <span style={{ fontFamily: 'var(--font-head)', fontSize: '1.1rem', color: 'var(--saffron)', fontWeight: 700 }}>
            {a.arrow}
          </span>
          <span style={{ fontFamily: 'var(--font-head)', fontSize: '0.95rem', fontWeight: 600, color: 'var(--navy)' }}>
            {t(a.title)}
          </span>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--muted)', whiteSpace: 'nowrap' }}>
            {t(a.desc)}
          </span>
        </Link>
      ))}

      {/* Footer */}
      <p style={{
        fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.1em',
        textTransform: 'uppercase', color: 'var(--muted)', marginTop: '3rem',
      }}>
        {t("home.footer_source")}
      </p>
    </main>
  );
}
