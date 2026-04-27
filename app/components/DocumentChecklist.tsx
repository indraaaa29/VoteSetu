'use client';
import { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';

const ITEMS = [
  { id: 'aadhaar', label: 'Aadhaar Card (Identity Proof)' },
  { id: 'address', label: 'Address Proof' },
  { id: 'photo',   label: 'Passport-size Photograph' },
];

export default function DocumentChecklist() {
  const { t } = useLanguage();
  const [state, setState] = useState<Record<string, boolean>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('checklist');
    if (saved) {
      try {
        setState(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse checklist state', e);
      }
    }
    setMounted(true);
  }, []);

  const toggle = (id: string) => {
    const newState = { ...state, [id]: !state[id] };
    setState(newState);
    localStorage.setItem('checklist', JSON.stringify(newState));
  };

  const completedCount = ITEMS.filter(item => state[item.id]).length;
  const progress = Math.floor((completedCount / ITEMS.length) * 100);

  // Avoid hydration mismatch
  if (!mounted) {
    return (
      <div style={{ maxWidth: 400, opacity: 0.5 }}>
        <h2 style={{
          fontFamily: 'var(--font-head)', fontSize: '1.1rem', fontWeight: 700,
          color: 'var(--navy)', marginBottom: '1.5rem', letterSpacing: '-0.01em'
        }}>
          {t("Required Documents Checklist")}
        </h2>
        <div style={{ height: 120 }} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 400 }}>
      <h2 style={{
        fontFamily: 'var(--font-head)', fontSize: '1.1rem', fontWeight: 700,
        color: 'var(--navy)', marginBottom: '1.5rem', letterSpacing: '-0.01em'
      }}>
        {t("Required Documents Checklist")}
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
        {ITEMS.map(item => (
          <label key={item.id} style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            cursor: 'pointer', padding: '0.25rem 0'
          }}>
            <input
              type="checkbox"
              checked={!!state[item.id]}
              onChange={() => toggle(item.id)}
              style={{
                width: '1.1rem', height: '1.1rem', accentColor: 'var(--saffron)',
                cursor: 'pointer'
              }}
            />
            <span style={{
              fontFamily: 'var(--font-body)', fontSize: '0.9rem',
              color: state[item.id] ? 'var(--navy)' : 'var(--muted)',
              textDecoration: state[item.id] ? 'line-through' : 'none',
              transition: 'color 0.2s, text-decoration 0.2s'
            }}>
              {t(item.label)}
            </span>
          </label>
        ))}
      </div>

      <div style={{ marginTop: '2.5rem' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
          marginBottom: '0.6rem'
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.55rem',
            textTransform: 'uppercase', color: 'var(--muted)', letterSpacing: '0.1em', fontWeight: 600
          }}>
            {t("Readiness Meter")}
          </span>
          <span style={{
            fontFamily: 'var(--font-head)', fontSize: '1rem', fontWeight: 700,
            color: 'var(--navy)'
          }}>
            {progress}%
          </span>
        </div>

        <div style={{
          height: '6px', background: 'var(--border)', borderRadius: '3px',
          overflow: 'hidden', position: 'relative'
        }}>
          <div style={{
            height: '100%', width: `${progress}%`, background: 'var(--saffron)',
            transition: 'width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }} />
        </div>

        <p style={{
          fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--muted)',
          marginTop: '0.8rem', fontWeight: 500
        }}>
          {t("You are ")}{progress}{t("% ready for registration")}
        </p>
      </div>
    </div>
  );
}
