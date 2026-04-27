'use client';
import { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '../../lib/LanguageContext';

const SUGGESTIONS = [
  'chat.suggestion_eligibility',
  'chat.suggestion_docs',
  'chat.suggestion_booth',
  'chat.suggestion_register',
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

async function getGeminiResponse(messages: Msg[], language: string): Promise<Omit<Msg, 'id' | 'role' | 'refCode'>> {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, language }),
    });
    const data = await response.json();
    if (!response.ok || data.error) {
      throw new Error(data.error || `Server error ${response.status}`);
    }
    return {
      text: data.text,
      bullets: data.bullets,
      source: data.source || 'Election Commission of India',
    };
  } catch (error: unknown) {
    return {
      text: error instanceof Error ? error.message : "I apologize, but I am currently unable to process your request. Please try again later or visit voters.eci.gov.in.",
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
  const { lang, isManual, t } = useLanguage();

  const [msgs, setMsgs] = useState<Msg[]>([WELCOME_MSG]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [lastUsedLang, setLastUsedLang] = useState<'en' | 'hi'>(lang);
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
    
    // Language priority: Manual selection > Auto-detection
    let targetLang = lang;
    if (!isManual) {
      const isHindi = /[\u0900-\u097F]/.test(text);
      targetLang = isHindi ? 'hi' : 'en';
    }
    setLastUsedLang(targetLang);

    try {
      const ans = await getGeminiResponse(newMsgs, targetLang);
      setMsgs(prev => [...prev, {
        id: uid(),
        role: 'assistant',
        refCode: genRef(),
        ...ans,
      }]);
    } catch {
      // Retry once automatically
      try {
        const ans = await getGeminiResponse(newMsgs, targetLang);
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
          text: lang === 'hi' ? 'एक अप्रत्याशित त्रुटि हुई। कृपया पुन: प्रयास करें।' : 'An unexpected error occurred. Please try again.',
          source: 'System Error',
        }]);
      }
    } finally {
      setTyping(false);
    }
  }

  return (
    <main style={{ display: 'flex', height: 'calc(100vh - var(--nav-h))', overflow: 'hidden' }}>
      <style jsx>{`
        @media (max-width: 860px) {
          .desktop-sidebar { display: none !important; }
          .chat-main { width: 100% !important; }
          .chat-header { padding: 1.25rem 1rem !important; }
          .chat-messages { padding: 1.5rem 1rem !important; }
          .chat-suggestions { padding: 0.6rem 1rem !important; }
          .chat-input-container { padding: 1rem 1.25rem !important; }
        }
      `}</style>

      {/* Sidebar */}
      <aside className="desktop-sidebar" style={{
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
      <div className="chat-main" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Header */}
        <div className="chat-header" style={{
          padding: '1rem 2.5rem', borderBottom: '1px solid var(--border)',
          background: 'var(--bg)', flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
            <span style={{ fontFamily: 'var(--font-head)', fontSize: '0.9rem', fontWeight: 700, color: 'var(--navy)', marginRight: 'auto' }}>
              {t("chat.title")}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.1em', color: 'var(--green)' }}>
              ● OPERATIONAL
            </span>
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--muted)' }}>
            {t("chat.subtitle")}
          </p>
        </div>

        {/* Suggestions */}
        <div className="chat-suggestions" style={{
          padding: '0.6rem 2.5rem', borderBottom: '1px solid var(--border)',
          display: 'flex', gap: '0.5rem', flexWrap: 'wrap', flexShrink: 0, background: 'var(--bg)',
        }}>
          {SUGGESTIONS.map(s => (
            <button key={s} onClick={() => send(t(s))} style={{
              fontFamily: 'var(--font-body)', fontSize: '0.72rem', border: '1px solid var(--border)',
              background: '#fff', color: 'var(--navy)', padding: '0.3rem 0.75rem',
              cursor: 'pointer', transition: 'border-color 0.1s',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--navy)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
            >
              {t(s)}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div className="chat-messages" style={{ flex: 1, overflowY: 'auto', padding: '2rem 2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {msgs.map(m => m.role === 'user' ? (
            <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.35rem' }}>{t("chat.you")}</span>
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
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--navy)' }}>{t("chat.response")}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', fontWeight: 600, color: 'var(--green)', letterSpacing: '0.1em' }}>● {t("chat.verified")}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', color: 'var(--muted)', marginLeft: 'auto' }}>{m.refCode}</span>
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                {(m.id === 'welcome-0' ? t("chat.welcome") : m.text).split("\n").map((line: string, index: number) => {
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
                  ✓ Source: {t(m.source)}
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
        <div className="chat-input-container" style={{
          borderTop: '1px solid var(--border)', padding: '1.25rem 2.5rem',
          display: 'flex', gap: '10px', background: '#fff', flexShrink: 0,
          alignItems: 'center'
        }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send(input)}
            placeholder={t("Ask about elections, eligibility, or documents...")}
            style={{
              flex: 1, border: '1px solid #E0E0E0', padding: '12px 16px',
              fontFamily: 'var(--font-body)', fontSize: '0.95rem', outline: 'none',
              background: '#F8F7F4', color: 'var(--navy)', borderRadius: '10px',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            onFocus={e => {
              e.target.style.borderColor = 'var(--saffron)';
              e.target.style.background = '#fff';
            }}
            onBlur={e => {
              e.target.style.borderColor = '#E0E0E0';
              e.target.style.background = '#F8F7F4';
            }}
          />
          <button
            onClick={() => {
              if (isRecording) {
                (window as any)._recognition?.stop();
                return;
              }

              const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
              if (SpeechRecognition) {
                const recognition = new SpeechRecognition();
                (window as any)._recognition = recognition;
                
                recognition.continuous = false;
                recognition.interimResults = true;
                recognition.lang = (isManual ? lang : lastUsedLang) === 'hi' ? 'hi-IN' : 'en-US';
                
                recognition.onstart = () => setIsRecording(true);
                recognition.onend = () => {
                  setIsRecording(false);
                  (window as any)._recognition = null;
                };
                
                recognition.onresult = (event: any) => {
                  let interim = '';
                  let final = '';

                  for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                      final += event.results[i][0].transcript;
                    } else {
                      interim += event.results[i][0].transcript;
                    }
                  }

                  const currentText = final || interim;
                  if (currentText) setInput(currentText);

                  if (final) {
                    setTimeout(() => {
                      send(final);
                    }, 300);
                    recognition.stop();
                  }
                };

                recognition.onerror = (event: any) => {
                  setIsRecording(false);
                  if (event.error !== 'no-speech') {
                    alert(lang === 'hi' ? "आवाज़ पहचानी नहीं गई, कृपया पुनः प्रयास करें" : "Voice not recognized, please try again");
                  }
                }
                recognition.start();
              } else {
                alert("Voice input not supported in this browser.");
              }
            }}
            style={{
              width: '42px', height: '42px', borderRadius: '50%',
              background: isRecording ? 'rgba(255, 153, 51, 0.1)' : '#F0F0EE', 
              border: 'none',
              color: isRecording ? 'var(--saffron)' : 'var(--muted)', 
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', cursor: 'pointer', transition: 'all 0.3s ease',
              animation: isRecording ? 'micPulse 1.4s infinite ease-out, micBreathe 1.4s infinite ease-in-out' : 'none',
              position: 'relative'
            }}
            onMouseEnter={e => !isRecording && (e.currentTarget.style.background = '#E5E5E3')}
            onMouseLeave={e => !isRecording && (e.currentTarget.style.background = '#F0F0EE')}
            title="Voice Input"
          >
            <span style={{ 
              fontSize: '1.1rem',
              transition: 'transform 0.3s ease'
            }}>🎙️</span>
          </button>
          <button 
            onClick={() => send(input)} 
            disabled={typing}
            style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700,
              background: 'var(--saffron)', color: '#fff', border: 'none',
              padding: '0 1.25rem', height: '42px', borderRadius: '8px',
              cursor: typing ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
              opacity: typing ? 0.6 : 1,
              letterSpacing: '0.05em'
            }}
            onMouseEnter={e => !typing && (e.currentTarget.style.opacity = '0.9')}
            onMouseLeave={e => !typing && (e.currentTarget.style.opacity = '1')}
          >
            {typing ? t("...") : t("ASK")}
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
