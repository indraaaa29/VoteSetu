'use client';
import { useState, useCallback, memo } from 'react';
import { VoiceInput } from './VoiceInput';

export const InputBar = memo(({ onSend, typing, t, lang, lastUsedLang }: { 
  onSend: (text: string) => void, 
  typing: boolean, 
  t: any,
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
    if (text) setInput(text);
    if (isFinal) {
      setTimeout(() => {
        if (text.trim()) onSend(text);
        setInput('');
      }, 350);
    }
  }, [onSend]);

  return (
    <footer className="chat-input-container" style={{
      borderTop: '1px solid var(--border)', padding: '1.25rem 2.5rem',
      display: 'flex', gap: '10px', background: '#fff', flexShrink: 0,
      alignItems: 'center'
    }}>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSend()}
        placeholder={t("chat.placeholder")}
        aria-label={t("chat.aria_input")}
        style={{
          flex: 1, border: '1px solid #E0E0E0', padding: '12px 16px',
          fontFamily: 'var(--font-body)', fontSize: '0.95rem', outline: 'none',
          background: '#F8F7F4', color: 'var(--navy)', borderRadius: '10px',
        }}
      />
      <VoiceInput 
        onTranscript={handleTranscript} 
        lang={lang} 
        lastUsedLang={lastUsedLang} 
        t={t} 
        typing={typing}
      />
      <button 
        onClick={handleSend} 
        disabled={typing || !input.trim()}
        aria-label={t("chat.aria_send")}
        style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700,
          background: 'var(--saffron)', color: '#fff', border: 'none',
          padding: '0 1.25rem', height: '42px', borderRadius: '8px',
          cursor: (typing || !input.trim()) ? 'not-allowed' : 'pointer',
          opacity: (typing || !input.trim()) ? 0.6 : 1,
        }}
      >
        {t("chat.ask")}
      </button>
    </footer>
  );
});

InputBar.displayName = 'InputBar';
