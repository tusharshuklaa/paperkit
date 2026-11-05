import { type Tool, tools } from '@repo/tool-registry';

const base: Omit<Tool, 'status' | 'href'> = tools[0];

// @ts-expect-error Live Tools require a destination.
const missingDestination: Tool = { ...base, status: 'live' };
// @ts-expect-error Coming Soon Tools cannot navigate.
const comingSoonDestination: Tool = {
  ...base,
  status: 'coming-soon',
  href: 'https://generator.example.test',
};
// @ts-expect-error Coming Soon Tools must omit href, not set undefined.
const undefinedDestination: Tool = { ...base, status: 'coming-soon', href: undefined };

void [missingDestination, comingSoonDestination, undefinedDestination];
