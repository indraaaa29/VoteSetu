'use client';
import { useState, useRef, useEffect, Suspense, memo, useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '../../lib/LanguageContext';

const SUGGESTIONS = [
  'chat.suggestion_eligibility',
  'chat.suggestion_docs',
  'chat.suggestion_booth',
  'chat.suggestion_register',
];

const DOCS_LIST = [
  { id: 'voting_process', label: 'nav.voting_process' },
  { id: 'eligibility',    label: 'nav.eligibility' },
  { id: 'required_docs',  label: 'nav.required_docs' },
  { id: 'registration',   label: 'nav.registration' },
  { id: 'evm_info',       label: 'nav.evm_info' },
];

type Msg = {
  id: string; role: 'user' | 'assistant';
  text: string; bullets?: string[]; tags?: string[]; source?: string;
  refCode?: string;
};

let counter = 0;
function uid() { return `msg-${++counter}-${Date.now()}`; }
function genRef() { return `EC/QRY/${Math.floor(10000 + Math.random() * 90000)}`; }

async function getGeminiResponse(messages: Msg[], language: string): Promise<Omit<Msg, 'id' | 'role' | 'refCode'>> {
  try {
    // API OPTIMIZATION: Send minimal data - last 10 messages only
    const contextMessages = messages.slice(-10);
    
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: contextMessages, language }),
    });
    const data = await response.json();
    if (!response.ok || data.error || data.message) {
      throw new Error(data.message || data.error || `Server error ${response.status}`);
    }
    return {
      text: data.text,
      bullets: data.bullets,
      source: data.source || 'chat.source_default',
    };
  } catch (error: unknown) {
    return {
      text: error instanceof Error ? error.message : "chat.error_generic",
      source: "chat.system_error",
    };
  }
}

const B: React.CSSProperties = {
  fontFamily: 'var(--font-body)', fontSize: '0.88rem', lineHeight: 1.75, color: '#374151',
};

const getWelcomeMsg = (t: any): Msg => ({
  id: 'welcome-0',
  role: 'assistant',
  text: t("chat.welcome"),
  source: t("chat.source_eci"),
  refCode: 'EC/QRY/00001',
});

// --- OPTIMIZED SUB-COMPONENTS ---

const Sidebar = memo(({ t }: { t: any }) => (
  <aside className="desktop-sidebar" aria-label="Reference Documents" style={{
    width: 200, flexShrink: 0, borderRight: '1px solid var(--border)',
    background: 'var(--sidebar-bg)', overflowY: 'auto', padding: '1.5rem 0',
  }}>
    <p style={{
      fontFamily: 'var(--font-mono)', fontSize: '0.52rem', letterSpacing: '0.16em',
      textTransform: 'uppercase', color: 'var(--muted)', padding: '0 1.25rem', marginBottom: '0.25rem',
    }}>{t("nav.documents")}</p>
    <p style={{
      fontFamily: 'var(--font-mono)', fontSize: '0.48rem', letterSpacing: '0.1em',
      textTransform: 'uppercase', color: 'var(--muted)', padding: '0 1.25rem', marginBottom: '0.75rem', opacity: 0.6,
    }}>ID: VOTE-DOC-SYS</p>
    {DOCS_LIST.map(d => (
      <a key={d.id} href={`/documents?doc=${d.id}`} style={{
        display: 'block', padding: '0.65rem 1.25rem',
        fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: '#6B7280',
        borderLeft: '2px solid transparent', transition: 'color 0.1s',
      }}>
        {t(d.label)}
      </a>
    ))}
  </aside>
));
Sidebar.displayName = 'Sidebar';

const ChatHeader = memo(({ t, lang }: { t: any, lang: string }) => (
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

const SuggestionsBar = memo(({ onSend, t }: { onSend: (t: string) => void, t: any }) => (
  <section className="chat-suggestions" aria-label="Suggested questions" style={{
    padding: '0.6rem 2.5rem', borderBottom: '1px solid var(--border)',
    display: 'flex', gap: '0.5rem', flexWrap: 'wrap', flexShrink: 0, background: 'var(--bg)',
  }}>
    {SUGGESTIONS.map(s => (
      <button key={s} onClick={() => onSend(t(s))} style={{
        fontFamily: 'var(--font-body)', fontSize: '0.72rem', border: '1px solid var(--border)',
        background: '#fff', color: 'var(--navy)', padding: '0.3rem 0.75rem',
        cursor: 'pointer', transition: 'border-color 0.1s',
      }}>
        {t(s)}
      </button>
    ))}
  </section>
));
SuggestionsBar.displayName = 'SuggestionsBar';

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
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem', paddingBottom: '0.6rem', borderBottom: '1px solid var(--border)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--navy)' }}>{t("chat.response")}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', fontWeight: 600, color: 'var(--green)', letterSpacing: '0.1em' }}>● {t("chat.verified")}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', color: 'var(--muted)', marginLeft: 'auto' }}>{m.refCode}</span>
      </div>
      <div style={{ margin: 0, padding: 0 }}>
        {(m.id === 'welcome-0' ? t("chat.welcome") : m.text).split("\n").map((line: string, index: number) => {
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
      {m.tags && (
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.65rem' }}>
          {m.tags.map(tag => (
            <span key={tag} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', border: '1px solid var(--border)', padding: '0.15rem 0.5rem', color: 'var(--navy)', letterSpacing: '0.06em' }}>{tag}</span>
          ))}
        </div>
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

const MessageList = memo(({ msgs, typing, t, endRef }: { msgs: Msg[], typing: boolean, t: any, endRef: React.RefObject<HTMLDivElement | null> }) => (
  <section className="chat-messages" role="log" aria-label="Chat messages" aria-live="polite" style={{ flex: 1, overflowY: 'auto', padding: '2rem 2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
    {msgs.map(m => <MessageItem key={m.id} m={m} t={t} />)}
    {typing && (
      <div style={{ borderLeft: '3px solid var(--border)', padding: '0.75rem 1rem', background: '#fff' }} role="status">
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.08em' }}>{t("chat.processing")}</span>
      </div>
    )}
    <div ref={endRef} />
  </section>
));
MessageList.displayName = 'MessageList';

const VoiceInput = memo(({ onTranscript, isManual, lang, lastUsedLang, t }: { 
  onTranscript: (t: string, isFinal: boolean) => void, 
  isManual: boolean, 
  lang: string, 
  lastUsedLang: string,
  t: any 
}) => {
  const [status, setStatus] = useState<'idle' | 'recording' | 'error'>('idle');

  // Handle ESC to stop recording
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && status === 'recording') {
        (window as any)._recognition?.stop();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [status]);

  const toggleRecording = useCallback(() => {
    if (status === 'recording') {
      (window as any)._recognition?.stop();
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      (window as any)._recognition = recognition;
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = (isManual ? lang : lastUsedLang) === 'hi' ? 'hi-IN' : 'en-US';
      
      recognition.onstart = () => setStatus('recording');
      recognition.onend = () => {
        setStatus('idle');
        (window as any)._recognition = null;
      };
      
      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        if (finalTranscript) {
          onTranscript(finalTranscript, true);
          // Auto-stop on final result to mimic single-turn interaction as requested
          recognition.stop();
        } else if (interimTranscript) {
          onTranscript(interimTranscript, false);
        }
      };

      recognition.onerror = (event: any) => {
        setStatus('error');
        if (event.error !== 'no-speech') {
          console.error('Speech Recognition Error:', event.error);
        }
        setTimeout(() => setStatus('idle'), 2000);
      };
      
      recognition.start();
    } else {
      alert(t("chat.voice_not_supported"));
    }
  }, [status, isManual, lang, lastUsedLang, onTranscript]);

  return (
    <button
      onClick={toggleRecording}
      aria-label={status === 'recording' ? "Stop recording" : "Start voice input"}
      aria-pressed={status === 'recording'}
      style={{
        width: '42px', height: '42px', borderRadius: '50%',
        background: status === 'recording' ? 'rgba(255, 153, 51, 0.1)' : 
                   status === 'error' ? 'rgba(239, 68, 68, 0.1)' : '#F0F0EE', 
        border: 'none',
        color: status === 'recording' ? 'var(--saffron)' : 
               status === 'error' ? '#EF4444' : 'var(--muted)', 
        display: 'flex', alignItems: 'center',
        justifyContent: 'center', cursor: 'pointer', transition: 'all 0.3s ease',
        animation: status === 'recording' ? 'micPulse 1.4s infinite ease-out, micBreathe 1.4s infinite ease-in-out' : 'none',
        position: 'relative'
      }}
      title={status === 'recording' ? "Stop Recording" : "Start Voice Input"}
    >
      <span style={{ fontSize: '1.1rem' }} aria-hidden="true">
        {status === 'error' ? '⚠️' : '🎙️'}
      </span>
    </button>
  );
});
VoiceInput.displayName = 'VoiceInput';

const InputBar = memo(({ onSend, typing, t, isManual, lang, lastUsedLang }: { 
  onSend: (t: string) => void, 
  typing: boolean, 
  t: any,
  isManual: boolean,
  lang: string,
  lastUsedLang: string
}) => {
  const [input, setInput] = useState('');

  const handleSend = useCallback(() => {
    if (input.trim()) {
      onSend(input);
      setInput('');
    }
  }, [input, onSend]);

  const handleTranscript = useCallback((text: string, isFinal: boolean) => {
    setInput(text);
    if (isFinal) {
      // Auto-send with a small delay to feel smooth
      setTimeout(() => {
        onSend(text);
        setInput('');
      }, 400);
    }
  }, [onSend]);

  return (
    <section className="chat-input-container" style={{
      borderTop: '1px solid var(--border)', padding: '1.25rem 2.5rem',
      display: 'flex', gap: '10px', background: '#fff', flexShrink: 0,
      alignItems: 'center'
    }}>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSend()}
        placeholder={t("chat.placeholder")}
        aria-label="Message input"
        style={{
          flex: 1, border: '1px solid #E0E0E0', padding: '12px 16px',
          fontFamily: 'var(--font-body)', fontSize: '0.95rem', outline: 'none',
          background: '#F8F7F4', color: 'var(--navy)', borderRadius: '10px',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />
      <VoiceInput 
        onTranscript={handleTranscript} 
        isManual={isManual} 
        lang={lang} 
        lastUsedLang={lastUsedLang} 
        t={t} 
      />
      <button 
        onClick={handleSend} 
        disabled={typing || !input.trim()}
        aria-label="Send message"
        style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700,
          background: 'var(--saffron)', color: '#fff', border: 'none',
          padding: '0 1.25rem', height: '42px', borderRadius: '8px',
          cursor: (typing || !input.trim()) ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
          opacity: (typing || !input.trim()) ? 0.6 : 1,
          letterSpacing: '0.05em'
        }}
      >
        {typing ? t("...") : t("ASK")}
      </button>
    </section>
  );
});
InputBar.displayName = 'InputBar';

// --- MAIN COMPONENT ---

function ChatContent() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get('q');
  const { lang, isManual, t } = useLanguage();

  // Separate states for better control and memoization
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [typing, setTyping] = useState(false);
  const [lastUsedLang, setLastUsedLang] = useState<'en' | 'hi'>(lang);

  // Initialize welcome message on mount and lang change
  useEffect(() => {
    if (msgs.length === 0) {
      setMsgs([getWelcomeMsg(t)]);
    } else {
      // Update welcome message if it's the first message and language changed
      setMsgs(prev => prev.map(m => m.id === 'welcome-0' ? getWelcomeMsg(t) : m));
    }
  }, [t]);
  
  const endRef = useRef<HTMLDivElement>(null);
  const sentInitial = useRef(false);
  const lastApiCall = useRef(0);

  const sanitizeInput = (input: string): string => {
    return input.replace(/<[^>]*>/g, '').slice(0, 800).trim();
  };

  const send = useCallback(async (text: string) => {
    if (!text.trim() || typing) return;
    
    const sanitized = sanitizeInput(text);
    if (!sanitized || sanitized.length === 0) return;
    
    const now = Date.now();
    if (now - lastApiCall.current < 800) return;
    lastApiCall.current = now;
    
    const uMsg: Msg = { id: uid(), role: 'user', text: sanitized };
    setMsgs(prev => [...prev, uMsg]);
    setTyping(true);
    
    let targetLang = lang;
    if (!isManual) {
      const isHindi = /[\u0900-\u097F]/.test(text);
      targetLang = isHindi ? 'hi' : 'en';
    }
    setLastUsedLang(targetLang);

    const callApi = async (currentMsgs: Msg[]) => {
      const ans = await getGeminiResponse(currentMsgs, targetLang);
      setMsgs(prev => [...prev, {
        id: uid(),
        role: 'assistant',
        refCode: genRef(),
        ...ans,
      }]);
    };

    try {
      await callApi([...msgs, uMsg]);
    } catch {
      try {
        await callApi([...msgs, uMsg]);
      } catch {
        setMsgs(prev => [...prev, {
          id: uid(),
          role: 'assistant',
          refCode: genRef(),
          text: t("chat.error_generic"),
          source: t("chat.system_error"),
        }]);
      }
    } finally {
      setTyping(false);
    }
  }, [msgs, typing, lang, isManual]);

  useEffect(() => {
    if (initialQ && !sentInitial.current) {
      sentInitial.current = true;
      send(initialQ);
    }
  }, [initialQ, send]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs, typing]);

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

      <Sidebar t={t} />

      <div className="chat-main" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <ChatHeader t={t} lang={lang} />
        <SuggestionsBar onSend={send} t={t} />
        <MessageList msgs={msgs} typing={typing} t={t} endRef={endRef} />
        <InputBar 
          onSend={send} 
          typing={typing} 
          t={t} 
          isManual={isManual} 
          lang={lang} 
          lastUsedLang={lastUsedLang} 
        />
      </div>
    </main>
  );
}

export default function ChatPage() {
  const { t } = useLanguage();
  return (
    <Suspense fallback={<div style={{ padding: '2rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)', fontSize: '0.8rem' }}>{t("chat.loading")}</div>}>
      <ChatContent />
    </Suspense>
  );
}

