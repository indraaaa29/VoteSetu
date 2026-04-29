'use client';
import { useState, useRef, useEffect, Suspense, memo, useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '../../lib/LanguageContext';
import { detectLanguage, validateInput, sanitizeInput } from '../../lib/utils';
import { getGeminiResponse } from '../../lib/chat-api';

import { ChatHeader } from '../../components/chat/ChatHeader';
import { Sidebar } from '../../components/chat/Sidebar';
import { MessageList } from '../../components/chat/MessageList';
import { InputBar } from '../../components/chat/InputBar';

const SUGGESTIONS = [
  'chat.suggestion_eligibility',
  'chat.suggestion_docs',
  'chat.suggestion_booth',
  'chat.suggestion_register',
];

type Msg = {
  id: string; role: 'user' | 'assistant';
  text: string; bullets?: string[]; tags?: string[]; source?: string;
  refCode?: string;
};

const uid = () => `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
const genRef = () => `EC/QRY/${Math.floor(10000 + Math.random() * 90000)}`;

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

function ChatContent() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get('q');
  const { lang, isManual, t } = useLanguage();

  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [typing, setTyping] = useState(false);
  const [lastUsedLang, setLastUsedLang] = useState<'en' | 'hi'>(lang);
  
  const endRef = useRef<HTMLDivElement>(null);
  const lastApiCall = useRef(0);

  const welcomeMsg = useMemo(() => ({
    id: 'welcome-0',
    role: 'assistant' as const,
    text: t("chat.welcome"),
    source: t("chat.source_eci"),
    refCode: 'EC/QRY/00001',
  }), [t]);

  useEffect(() => {
    if (msgs.length === 0) setMsgs([welcomeMsg]);
    else setMsgs(prev => prev.map(m => m.id === 'welcome-0' ? welcomeMsg : m));
  }, [welcomeMsg]);

  const normalize = (text: string) => {
    return text.replace(/\*\*/g, "").split(/\n|\./).map(s => s.trim()).filter(Boolean)
      .map(s => s.startsWith("-") ? s : `- ${s}`).join("\n");
  };

  const send = useCallback(async (text: string) => {
    const sanitized = sanitizeInput(text);
    if (!validateInput(sanitized) || typing) return;
    
    const now = Date.now();
    if (now - lastApiCall.current < 800) return;
    lastApiCall.current = now;
    
    const uMsg: Msg = { id: uid(), role: 'user', text: sanitized };
    setMsgs(prev => [...prev, uMsg]);
    setTyping(true);
    
    const targetLang = isManual ? lang : detectLanguage(sanitized);
    setLastUsedLang(targetLang);

    const lastUserMsg = msgs.filter(m => m.role === 'user').slice(-1)[0]?.text || "";
    const contextInput = lastUserMsg ? `${lastUserMsg}\n${sanitized}` : sanitized;

    const ans = await getGeminiResponse([...msgs, { ...uMsg, text: contextInput }], targetLang);
    const cleanText = normalize(ans.text);

    setMsgs(prev => [...prev, {
      id: uid(),
      role: 'assistant',
      refCode: genRef(),
      ...ans,
      text: cleanText
    }]);
    setTyping(false);
  }, [msgs, typing, lang, isManual]);

  useEffect(() => {
    if (initialQ) send(initialQ);
  }, [initialQ]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs, typing]);

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - var(--nav-h))', overflow: 'hidden' }}>
      <Sidebar t={t} />
      <div className="chat-main" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <ChatHeader t={t} lang={lang} />
        <SuggestionsBar onSend={send} t={t} />
        <MessageList msgs={msgs} typing={typing} t={t} endRef={endRef} />
        <InputBar onSend={send} typing={typing} t={t} lang={lang} lastUsedLang={lastUsedLang} />
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={null}>
      <ChatContent />
    </Suspense>
  );
}
