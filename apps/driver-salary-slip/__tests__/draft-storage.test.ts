import { describe, expect, it } from 'bun:test';
import { createDefaultValues } from '../lib/driver-salary-slip/create-default-values';
import { DEFAULT_DECLARATION } from '../lib/driver-salary-slip/default-declaration';
import { draftStorage } from '../lib/driver-salary-slip/draft-storage';

function withLocalStorage<T>(storage: Storage, run: () => T): T {
  const original = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: storage });
  try {
    return run();
  } finally {
    if (original) Object.defineProperty(globalThis, 'localStorage', original);
    else Reflect.deleteProperty(globalThis, 'localStorage');
  }
}

function mockStorage(initial: Record<string, string> = {}): Storage {
  const values = new Map(Object.entries(initial));
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => {
      values.set(key, String(value));
    },
    removeItem: (key) => {
      values.delete(key);
    },
    clear: () => {
      values.clear();
    },
    key: (index) => [...values.keys()][index] ?? null,
    get length() {
      return values.size;
    },
  };
}

function validDraft(now: Date = new Date()) {
  return {
    ...createDefaultValues(now),
    driverName: 'Asha Example',
    payerName: 'Morgan Sample',
    vehicleNumber: 'KA03AB1234',
  };
}

describe('saved salary slip draft', () => {
  it('saves only on request and restores into the current month with supported image data', () => {
    const storage = mockStorage();
    const values = {
      ...validDraft(new Date(2026, 9, 8)),
      paymentDate: new Date(2026, 9, 31),
      salaryMonth: 'August' as const,
      uploadedSignature: 'data:image/png;base64,YWJj',
    };

    expect(withLocalStorage(storage, () => draftStorage.save(values)).saved).toBe(true);
    const restored = withLocalStorage(storage, () => draftStorage.load(new Date(2027, 1, 4)));
    expect(restored).toMatchObject({
      driverName: 'Asha Example',
      payerName: 'Morgan Sample',
      paymentDate: new Date(2027, 1, 4),
      salaryMonth: 'February',
      uploadedSignature: 'data:image/png;base64,YWJj',
    });
  });

  it('falls back to today when a saved day does not exist in current month', () => {
    const storage = mockStorage();
    const values = { ...validDraft(new Date(2026, 0, 3)), paymentDate: new Date(2026, 0, 31) };
    withLocalStorage(storage, () => draftStorage.save(values));

    const restored = withLocalStorage(storage, () => draftStorage.load(new Date(2024, 1, 29)));
    expect(restored?.paymentDate).toEqual(new Date(2024, 1, 29));
    expect(restored?.salaryMonth).toBe('February');
  });

  it('uses the default declaration sentinel and omits oversized signature strings honestly', () => {
    const storage = mockStorage();
    const values = {
      ...validDraft(),
      declaration: DEFAULT_DECLARATION,
      uploadedSignature: `data:image/png;base64,${'a'.repeat(204800)}`,
    };
    const result = withLocalStorage(storage, () => draftStorage.save(values));
    const restored = withLocalStorage(storage, () => draftStorage.load());

    expect(result).toMatchObject({ saved: true, imageSkipped: true });
    expect(restored?.declaration).toBe(DEFAULT_DECLARATION);
    expect(restored?.uploadedSignature).toBe('');
  });

  it('ignores malformed and unsupported records without throwing', () => {
    const storage = mockStorage({
      'paperkit.driver-salary-slip.draft': JSON.stringify({ version: 2, driverName: '<unsafe>' }),
    });
    expect(withLocalStorage(storage, () => draftStorage.load())).toBeNull();
    const malformed = mockStorage({ 'paperkit.driver-salary-slip.draft': '{' });
    expect(withLocalStorage(malformed, () => draftStorage.load())).toBeNull();
  });

  it('clears only the app record and reports unavailable storage', () => {
    const storage = mockStorage({
      unrelated: 'keep',
      'paperkit.driver-salary-slip.draft': 'record',
    });
    expect(withLocalStorage(storage, () => draftStorage.clear())).toBe(true);
    expect(storage.getItem('unrelated')).toBe('keep');
    expect(storage.getItem('paperkit.driver-salary-slip.draft')).toBeNull();

    const throwingStorage = {
      ...mockStorage(),
      setItem: () => {
        throw new Error('blocked');
      },
    } as Storage;
    expect(withLocalStorage(throwingStorage, () => draftStorage.save(validDraft()))).toMatchObject({
      saved: false,
      reason: 'unavailable',
    });
  });

  it('refuses to persist an incomplete receipt', () => {
    expect(draftStorage.save(createDefaultValues())).toMatchObject({
      saved: false,
      reason: 'invalid',
    });
  });
});
