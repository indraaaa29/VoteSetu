'use client';

import { useState, useEffect, memo, useCallback } from 'react';
import { useLanguage } from '@/lib/LanguageContext';

const PIN_MAPPING: Record<string, { constituency: string; election: string }> = {
  "831001": {
    constituency: "home.jamshedpur_east",
    election: "home.election_april_2029"
  },
  "110001": {
    constituency: "home.new_delhi",
    election: "home.election_may_2029"
  }
};

const ConstituencySearch = memo(() => {
  const { t } = useLanguage();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ constituency: string; election: string } | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const searchPIN = useCallback((pinCode: string) => {
    if (PIN_MAPPING[pinCode]) {
      setResult(PIN_MAPPING[pinCode]);
      setError('');
      localStorage.setItem('votesetu_pin', pinCode);
    } else {
      setResult(null);
      setError(t('home.pin_error'));
      localStorage.removeItem('votesetu_pin');
    }
  }, [t]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedPin = localStorage.getItem('votesetu_pin');
    if (savedPin) {
      setPin(savedPin);
      searchPIN(savedPin);
    }
    setIsLoaded(true);
  }, [searchPIN]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setPin(value);
    setError('');

    if (value.length === 6) {
      searchPIN(value);
    } else {
      setResult(null);
    }
  }, [searchPIN]);

  if (!isLoaded) return null;

  return (
    <div style={{ margin: '2.5rem 0' }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        padding: '1.5rem',
        background: 'var(--sidebar-bg)',
        borderRadius: '8px',
        border: '1px solid var(--border)',
      }}>
        <label htmlFor="pin-input" style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--muted)',
        }}>
          {t("home.personalize")}
        </label>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <input
            id="pin-input"
            type="text"
            inputMode="numeric"
            placeholder={t("home.pin_placeholder")}
            value={pin}
            onChange={handleInputChange}
            style={{
              flex: 1,
              padding: '1rem 1.25rem',
              borderRadius: '12px',
              border: '1px solid var(--border)',
              fontFamily: 'var(--font-head)',
              fontSize: '1.1rem',
              fontWeight: 500,
              outline: 'none',
              background: 'white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              letterSpacing: '0.05em',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--saffron)';
              e.target.style.boxShadow = '0 0 0 4px rgba(255, 153, 51, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border)';
              e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.02)';
            }}
          />
        </div>

        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#DC2626',
            marginTop: '0.5rem',
            fontSize: '0.85rem',
            fontFamily: 'var(--font-body)',
          }}>
            <span>✕</span> {error}
          </div>
        )}

        {result && (
          <div style={{
            marginTop: '1.25rem',
            padding: '1.25rem',
            background: 'white',
            borderRadius: '12px',
            border: '1px solid var(--border)',
            borderLeft: '4px solid var(--saffron)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
            animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          }}>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--saffron)',
              marginBottom: '0.5rem',
              fontWeight: 600,
            }}>
              {t("home.location_detected")}
            </div>
            <div style={{
              fontFamily: 'var(--font-head)',
              fontSize: '1.25rem',
              fontWeight: 700,
              color: 'var(--navy)',
              marginBottom: '0.25rem',
              letterSpacing: '-0.01em',
            }}>
              {t(result.constituency)}
            </div>
            <div style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.9rem',
              color: 'var(--muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}>
              <span style={{ fontSize: '1rem' }}>📅</span> {t(result.election)}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
});

ConstituencySearch.displayName = 'ConstituencySearch';
export default ConstituencySearch;
