import { afterEach, expect, test } from 'bun:test';
import { type Tool, tools } from '@repo/tool-registry';
import { toolListJsonLd } from '../../lib/tool-list-json-ld';

const initialTools = [...tools];

afterEach(() => {
  tools.splice(0, tools.length, ...initialTools);
});

test('omits JSON-LD without an origin or without live Tools', () => {
  expect(toolListJsonLd()).toBeUndefined();
  tools.splice(0, 1);
  expect(toolListJsonLd(new URL('https://shell.example.test'))).toBeUndefined();
});

test('publishes only synthetic live Tools in stable display order', () => {
  const later: Tool = {
    ...tools[0],
    id: 'synthetic-later',
    name: 'Synthetic Later',
    status: 'live',
    href: 'https://later.example.test/create',
    order: 20,
  };
  const earlier: Tool = {
    ...later,
    id: 'synthetic-earlier',
    name: 'Synthetic Earlier',
    href: 'https://earlier.example.test/create',
    order: 10,
  };
  tools.push(later, earlier);
  expect(toolListJsonLd()).toBeUndefined();
  const result = toolListJsonLd(new URL('https://shell.example.test'));
  expect(result).toEqual({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    url: 'https://shell.example.test/',
    itemListElement: [tools[0], earlier, later].map((tool, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: tool.name,
      description: tool.description,
      url: new URL(tool.href as string, 'https://shell.example.test').href,
    })),
  });
});

test('rejects invalid registry destinations instead of publishing them', () => {
  tools.push({
    ...tools[0],
    id: 'synthetic-invalid',
    status: 'live',
    href: 'http://generator.example.test',
  });
  expect(() => toolListJsonLd(new URL('https://shell.example.test'))).toThrow();
});
