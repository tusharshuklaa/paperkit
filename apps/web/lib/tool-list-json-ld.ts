import { toolsInDisplayOrder } from '@repo/tool-registry';

export function toolListJsonLd(origin?: URL) {
  if (!origin) return undefined;

  const liveTools = toolsInDisplayOrder().filter((tool) => tool.status === 'live');
  if (liveTools.length === 0) return undefined;

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    url: origin.href,
    itemListElement: liveTools.map((tool, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: tool.name,
      description: tool.description,
      url: tool.href,
    })),
  };
}
