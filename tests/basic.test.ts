import { detectLanguage, validateInput } from '../lib/utils';
import { interceptIntent } from '../lib/intent-interceptor';

/**
 * VoteSetu Basic Logic Tests
 * Verifying language detection, input validation, and intent interception.
 */

// Simple mock for testing without a full framework if needed, 
// but structured for Vitest/Jest compatibility.
const describe = (name: string, fn: Function) => {
  console.log(`\nTesting: ${name}`);
  fn();
};

const it = (name: string, fn: Function) => {
  try {
    fn();
    console.log(`  ✓ ${name}`);
  } catch (e) {
    console.log(`  ✗ ${name} - ${e}`);
  }
};

const expect = (actual: any) => ({
  toBe: (expected: any) => {
    if (actual !== expected) throw new Error(`Expected ${expected}, but got ${actual}`);
  },
  toBeTruthy: () => {
    if (!actual) throw new Error(`Expected truthy, but got ${actual}`);
  },
  toBeFalsy: () => {
    if (actual) throw new Error(`Expected falsy, but got ${actual}`);
  },
  not: {
    toBeNull: () => {
      if (actual === null) throw new Error(`Expected not null, but got null`);
    }
  }
});

describe('detectLanguage', () => {
  it('detects English correctly', () => {
    expect(detectLanguage('hello')).toBe('en');
  });
  it('detects Hindi correctly', () => {
    expect(detectLanguage('क्या')).toBe('hi');
  });
});

describe('validateInput', () => {
  it('rejects empty input', () => {
    expect(validateInput('')).toBeFalsy();
  });
  it('rejects long input', () => {
    const longInput = 'a'.repeat(801);
    expect(validateInput(longInput)).toBeFalsy();
  });
  it('accepts valid input', () => {
    expect(validateInput('How to vote?')).toBeTruthy();
  });
});

describe('interceptIntent', () => {
  it('intercepts documents query', () => {
    const res = interceptIntent('documents needed', 'en');
    expect(res).not.toBeNull();
  });
  it('intercepts eligibility query', () => {
    const res = interceptIntent('can i vote', 'en');
    expect(res).not.toBeNull();
  });
});
