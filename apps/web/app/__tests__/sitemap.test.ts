import { afterEach, expect, test } from 'bun:test';
import { tools } from '@repo/tool-registry';
import sitemap from '../sitemap';

const initialTools = [...tools];
const previous = process.env.PAPERKIT_CANONICAL_ORIGIN;

afterEach(() => {
  tools.splice(0, tools.length, ...initialTools);
  if (previous === undefined) Reflect.deleteProperty(process.env, 'PAPERKIT_CANONICAL_ORIGIN');
  else process.env.PAPERKIT_CANONICAL_ORIGIN = previous;
});

test('returns no sitemap entries without configured origin, even with live Tools', () => {
  Reflect.deleteProperty(process.env, 'PAPERKIT_CANONICAL_ORIGIN');
  tools.push({
    ...tools[0],
    id: 'synthetic-live',
    status: 'live',
    href: 'https://generator.example.test/create',
  });
  expect(sitemap()).toEqual([]);
});

test('lists the shell only when every Tool is Coming Soon', () => {
  process.env.PAPERKIT_CANONICAL_ORIGIN = 'https://shell.example.test';
  tools.splice(0, 1);
  expect(sitemap()).toEqual([{ url: 'https://shell.example.test/' }]);
});

test('lists the shell and only validated live destinations in display order', () => {
  process.env.PAPERKIT_CANONICAL_ORIGIN = 'https://shell.example.test';
  tools.push(
    {
      ...tools[0],
      id: 'synthetic-later',
      status: 'live',
      href: 'https://later.example.test/create',
      order: 20,
    },
    {
      ...tools[0],
      id: 'synthetic-earlier',
      status: 'live',
      href: 'https://earlier.example.test/create',
      order: 10,
    },
  );
  expect(sitemap()).toEqual([
    { url: 'https://shell.example.test/' },
    { url: 'https://shell.example.test/driver-salary-slip' },
    { url: 'https://earlier.example.test/create' },
    { url: 'https://later.example.test/create' },
  ]);
});

test('rejects invalid origin and invalid live destinations', () => {
  process.env.PAPERKIT_CANONICAL_ORIGIN = 'https://shell.example.test/path';
  expect(() => sitemap()).toThrow();
  process.env.PAPERKIT_CANONICAL_ORIGIN = 'https://shell.example.test';
  tools.push({
    ...tools[0],
    id: 'synthetic-invalid',
    status: 'live',
    href: 'https://user:password@generator.example.test',
  });
  expect(() => sitemap()).toThrow();
});
