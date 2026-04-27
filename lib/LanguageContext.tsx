'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import en from '../locales/en.json';
import hi from '../locales/hi.json';

type Lang = 'en' | 'hi';

const locales = { en, hi };

const LanguageContext = createContext<{
  lang: Lang;
  setLang: (lang: Lang) => void;
  isManual: boolean;
  t: (key: string) => any;
}>({
  lang: 'en',
  setLang: () => {},
  isManual: false,
  t: (key) => key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');
  const [isManual, setIsManual] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('lang') as Lang;
    const manual = localStorage.getItem('lang_manual') === 'true';
    if (saved === 'hi' || saved === 'en') {
      setLangState(saved);
      setIsManual(manual);
    }
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    setIsManual(true);
    localStorage.setItem('lang', l);
    localStorage.setItem('lang_manual', 'true');
  };

  const t = (key: string) => {
    const keys = key.split('.');
    let result: any = locales[lang];
    
    for (const k of keys) {
      if (result && result[k] !== undefined) {
        result = result[k];
      } else {
        // Fallback to English if missing in Hindi
        let fallback: any = locales['en'];
        for (const fk of keys) {
          if (fallback && fallback[fk] !== undefined) {
            fallback = fallback[fk];
          } else {
            fallback = key; // Ultimate fallback to key string
            break;
          }
        }
        return fallback;
      }
    }
    return result;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, isManual, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
