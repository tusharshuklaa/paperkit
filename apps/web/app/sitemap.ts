import { toolsInDisplayOrder } from '@repo/tool-registry';
import type { MetadataRoute } from 'next';
import { canonicalOrigin } from '../lib/canonical-origin';

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = canonicalOrigin();
  if (!origin) return [];

  return [
    { url: origin.href },
    ...toolsInDisplayOrder()
      .filter((tool) => tool.status === 'live')
      .map((tool) => ({ url: tool.href })),
  ];
}
