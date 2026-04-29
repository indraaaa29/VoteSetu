export interface IntentResponse {
  text: string;
  bullets: string[];
  source: string;
}

const INTENTS: Record<string, { keywords: string[]; en: IntentResponse; hi: IntentResponse; }> = {
  eligibility: {
    keywords: ["eligible", "age", "who can vote", "patrata", "umra", "can i vote", "am i eligible"],
    en: {
      text: "To vote in India, you must meet these criteria:",
      bullets: [
        "Must be 18 years or older",
        "Must be a citizen of India",
        "Must be registered in the electoral roll"
      ],
      source: "Election Commission of India"
    },
    hi: {
      text: "भारत में मतदान करने के लिए, आपको यह मानदंड पूरे करने होंगे:",
      bullets: [
        "आपकी आयु 18 वर्ष या उससे अधिक होनी चाहिए",
        "भारत का नागरिक होना चाहिए",
        "मतदाता सूची में पंजीकृत होना चाहिए"
      ],
      source: "भारत निर्वाचन आयोग"
    }
  },
  documents: {
    keywords: ["documents", "required documents", "what do i need", "dastavez", "kagaz", "needed documents", "documents required"],
    en: {
      text: "To register as a voter, you need these documents:",
      bullets: [
        "Proof of Identity (Aadhaar Card, Passport, etc.)",
        "Proof of Address (Utility bill, Rent agreement)",
        "Passport-size photograph"
      ],
      source: "Election Commission of India"
    },
    hi: {
      text: "मतदाता के रूप में पंजीकरण के लिए, आपको यह दस्तावेज चाहिए:",
      bullets: [
        "पहचान का प्रमाण (आधार कार्ड, पासपोर्ट, आदि)",
        "पते का प्रमाण (बिजली बिल, किराया समझौता)",
        "पासपोर्ट आकार की तस्वीर"
      ],
      source: "भारत निर्वाचन आयोग"
    }
  },
  voter_id: {
    keywords: ["voter id", "epic", "voter id card", "election card", "electoral id", "vote id", "voter id number"],
    en: {
      text: "Your Voter ID (EPIC) is your Elector Photo Identity Card issued by the Election Commission:",
      bullets: [
        "Apply online at voters.eci.gov.in using Form 6",
        "Or apply offline at your local Electoral Registration Office",
        "You will receive your EPIC after verification by the Booth Level Officer"
      ],
      source: "Election Commission of India"
    },
    hi: {
      text: "आपका वोटर आईडी (ईपीआईसी) चुनाव आयोग द्वारा जारी इलेक्टर फोटो पहचान पत्र है:",
      bullets: [
        "फॉर्म 6 का उपयोग करके voters.eci.gov.in पर ऑनलाइन आवेदन करें",
        "या अपने स्थानीय चुनावी पंजीकरण कार्यालय में ऑफलाइन आवेदन करें",
        "बूथ स्तर के अधिकारी द्वारा सत्यापन के बाद आपको ईपीआईसी मिलेगा"
      ],
      source: "भारत निर्वाचन आयोग"
    }
  },
  polling_booth: {
    keywords: ["polling booth", "voting station", "booth", "election booth", "where do i vote", "ballot", "polling station"],
    en: {
      text: "Find your polling booth using these methods:",
      bullets: [
        "SMS: Type EPIC (Your EPIC Number) and send to 9211251972",
        "Call the Voter Helpline: 1950 (toll-free)",
        "Visit nvsp.in and use the 'Search in Electoral Roll' feature",
        "Use the Voter Helpline Mobile App"
      ],
      source: "Election Commission of India"
    },
    hi: {
      text: "अपना मतदान केंद्र खोजने के लिए इन विधियों का उपयोग करें:",
      bullets: [
        "एसएमएस: EPIC (आपका ईपीआईसी नंबर) टाइप करें और 9211251972 पर भेजें",
        "वोटर हेल्पलाइन को कॉल करें: 1950 (टोल-फ्री)",
        "nvsp.in पर जाएं और 'इलेक्टोरल रोल में खोजें' सुविधा का उपयोग करें",
        "वोटर हेल्पलाइन मोबाइल ऐप का उपयोग करें"
      ],
      source: "भारत निर्वाचन आयोग"
    }
  },
  statistics: {
    keywords: ["voter statistics", "number of voters", "total voters", "registered voters", "voter count", "voter turnout", "how many voters"],
    en: {
      text: "India has approximately 96+ crore registered voters (latest ECI data):",
      bullets: [
        "Over 96 crore (960 million) registered voters across India",
        "543 Lok Sabha constituencies",
        "2019 General Election voter turnout: 67.4%",
        "2024 General Election voter turnout: 66.8%"
      ],
      source: "Election Commission of India"
    },
    hi: {
      text: "भारत में लगभग 96+ करोड़ पंजीकृत मतदाता हैं (नवीनतम ईसीआई डेटा):",
      bullets: [
        "भारत भर में 96 करोड़ (960 मिलियन) से अधिक पंजीकृत मतदाता",
        "543 लोकसभा निर्वाचन क्षेत्र",
        "2019 के सामान्य चुनाव में मतदाता मतदान: 67.4%",
        "2024 के सामान्य चुनाव में मतदाता मतदान: 66.8%"
      ],
      source: "भारत निर्वाचन आयोग"
    }
  },
  registration: {
    keywords: ["register", "registration", "how to register", " enroll", "new voter", "form 6", "apply for voter id"],
    en: {
      text: "Register as a voter in India using these steps:",
      bullets: [
        "Visit voters.eci.gov.in or download Voter Helpline app",
        "Fill Form 6 with name, date of birth, address",
        "Upload age proof, address proof, and photograph",
        "Submit and note your reference number",
        "Field verification by Booth Level Officer"
      ],
      source: "Election Commission of India"
    },
    hi: {
      text: "इन चरणों का उपयोग करके भारत में मतदाता के रूप में पंजीकरण करें",
      bullets: [
        "voters.eci.gov.in पर जाएं या वोटर हेल्पलाइन ऐप डाउनलोड करें",
        "नाम, जन्म तिथि, पते के साथ फॉर्म 6 भरें",
        "आयु प्रमाण, पते का प्रमाण और फोटो अपलोड करें",
        "जमा करें और अपना संदर्भ नंबर नोट करें",
        "बूथ स्तर के अधिकारी द्वारा क्षेत्र सत्यापन"
      ],
      source: "भारत निर्वाचन आयोग"
    }
  },
  voting_process: {
    keywords: ["voting process", "how to vote", "election process", "evm", "vvpat", "voting steps", "casting vote"],
    en: {
      text: "The voting process in India uses EVM and VVPAT:",
      bullets: [
        "Show your identity document at the polling station",
        "Your name is verified in the electoral roll",
        "Proceed to the Ballot Unit and press the blue button",
        "A beep and green light confirm your vote",
        "VVPAT prints a paper slip for verification"
      ],
      source: "Election Commission of India"
    },
    hi: {
      text: "भारत में मतदान प्रक्रिया EVM और VVPAT का उपयोग करती है:",
      bullets: [
        "मतदान केंद्र पर अपना पहचान पत्र दिखाएं",
        "आपका नाम मतदाता सूची में सत्यापित होता है",
        "बैलेट यूनिट पर जाएं और नीला बटन दबाएं",
        "एक बीप और हरी बत्ती आपके वोट की पुष्टि करती है",
        "VVPAT सत्यापन के लिए कागज की पर्ची प्रिंट करता है"
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