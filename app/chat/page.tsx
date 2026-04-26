'use client';
import { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

const SUGGESTIONS = [
  'Am I eligible to vote?',
  'What documents do I need?',
  'How do I find my polling booth?',
  'How do I register to vote?',
];

const DOCS_LIST = [
  { id: 'voting-process', label: 'Voting Process' },
  { id: 'eligibility',    label: 'Eligibility' },
  { id: 'required-docs',  label: 'Required Docs' },
  { id: 'registration',   label: 'Reg Guide' },
  { id: 'evm-info',       label: 'EVM Info' },
];

type Msg = {
  id: string; role: 'user' | 'assistant';
  text: string; bullets?: string[]; tags?: string[]; source?: string;
  refCode?: string; // stable reference code stored per message
};

let counter = 0;
function uid() { return `msg-${++counter}-${Date.now()}`; }
function genRef() { return `EC/QRY/${Math.floor(10000 + Math.random() * 90000)}`; }

async function getGeminiResponse(messages: Msg[]): Promise<Omit<Msg, 'id' | 'role' | 'refCode'>> {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    });
    const data = await response.json();
    if (!response.ok || data.error) {
      throw new Error(data.error || `Server error ${response.status}`);
    }
    return {
      text: data.text,
      bullets: data.bullets,
      source: 'Election Commission of India',
    };
  } catch (error: any) {
    console.error("Chat Error:", error);
    return {
      text: error.message || "I apologize, but I am currently unable to process your request. Please try again later or visit voters.eci.gov.in.",
      source: "System Error",
    };
  }
}

const B: React.CSSProperties = {
  fontFamily: 'var(--font-body)', fontSize: '0.88rem', lineHeight: 1.75, color: '#374151',
};

const WELCOME_MSG: Msg = {
  id: 'welcome-0',
  role: 'assistant',
  text: 'Welcome. I am the VoteSetu Civic Assistant — a service of the Election Commission of India. Ask any question about voter eligibility, registration, required documents, or the election process.',
  source: 'Election Commission of India — Civic Assistant',
  refCode: 'EC/QRY/00001',
};

function ChatContent() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get('q');

  const [msgs, setMsgs] = useState<Msg[]>([WELCOME_MSG]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const sentInitial = useRef(false);

  useEffect(() => {
    if (initialQ && !sentInitial.current) {
      sentInitial.current = true;
      send(initialQ);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs, typing]);

  async function send(text: string) {
    if (!text.trim() || typing) return;
    const uMsg: Msg = { id: uid(), role: 'user', text };
    const newMsgs = [...msgs, uMsg];
    setMsgs(newMsgs);
    setInput('');
    setTyping(true);

    try {
      const ans = await getGeminiResponse(newMsgs);
      setMsgs(prev => [...prev, {
        id: uid(),
        role: 'assistant',
        refCode: genRef(),
        ...ans,
      }]);
    } catch {
      setMsgs(prev => [...prev, {
        id: uid(),
        role: 'assistant',
        refCode: genRef(),
        text: 'An unexpected error occurred. Please try again.',
        source: 'System Error',
      }]);
    } finally {
      setTyping(false);
    }
  }

  return (
    <main style={{ display: 'flex', height: 'calc(100vh - var(--nav-h))', overflow: 'hidden' }}>

      {/* Sidebar */}
      <aside style={{
        width: 200, flexShrink: 0, borderRight: '1px solid var(--border)',
        background: 'var(--sidebar-bg)', overflowY: 'auto', padding: '1.5rem 0',
      }}>
        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.52rem', letterSpacing: '0.16em',
          textTransform: 'uppercase', color: 'var(--muted)', padding: '0 1.25rem', marginBottom: '0.25rem',
        }}>Documents</p>
        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.48rem', letterSpacing: '0.1em',
          textTransform: 'uppercase', color: 'var(--muted)', padding: '0 1.25rem', marginBottom: '0.75rem', opacity: 0.6,
        }}>ID: VOTE-DOC-SYS</p>
        {DOCS_LIST.map(d => (
          <a key={d.id} href={`/documents?doc=${d.id}`} style={{
            display: 'block', padding: '0.65rem 1.25rem',
            fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: '#6B7280',
            borderLeft: '2px solid transparent', transition: 'color 0.1s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--navy)')}
          onMouseLeave={e => (e.currentTarget.style.color = '#6B7280')}
          >
            {d.label}
          </a>
        ))}
      </aside>

      {/* Chat area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Header */}
        <div style={{
          padding: '1rem 2.5rem', borderBottom: '1px solid var(--border)',
          background: 'var(--bg)', flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
            <span style={{ fontFamily: 'var(--font-head)', fontSize: '0.95rem', fontWeight: 600, color: 'var(--navy)' }}>
              Civic Assistant
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.1em', color: 'var(--green)' }}>
              ● OPERATIONAL
            </span>
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--muted)' }}>
            Querying Official Electoral Roll Data
          </p>
        </div>

        {/* Suggestions */}
        <div style={{
          padding: '0.6rem 2.5rem', borderBottom: '1px solid var(--border)',
          display: 'flex', gap: '0.5rem', flexWrap: 'wrap', flexShrink: 0, background: 'var(--bg)',
        }}>
          {SUGGESTIONS.map(s => (
            <button key={s} onClick={() => send(s)} style={{
              fontFamily: 'var(--font-body)', fontSize: '0.72rem', border: '1px solid var(--border)',
              background: '#fff', color: 'var(--navy)', padding: '0.3rem 0.75rem',
              cursor: 'pointer', transition: 'border-color 0.1s',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--navy)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '2rem 2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {msgs.map(m => m.role === 'user' ? (
            <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.35rem' }}>You</span>
              <div style={{ backgroundColor: '#F3F4F6', padding: '0.65rem 1rem', maxWidth: '55%' }}>
                <p style={B}>{m.text}</p>
              </div>
            </div>
          ) : (
            <div key={m.id} style={{
              borderLeft: '3px solid var(--saffron)', background: 'var(--response-bg)',
              padding: '1rem 1.25rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem', paddingBottom: '0.6rem', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--navy)' }}>Response</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', fontWeight: 600, color: 'var(--green)', letterSpacing: '0.1em' }}>● Verified</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', color: 'var(--muted)', marginLeft: 'auto' }}>{m.refCode}</span>
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                {m.text.split("\n").map((line, index) => {
                  const trimmed = line.trim();
                  if (trimmed.startsWith("- ")) {
                    return <li key={index} style={{ ...B, position: 'relative', paddingLeft: '1.1rem' }}>
                      <span style={{ position: 'absolute', left: 0 }}>•</span>
                      {trimmed.replace("- ", "")}
                    </li>;
                  }
                  return <p key={index} style={{ ...B, marginBottom: '0.4rem' }}>{line}</p>;
                })}
              </ul>
              {m.bullets && (
                <ul style={{ paddingLeft: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '0.65rem' }}>
                  {m.bullets.map(b => <li key={b} style={B}>{b}</li>)}
                </ul>
              )}
              {m.tags && (
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.65rem' }}>
                  {m.tags.map(t => (
                    <span key={t} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', border: '1px solid var(--border)', padding: '0.15rem 0.5rem', color: 'var(--navy)', letterSpacing: '0.06em' }}>{t}</span>
                  ))}
                </div>
              )}
              {m.source && (
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.52rem', color: 'var(--green)', letterSpacing: '0.08em', paddingTop: '0.6rem', borderTop: '1px solid var(--border)' }}>
                  ✓ Source: {m.source}
                </p>
              )}
            </div>
          ))}

          {typing && (
            <div style={{ borderLeft: '3px solid var(--border)', padding: '0.75rem 1rem', background: '#fff' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.08em' }}>Processing · · ·</span>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Input */}
        <div style={{
          borderTop: '1px solid var(--border)', padding: '0.85rem 2.5rem',
          display: 'flex', gap: '0.65rem', background: '#fff', flexShrink: 0,
        }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send(input)}
            placeholder="Ask about elections, eligibility, or documents..."
            style={{
              flex: 1, border: '1px solid var(--border)', padding: '0.6rem 1rem',
              fontFamily: 'var(--font-body)', fontSize: '0.88rem', outline: 'none',
              background: 'var(--bg)', color: 'var(--navy)', borderRadius: 0,
              transition: 'border-color 0.1s',
            }}
            onFocus={e => (e.target.style.borderColor = 'var(--navy)')}
            onBlur={e => (e.target.style.borderColor = 'var(--border)')}
          />
          <button onClick={() => send(input)} style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            background: 'var(--saffron)', color: 'var(--navy)',
            border: 'none', padding: '0 1.5rem', cursor: 'pointer',
            transition: 'opacity 0.1s',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            Ask
          </button>
        </div>
      </div>
    </main>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)', fontSize: '0.8rem' }}>Loading…</div>}>
      <ChatContent />
    </Suspense>
  );
}
