import { detectLanguage, validateInput } from '../lib/utils';
import { interceptIntent } from '../lib/intent-interceptor';

console.log("--- VOTE SETU LOGIC TESTS ---");

// Test 1: Language Detection
const hiTest = /[\u0900-\u097F]/.test("क्या");
console.log(`Detect Language ("क्या"): ${hiTest ? 'hi' : 'en'} (Expected: hi)`);

// Test 2: Input Validation
const validateInput = (input: string) => input.trim().length > 0 && input.length <= 800;
console.log(`Validate Input (""): ${validateInput("")} (Expected: false)`);
console.log(`Validate Input ("hello"): ${validateInput("hello")} (Expected: true)`);

// Test 3: Intent Interceptor
const intercepted = interceptIntent("documents required", "en");
console.log(`Intercept ("documents required"): ${intercepted ? 'SUCCESS' : 'FAILED'}`);
if (intercepted) {
  console.log(`Title: ${intercepted.text}`);
  console.log(`Bullets: ${intercepted.bullets.length} items`);
}

const interceptedHi = interceptIntent("who can vote", "hi");
console.log(`Intercept ("who can vote", hi): ${interceptedHi ? 'SUCCESS' : 'FAILED'}`);
if (interceptedHi) {
  console.log(`Title: ${interceptedHi.text}`);
}
