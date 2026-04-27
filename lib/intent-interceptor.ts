
export interface IntentResponse {
  text: string;
  bullets: string[];
  source: string;
}

const INTENTS: Record<string, any> = {
  eligibility: {
    keywords: ["eligible", "age", "who can vote", "patrata", "umra"],
    en: {
      text: "To vote in India, you must meet the following criteria:",
      bullets: [
        "Must be 18 years or older",
        "Must be a citizen of India",
        "Must be registered in the electoral roll"
      ],
      source: "Election Commission of India"
    },
    hi: {
      text: "भारत में मतदान करने के लिए, आपको निम्नलिखित मानदंडों को पूरा करना होगा:",
      bullets: [
        "आपकी आयु 18 वर्ष या उससे अधिक होनी चाहिए",
        "भारत का नागरिक होना चाहिए",
        "मतदाता सूची में पंजीकृत होना चाहिए"
      ],
      source: "भारत निर्वाचन आयोग"
    }
  },
  documents: {
    keywords: ["documents", "required documents", "what do i need", "dastavez", "kagaz"],
    en: {
      text: "To register as a voter, you need the following documents:",
      bullets: [
        "Proof of Identity (Aadhaar Card, Passport, etc.)",
        "Proof of Address (Utility bill, Rent agreement)",
        "Passport-size photograph"
      ],
      source: "Election Commission of India"
    },
    hi: {
      text: "मतदाता के रूप में पंजीकरण करने के लिए, आपको निम्नलिखित दस्तावेजों की आवश्यकता है:",
      bullets: [
        "पहचान का प्रमाण (आधार कार्ड, पासपोर्ट, आदि)",
        "पते का प्रमाण (बिजली बिल, किराया समझौता)",
        "पासपोर्ट आकार की तस्वीर"
      ],
      source: "भारत निर्वाचन आयोग"
    }
  }
};

export function interceptIntent(query: string, lang: 'en' | 'hi' = 'en'): IntentResponse | null {
  const normalizedQuery = query.toLowerCase().trim();
  
  for (const key in INTENTS) {
    const intent = INTENTS[key];
    for (const keyword of intent.keywords) {
      const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escapedKeyword}\\b`, 'i');
      if (regex.test(normalizedQuery)) {
        return intent[lang] || intent['en'];
      }
    }
  }
  
  return null;
}
