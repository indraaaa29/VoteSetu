'use client';
import DocumentChecklist from '../components/DocumentChecklist';
import { useLanguage } from '../LanguageContext';

export default function ChecklistPage() {
  const { t } = useLanguage();
  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '72px 2rem 6rem' }}>
      
      {/* System label */}
      <p style={{
        fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.16em',
        textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '2.5rem',
      }}>
        {t("Election Commission of India · Civic Information System")}
      </p>

      {/* Headline */}
      <h1 style={{
        fontFamily: 'var(--font-head)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
        fontWeight: 700, color: 'var(--navy)', lineHeight: 1.2,
        letterSpacing: '-0.02em', marginBottom: '1.5rem',
      }}>
        {t("Registration Readiness.")}
      </h1>

      {/* Body */}
      <p style={{
        fontFamily: 'var(--font-body)', fontSize: '1rem', lineHeight: 1.75,
        color: 'var(--muted)', maxWidth: 520, marginBottom: '3rem',
      }}>
        {t("Use this interactive checklist to track the documents you need for voter registration. Your progress is saved automatically on this device.")}
      </p>

      {/* Divider */}
      <div style={{ borderTop: '1px solid var(--border)', margin: '0 0 3rem' }} />

      {/* Checklist Component */}
      <DocumentChecklist />

      {/* Info Box */}
      <div style={{ 
        marginTop: '5rem', padding: '2rem', background: 'var(--sidebar-bg)', 
        borderRadius: '2px', border: '1px solid var(--border)' 
      }}>
        <h3 style={{ 
          fontFamily: 'var(--font-head)', fontSize: '0.9rem', fontWeight: 700, 
          color: 'var(--navy)', marginBottom: '0.75rem' 
        }}>
          {t("Why these documents?")}
        </h3>
        <p style={{ 
          fontFamily: 'var(--font-body)', fontSize: '0.85rem', lineHeight: 1.6, 
          color: 'var(--muted)' 
        }}>
          {t("To register as a new voter (Form 6), the Election Commission requires proof of identity, proof of address, and a recent photograph to issue your EPIC (Voter ID) card.")}
        </p>
      </div>

      {/* Footer */}
      <p style={{
        fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.1em',
        textTransform: 'uppercase', color: 'var(--muted)', marginTop: '4rem',
      }}>
        {t("Source: voters.eci.gov.in · Data Persistence: Local Storage")}
      </p>
    </main>
  );
}
