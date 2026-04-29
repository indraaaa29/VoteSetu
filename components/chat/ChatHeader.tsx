'use client';
import { memo } from 'react';

export const ChatHeader = memo(({ t, lang }: { t: any, lang: string }) => (
  <header className="chat-header" style={{
    padding: '1rem 2.5rem', borderBottom: '1px solid var(--border)',
    background: 'var(--bg)', flexShrink: 0,
  }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
      <h2 style={{ fontFamily: 'var(--font-head)', fontSize: '0.9rem', fontWeight: 700, color: 'var(--navy)', marginRight: 'auto', margin: 0 }}>
        {t("chat.title")}
      </h2>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.1em', color: 'var(--green)' }}>
        ● {lang === 'hi' ? 'सक्रिय' : 'OPERATIONAL'}
      </span>
    </div>
    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--muted)' }}>
      {t("chat.subtitle")}
    </p>
  </header>
));

ChatHeader.displayName = 'ChatHeader';
