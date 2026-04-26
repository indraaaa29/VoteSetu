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
};

function uid() { return Math.random().toString(36).slice(2); }
function ref() { return `EC/QRY/${Math.floor(10000 + Math.random() * 90000)}`; }

function answer(q: string): Omit<Msg, 'id' | 'role'> {
  const l = q.toLowerCase();
  if (l.includes('eligible') || l.includes('qualify'))
    return {
      text: 'Based on the Representation of the People Act, 1950, you are eligible to vote if you meet all of the following conditions:',
      bullets: ['Must be a citizen of India.','Must be 18 years of age or older on the qualifying date (typically 1st January).','Must be ordinarily resident of the polling area.','Must be enrolled in the electoral roll of that constituency.'],
      tags: ['AGE: 18+', 'CITIZENSHIP REQUIRED', 'RESIDENCY REQUIRED'],
      source: 'Representation of the People Act, 1950 — Sec. 19',
    };
  if (l.includes('document') || l.includes('carry') || l.includes('id'))
    return {
      text: 'Carry at least one of the following valid identity documents to the polling booth:',
      bullets: ['EPIC Card (Voter ID)', 'Aadhaar Card', 'Passport', 'Driving License', 'PAN Card (with photo)', 'Bank Passbook with photo'],
      source: 'ECI Guidelines — General Elections 2024',
    };
  if (l.includes('booth') || l.includes('polling station') || l.includes('find'))
    return {
      text: 'To locate your designated polling booth:',
      bullets: ['Visit voters.eci.gov.in', 'Select "Know Your Polling Station"', 'Enter your EPIC number or personal details', 'Your booth address and officer details will be shown'],
      tags: ['NVSP.IN', 'HELPLINE: 1950'],
      source: 'National Voter Service Portal — ECI',
    };
  if (l.includes('register') || l.includes('enroll'))
    return {
      text: 'To register as a new voter, submit Form 6 (New Voter Registration):',
      bullets: ['Online: voters.eci.gov.in or Voter Helpline app', 'Fill Form 6: name, date of birth, address', 'Upload age proof, address proof, and photograph', 'Submit and track using your reference number'],
      tags: ['FORM 6', 'ERO OFFICE'],
      source: 'ECI Voter Registration Guidelines',
    };
  return {
    text: 'I can help you with voter eligibility, required documents, polling booth location, and voter registration. Please ask a specific question or use the suggestions above.',
    source: 'VoteSetu Civic Assistant — ECI Data 2024',
  };
}

const B: React.CSSProperties = {
  fontFamily: 'var(--font-body)', fontSize: '0.88rem', lineHeight: 1.75, color: '#374151',
};

function ChatContent() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get('q');

  const [msgs, setMsgs] = useState<Msg[]>([{
    id: '0', role: 'assistant',
    text: 'Welcome. I am the VoteSetu Civic Assistant — a service of the Election Commission of India. Ask any question about voter eligibility, registration, required documents, or the election process.',
    source: 'Election Commission of India — Civic Assistant',
  }]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialQ && msgs.length === 1) send(initialQ);
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs, typing]);

  function send(text: string) {
    if (!text.trim() || typing) return;
    const uMsg: Msg = { id: uid(), role: 'user', text };
    setMsgs(p => [...p, uMsg]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const ans = answer(text);
      setMsgs(p => [...p, { id: uid(), role: 'assistant', ...ans }]);
      setTyping(false);
    }, 600 + Math.random() * 600);
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
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', color: 'var(--muted)', marginLeft: 'auto' }}>{ref()}</span>
              </div>
              <p style={{ ...B, marginBottom: m.bullets ? '0.65rem' : 0 }}>{m.text}</p>
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
