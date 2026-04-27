'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

type Lang = 'en' | 'hi';

const LanguageContext = createContext<{
  lang: Lang;
  setLang: (lang: Lang) => void;
  isManual: boolean;
  t: (key: string) => string;
}>({
  lang: 'en',
  setLang: () => {},
  isManual: false,
  t: (key) => key,
});

const DICT: Record<string, {en: string, hi: string}> = {
  // Nav
  'Home': {en: 'Home', hi: 'होम'},
  'Documents': {en: 'Documents', hi: 'दस्तावेज़'},
  'Checklist': {en: 'Checklist', hi: 'चेकलिस्ट'},
  'Chat': {en: 'Chat', hi: 'चैट'},
  
  // Home Page
  "India's Elections, Explained.": {en: "India's Elections, Explained.", hi: "भारत के चुनाव, समझाए गए।"},
  "VoteSetu is a structured information system for Indian voters. Understand the election process, verify your eligibility, and ask questions — all from verified official sources.": {en: "VoteSetu is a structured information system for Indian voters. Understand the election process, verify your eligibility, and ask questions — all from verified official sources.", hi: "वोटसेतु भारतीय मतदाताओं के लिए एक संरचित सूचना प्रणाली है। चुनाव प्रक्रिया को समझें, अपनी पात्रता सत्यापित करें, और सत्यापित आधिकारिक स्रोतों से प्रश्न पूछें।"},
  "Registered Voters": {en: "Registered Voters", hi: "पंजीकृत मतदाता"},
  "Voter Turnout 2024": {en: "Voter Turnout 2024", hi: "मतदाता मतदान 2024"},
  "Lok Sabha Constituencies": {en: "Lok Sabha Constituencies", hi: "लोकसभा क्षेत्र"},
  "Understand the Voting Process": {en: "Understand the Voting Process", hi: "मतदान प्रक्रिया को समझें"},
  "Step-by-step election guide": {en: "Step-by-step election guide", hi: "चरण-दर-चरण चुनाव मार्गदर्शिका"},
  "Smart Document Checklist": {en: "Smart Document Checklist", hi: "स्मार्ट दस्तावेज़ चेकलिस्ट"},
  "Track your registration readiness": {en: "Track your registration readiness", hi: "अपनी पंजीकरण तैयारी को ट्रैक करें"},
  "Ask the Assistant": {en: "Ask the Assistant", hi: "सहायक से पूछें"},
  "Get verified answers instantly": {en: "Get verified answers instantly", hi: "तुरंत सत्यापित उत्तर प्राप्त करें"},
  "Election Commission of India · Civic Information System": {en: "Election Commission of India · Civic Information System", hi: "भारत निर्वाचन आयोग · नागरिक सूचना प्रणाली"},
  "Source: eci.gov.in · Data: April 2024": {en: "Source: eci.gov.in · Data: April 2024", hi: "स्रोत: eci.gov.in · डेटा: अप्रैल 2024"},

  // Chat Page
  "Civic Assistant": {en: "Civic Assistant", hi: "नागरिक सहायक"},
  "Querying Official Electoral Roll Data": {en: "Querying Official Electoral Roll Data", hi: "आधिकारिक मतदाता सूची डेटा पूछताछ"},
  "Ask about elections, eligibility, or documents...": {en: "Ask about elections, eligibility, or documents...", hi: "चुनाव, पात्रता, या दस्तावेज़ के बारे में पूछें..."},
  "Am I eligible to vote?": {en: "Am I eligible to vote?", hi: "क्या मैं वोट देने के लिए पात्र हूँ?"},
  "What documents do I need?": {en: "What documents do I need?", hi: "मुझे किन दस्तावेजों की आवश्यकता है?"},
  "How do I find my polling booth?": {en: "How do I find my polling booth?", hi: "मैं अपना मतदान केंद्र कैसे खोजूँ?"},
  "How do I register to vote?": {en: "How do I register to vote?", hi: "मैं वोट देने के लिए पंजीकरण कैसे करूँ?"},
  "Ask": {en: "Ask", hi: "पूछें"},
  "You": {en: "You", hi: "आप"},
  "Response": {en: "Response", hi: "प्रतिक्रिया"},
  "Welcome. I am the VoteSetu Civic Assistant — a service of the Election Commission of India. Ask any question about voter eligibility, registration, required documents, or the election process.": {en: "Welcome. I am the VoteSetu Civic Assistant — a service of the Election Commission of India. Ask any question about voter eligibility, registration, required documents, or the election process.", hi: "स्वागत है। मैं वोटसेतु नागरिक सहायक हूँ — भारत निर्वाचन आयोग की एक सेवा। मतदाता पात्रता, पंजीकरण, आवश्यक दस्तावेजों, या चुनाव प्रक्रिया के बारे में कोई भी प्रश्न पूछें।"},
  "Election Commission of India — Civic Assistant": {en: "Election Commission of India — Civic Assistant", hi: "भारत निर्वाचन आयोग — नागरिक सहायक"},
  "Election Commission of India": {en: "Election Commission of India", hi: "भारत निर्वाचन आयोग"},
  "System Error": {en: "System Error", hi: "सिस्टम त्रुटि"},

  // Global
  "Ask Assistant": {en: "Ask Assistant", hi: "सहायक से पूछें"},
  
  // Constituency Search
  "Personalize your experience": {en: "Personalize your experience", hi: "अपना अनुभव व्यक्तिगत करें"},
  "Location Detected": {en: "Location Detected", hi: "स्थान का पता चला"},
  "Data not available for this PIN": {en: "Data not available for this PIN", hi: "इस पिन के लिए डेटा उपलब्ध नहीं है"},
  "Jamshedpur East": {en: "Jamshedpur East", hi: "जमशेदपुर पूर्व"},
  "New Delhi": {en: "New Delhi", hi: "नई दिल्ली"},
  "Next election: April 2029": {en: "Next election: April 2029", hi: "अगला चुनाव: अप्रैल 2029"},
  "Next election: May 2029": {en: "Next election: May 2029", hi: "अगला चुनाव: मई 2029"},

  // Checklist
  "Required Documents Checklist": {en: "Required Documents Checklist", hi: "आवश्यक दस्तावेज़ चेकलिस्ट"},
  "Readiness Meter": {en: "Readiness Meter", hi: "तैयारी मीटर"},
  "You are ": {en: "You are ", hi: "आप "},
  "% ready for registration": {en: "% ready for registration", hi: "% पंजीकरण के लिए तैयार हैं"},
  "Aadhaar Card (Identity Proof)": {en: "Aadhaar Card (Identity Proof)", hi: "आधार कार्ड (पहचान प्रमाण)"},
  "Address Proof": {en: "Address Proof", hi: "पते का प्रमाण"},
  "Passport-size Photograph": {en: "Passport-size Photograph", hi: "पासपोर्ट आकार का फोटो"},
  "Registration Readiness.": {en: "Registration Readiness.", hi: "पंजीकरण की तैयारी।"},
  "Use this interactive checklist to track the documents you need for voter registration. Your progress is saved automatically on this device.": {en: "Use this interactive checklist to track the documents you need for voter registration. Your progress is saved automatically on this device.", hi: "मतदाता पंजीकरण के लिए आवश्यक दस्तावेजों को ट्रैक करने के लिए इस चेकलिस्ट का उपयोग करें। आपकी प्रगति इस उपकरण पर स्वचालित रूप से सहेजी जाती है।"},
  "Why these documents?": {en: "Why these documents?", hi: "ये दस्तावेज़ क्यों?"},
  "To register as a new voter (Form 6), the Election Commission requires proof of identity, proof of address, and a recent photograph to issue your EPIC (Voter ID) card.": {en: "To register as a new voter (Form 6), the Election Commission requires proof of identity, proof of address, and a recent photograph to issue your EPIC (Voter ID) card.", hi: "एक नए मतदाता (फॉर्म 6) के रूप में पंजीकरण करने के लिए, चुनाव आयोग को आपका ईपीआईसी (वोटर आईडी) कार्ड जारी करने के लिए पहचान का प्रमाण, पते का प्रमाण और एक हालिया तस्वीर की आवश्यकता होती है।"},
  "Source: voters.eci.gov.in · Data Persistence: Local Storage": {en: "Source: voters.eci.gov.in · Data Persistence: Local Storage", hi: "स्रोत: voters.eci.gov.in · डेटा दृढ़ता: स्थानीय भंडारण"},


  // Documents
  "Voting Process": {en: "Voting Process", hi: "मतदान प्रक्रिया"},
  "Eligibility": {en: "Eligibility", hi: "पात्रता"},
  "Required Docs": {en: "Required Docs", hi: "आवश्यक दस्तावेज़"},
  "Reg Guide": {en: "Reg Guide", hi: "पंजीकरण मार्गदर्शिका"},
  "EVM Info": {en: "EVM Info", hi: "ईवीएम जानकारी"},
  "PROCESS": {en: "PROCESS", hi: "प्रक्रिया"},
  "ELIGIBILITY": {en: "ELIGIBILITY", hi: "पात्रता"},
  "DOCUMENTS": {en: "DOCUMENTS", hi: "दस्तावेज़"},
  "REGISTRATION": {en: "REGISTRATION", hi: "पंजीकरण"},
  "Ask about this →": {en: "Ask about this →", hi: "इसके बारे में पूछें →"},
  "Updated ": {en: "Updated ", hi: "अद्यतन "},
  "Verified": {en: "Verified", hi: "सत्यापित"}
};

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
    if (DICT[key]) return DICT[key][lang] || DICT[key]['en'];
    return key; // Fallback to key if not translated
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, isManual, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
