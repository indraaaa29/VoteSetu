import { interceptIntent } from '../lib/intent-interceptor';

const testQueries = [
  { q: "Can I vote if I am 17?", expected: "ELIGIBILITY" },
  { q: "What documents do I need to apply?", expected: "DOCUMENTS" },
  { q: "How many voters are there in India?", expected: "STATS" },
  { q: "Where is my polling booth?", expected: "BOOTH" }
];

console.log("--- SECTION 1: INTERCEPTOR TEST ---");
testQueries.forEach(({q, expected}) => {
  const res = interceptIntent(q, 'en');
  console.log(`Query: "${q}"`);
  console.log(`Match: ${res ? 'YES' : 'NO'}`);
  if (res) {
    console.log(`Type: ${res.text.includes("vote") ? 'ELIGIBILITY' : res.text.includes("document") ? 'DOCUMENTS' : res.text.includes("estimate") ? 'STATS' : 'BOOTH'}`);
  }
  console.log("---");
});

console.log("\n--- SECTION 3: LANGUAGE TEST ---");
const isHindi = (t: string) => /[\u0900-\u097F]/.test(t);
console.log(`"What documents are required?": ${isHindi("What documents are required?") ? 'hi' : 'en'}`);
console.log(`"मुझे वोट देने के लिए क्या चाहिए?": ${isHindi("मुझे वोट देने के लिए क्या चाहिए?") ? 'hi' : 'en'}`);

console.log("\n--- SECTION 5: FORMATTING TEST ---");
const normalize = (text: string) => {
  return text
    .replace(/\*\*/g, "")
    .split(/\n|\./)
    .map(s => s.trim())
    .filter(Boolean)
    .map(s => s.startsWith("-") ? s : `- ${s}`)
    .join("\n");
};
const messy = "**Step 1**: Register online. \n**Step 2**: Get verified.";
console.log("Input:", messy);
console.log("Normalized:\n", normalize(messy));
