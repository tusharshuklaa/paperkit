import { describe, expect, test } from 'bun:test';
import { type Tool, tools, toolsInDisplayOrder } from '@repo/tool-registry';

describe('toolsInDisplayOrder', () => {
  test('returns a sorted copy and preserves equal-order input order', () => {
    const first = { ...tools[0], id: 'first', order: 2 };
    const second = { ...tools[0], id: 'second', order: 1 };
    const third = { ...tools[0], id: 'third', order: 2 };
    const input = Object.freeze([first, second, third]);
    const result = toolsInDisplayOrder(input);
    expect(result).not.toBe(input);
    expect(result).toEqual([second, first, third]);
    expect(input).toEqual([first, second, third]);
    expect(toolsInDisplayOrder()).toEqual(tools);
  });

  test('accepts synthetic live HTTPS destinations', () => {
    const live: Tool = {
      ...tools[0],
      id: 'synthetic-live',
      status: 'live',
      href: 'https://generator.example.test/create?format=a4#preview',
    };
    expect(toolsInDisplayOrder([live])).toEqual([live]);
  });

  test.each([
    undefined,
    '',
    '/generator',
    'https:generator.example.test',
    'https:/generator.example.test',
    'not a URL',
    'http://generator.example.test',
    'javascript:alert(1)',
    'https://user:password@generator.example.test',
    'https://user@generator.example.test',
    'https://:password@generator.example.test',
  ])('rejects invalid runtime live destination %p', (href) => {
    const live = { ...tools[0], status: 'live', href } as Tool;
    expect(() => toolsInDisplayOrder([live])).toThrow();
  });

  test('rejects runtime coming-soon navigation, including undefined', () => {
    for (const href of ['https://generator.example.test', undefined]) {
      const invalid = { ...tools[0], href } as unknown as Tool;
      expect(() => toolsInDisplayOrder([invalid])).toThrow();
    }
  });

  test('rejects unknown status and non-finite ordering', () => {
    const invalid = { ...tools[0], status: 'operational' } as unknown as Tool;
    expect(() => toolsInDisplayOrder([invalid])).toThrow();
    for (const order of [Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(() => toolsInDisplayOrder([{ ...tools[0], order }])).toThrow();
    }
  });
});
