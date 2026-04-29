'use client';
import { memo } from 'react';

type Msg = {
  id: string; role: 'user' | 'assistant';
  text: string; bullets?: string[]; tags?: string[]; source?: string;
  refCode?: string;
};

const B: React.CSSProperties = {
  fontFamily: 'var(--font-body)', fontSize: '0.88rem', lineHeight: 1.75, color: '#374151',
};

const MessageItem = memo(({ m, t }: { m: Msg, t: any }) => {
  if (m.role === 'user') {
    return (
      <article style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.35rem' }}>{t("chat.you")}</span>
        <div style={{ backgroundColor: '#F3F4F6', padding: '0.65rem 1rem', maxWidth: '55%' }}>
          <p style={B}>{m.text}</p>
        </div>
      </article>
    );
  }

  return (
    <article style={{
      borderLeft: '3px solid var(--saffron)', background: 'var(--response-bg)',
      padding: '1rem 1.25rem',
    }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem', paddingBottom: '0.6rem', borderBottom: '1px solid var(--border)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--navy)' }}>{t("chat.response")}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', fontWeight: 600, color: 'var(--green)', letterSpacing: '0.1em' }}>● {t("chat.verified")}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', color: 'var(--muted)', marginLeft: 'auto' }}>{m.refCode}</span>
      </header>
      <div style={{ margin: 0, padding: 0 }}>
        {m.text.split("\n").map((line: string, index: number) => {
          const trimmed = line.trim();
          if (trimmed.startsWith("- ")) {
            return <li key={index} style={{ ...B, position: 'relative', paddingLeft: '1.1rem', listStyle: 'none' }}>
              <span style={{ position: 'absolute', left: 0 }} aria-hidden="true">•</span>
              {trimmed.replace("- ", "")}
            </li>;
          }
          return <p key={index} style={{ ...B, marginBottom: '0.4rem' }}>{line}</p>;
        })}
      </div>
      {m.bullets && (
        <ul style={{ paddingLeft: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '0.65rem' }}>
          {m.bullets.map(b => <li key={b} style={B}>{b}</li>)}
        </ul>
      )}
      {m.source && (
        <footer style={{ fontFamily: 'var(--font-mono)', fontSize: '0.52rem', color: 'var(--green)', letterSpacing: '0.08em', paddingTop: '0.6rem', borderTop: '1px solid var(--border)' }}>
          ✓ Source: {t(m.source)}
        </footer>
      )}
    </article>
  );
});

MessageItem.displayName = 'MessageItem';

export const MessageList = memo(({ msgs, typing, t, endRef }: { 
  msgs: Msg[], 
  typing: boolean, 
  t: any, 
  endRef: React.RefObject<HTMLDivElement | null> 
}) => (
  <main className="chat-messages" role="log" aria-label="Chat messages" aria-live="polite" style={{ flex: 1, overflowY: 'auto', padding: '2rem 2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
    {msgs.map(m => <MessageItem key={m.id} m={m} t={t} />)}
    {typing && (
      <div style={{ borderLeft: '3px solid var(--border)', padding: '0.75rem 1rem', background: '#fff' }} role="status">
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.08em' }}>{t("chat.processing")}</span>
      </div>
    )}
    <div ref={endRef} />
  </main>
));

MessageList.displayName = 'MessageList';
