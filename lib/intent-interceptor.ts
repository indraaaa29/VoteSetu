export interface IntentResponse {
  text: string;
  bullets: string[];
  source: string;
}

const INTENTS = [
  { key: /eligib|age|vote|can i vote|allowed to vote/i, type: "ELIGIBILITY" },
  { key: /docu|need|require|what.*need|proof|apply/i, type: "DOCUMENTS" },
  { key: /register|apply|voter id|how to apply/i, type: "REGISTRATION" },
  { key: /booth|polling|where.*vote/i, type: "BOOTH" },
  { key: /voter.*number|how many voters|population voters/i, type: "STATS" },
];

function block(title: string, items: string[], lang: 'en' | 'hi'): IntentResponse {
  const source = lang === 'hi' ? "भारत निर्वाचन आयोग" : "Election Commission of India";
  return {
    text: title,
    bullets: items,
    source: source
  };
}

const RESPONSES: Record<string, { en: IntentResponse; hi: IntentResponse }> = {
  ELIGIBILITY: {
    en: block("To vote in India:", [
      "You must be 18 years or older",
      "You must be an Indian citizen",
      "You must be registered in the electoral roll",
    ], 'en'),
    hi: block("भारत में मतदान करने के लिए:", [
      "आपकी आयु 18 वर्ष या उससे अधिक होनी चाहिए",
      "आपको भारत का नागरिक होना चाहिए",
      "मतदाता सूची में पंजीकृत होना चाहिए",
    ], 'hi')
  },
  DOCUMENTS: {
    en: block("Required documents:", [
      "Proof of Identity (Aadhaar, Passport, etc.)",
      "Proof of Address",
      "Passport-size photograph",
    ], 'en'),
    hi: block("आवश्यक दस्तावेज:", [
      "पहचान का प्रमाण (आधार, पासपोर्ट, आदि)",
      "पते का प्रमाण",
      "पासपोर्ट आकार की तस्वीर",
    ], 'hi')
  },
  REGISTRATION: {
    en: block("You can register by:", [
      "Applying online via NVSP portal",
      "Visiting Electoral Registration Office",
      "Using the Voter Helpline App",
    ], 'en'),
    hi: block("आप पंजीकरण कर सकते हैं:", [
      "NVSP पोर्टल के माध्यम से ऑनलाइन आवेदन करना",
      "चुनावी पंजीकरण कार्यालय में जाकर",
      "वोटर हेल्पलाइन ऐप का उपयोग करना",
    ], 'hi')
  },
  STATS: {
    en: block("Latest estimate:", [
      "India has ~96–98 crore registered voters (ECI data)",
    ], 'en'),
    hi: block("नवीनतम अनुमान:", [
      "भारत में ~96–98 करोड़ पंजीकृत मतदाता हैं (ईसीआई डेटा)",
    ], 'hi')
  },
  BOOTH: {
    en: block("Find your polling booth:", [
      "Check Voter Helpline App",
      "Visit nvsp.in portal",
      "Call toll-free 1950",
    ], 'en'),
    hi: block("अपना मतदान केंद्र खोजें:", [
      "वोटर हेल्पलाइन ऐप देखें",
      "nvsp.in पोर्टल पर जाएं",
      "टोल-फ्री 1950 पर कॉल करें",
    ], 'hi')
  }
};

export function interceptIntent(query: string, lang: 'en' | 'hi' = 'en'): IntentResponse | null {
  const q = query.toLowerCase();
  const hit = INTENTS.find(i => i.key.test(q));
  if (!hit) return null;

  return RESPONSES[hit.type]?.[lang] || RESPONSES[hit.type]?.['en'] || null;
}
