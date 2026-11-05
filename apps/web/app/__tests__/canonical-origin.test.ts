import { afterEach, describe, expect, test } from 'bun:test';
import { canonicalOrigin } from '../../lib/canonical-origin';

const previous = process.env.PAPERKIT_CANONICAL_ORIGIN;

afterEach(() => {
  if (previous === undefined) Reflect.deleteProperty(process.env, 'PAPERKIT_CANONICAL_ORIGIN');
  else process.env.PAPERKIT_CANONICAL_ORIGIN = previous;
});

describe('canonicalOrigin', () => {
  test('omits an absent origin without inventing a default', () => {
    Reflect.deleteProperty(process.env, 'PAPERKIT_CANONICAL_ORIGIN');
    expect(canonicalOrigin()).toBeUndefined();
  });

  test.each([
    ['https://shell.example.test', 'https://shell.example.test/'],
    ['https://shell.example.test/', 'https://shell.example.test/'],
    ['http://localhost:3000', 'http://localhost:3000/'],
  ])('accepts configured origin %s', (configured, expected) => {
    process.env.PAPERKIT_CANONICAL_ORIGIN = configured;
    expect(canonicalOrigin()).toBeInstanceOf(URL);
    expect(canonicalOrigin()?.href).toBe(expected);
  });

  test.each([
    '',
    'not a URL',
    '/relative',
    'https:shell.example.test',
    'https:/shell.example.test',
    'ftp://shell.example.test',
    'javascript:alert(1)',
    'https://user:password@shell.example.test',
    'https://user@shell.example.test',
    'https://:password@shell.example.test',
    'https://shell.example.test/tools',
    'https://shell.example.test/tools/..',
    'https://shell.example.test/?preview=true',
    'https://shell.example.test/?',
    'https://shell.example.test/#catalog',
    'https://shell.example.test/#',
  ])('rejects invalid configured origin %p', (configured) => {
    process.env.PAPERKIT_CANONICAL_ORIGIN = configured;
    expect(() => canonicalOrigin()).toThrow();
  });
});
