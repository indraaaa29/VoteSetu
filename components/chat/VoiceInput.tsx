'use client';
import { useState, useEffect, useCallback, memo } from 'react';

export const VoiceInput = memo(({ onTranscript, lang, lastUsedLang, t, typing }: { 
  onTranscript: (t: string, isFinal: boolean) => void, 
  lang: string, 
  lastUsedLang: string,
  t: any,
  typing: boolean
}) => {
  const [status, setStatus] = useState<'idle' | 'recording' | 'processing'>('idle');

  useEffect(() => {
    if (typing && status !== 'recording') {
      setStatus('processing');
    } else if (!typing && status === 'processing') {
      setStatus('idle');
    }
  }, [typing, status]);

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
      recognition.lang = (lang === 'hi' || lastUsedLang === 'hi') ? 'hi-IN' : 'en-US';
      
      recognition.onstart = () => setStatus('recording');
      recognition.onend = () => {
        setStatus('idle');
        (window as any)._recognition = null;
      };
      
      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) finalTranscript += event.results[i][0].transcript;
          else interimTranscript += event.results[i][0].transcript;
        }
        onTranscript(finalTranscript + interimTranscript, !!finalTranscript);
      };

      recognition.onerror = () => setStatus('idle');
      recognition.start();
    } else {
      alert(t("chat.voice_not_supported"));
    }
  }, [status, lang, lastUsedLang, onTranscript, t]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      {status === 'recording' && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--saffron)', fontWeight: 600 }}>{lang === 'hi' ? 'सुन रहा हूँ...' : 'Listening...'}</span>}
      {status === 'processing' && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--green)', fontWeight: 600 }}>{lang === 'hi' ? 'प्रक्रिया जारी है...' : 'Processing...'}</span>}
      <button
        onClick={toggleRecording}
        aria-label={t("chat.aria_voice")}
        aria-pressed={status === 'recording'}
        style={{
          width: '42px', height: '42px', borderRadius: '50%',
          background: status === 'recording' ? 'rgba(255, 153, 51, 0.1)' : 
                     status === 'processing' ? 'rgba(34, 197, 94, 0.1)' : '#F0F0EE', 
          border: 'none',
          color: status === 'recording' ? 'var(--saffron)' : 
                 status === 'processing' ? 'var(--green)' : 'var(--muted)', 
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', cursor: 'pointer', transition: 'all 0.3s ease',
          animation: status === 'recording' ? 'micPulse 1.4s infinite ease-out, micBreathe 1.4s infinite ease-in-out' : 'none',
        }}
      >
        🎙️
      </button>
    </div>
  );
});

VoiceInput.displayName = 'VoiceInput';
