'use client';
import dynamic from 'next/dynamic';
import { useLanguage } from '../../lib/LanguageContext';

const DocumentChecklist = dynamic(() => import('../../components/DocumentChecklist'), {
  ssr: false,
  loading: () => <div style={{ height: '200px', background: 'var(--sidebar-bg)', borderRadius: '2px', animation: 'pulse 1.5s infinite' }} />
});

export default function ChecklistPage() {
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
        fontFamily: 'var(--font-head)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
        fontWeight: 700, color: 'var(--navy)', lineHeight: 1.2,
        letterSpacing: '-0.02em', marginBottom: '1.5rem',
      }}>
        {t("checklist.title")}
      </h1>

      {/* Body */}
      <p style={{
        fontFamily: 'var(--font-body)', fontSize: '1rem', lineHeight: 1.75,
        color: 'var(--muted)', maxWidth: 520, marginBottom: '3rem',
      }}>
        {t("checklist.desc")}
      </p>

      {/* Divider */}
      <div style={{ borderTop: '1px solid var(--border)', margin: '0 0 3rem' }} />

      {/* Checklist Component */}
      <DocumentChecklist />

      {/* Info Box */}
      <section style={{ 
        marginTop: '5rem', padding: '2rem', background: 'var(--sidebar-bg)', 
        borderRadius: '2px', border: '1px solid var(--border)' 
      }} aria-labelledby="why-checklist">
        <h2 id="why-checklist" style={{ 
          fontFamily: 'var(--font-head)', fontSize: '0.9rem', fontWeight: 700, 
          color: 'var(--navy)', marginBottom: '0.75rem' 
        }}>
          {t("checklist.why_title")}
        </h2>
        <p style={{ 
          fontFamily: 'var(--font-body)', fontSize: '0.85rem', lineHeight: 1.6, 
          color: 'var(--muted)' 
        }}>
          {t("checklist.why_desc")}
        </p>
      </section>

      {/* Footer */}
      <p style={{
        fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.1em',
        textTransform: 'uppercase', color: 'var(--muted)', marginTop: '4rem',
      }}>
        {t("checklist.persistence")}
      </p>
    </main>
  );
}
