import type { Tool } from './tool';
import { tools } from './tools';

function validateDestination(tool: Tool) {
  if (tool.status === 'coming-soon') {
    if ('href' in tool) throw new TypeError(`Coming Soon Tool ${tool.id} cannot have an href`);
    return;
  }
  if (tool.status !== 'live') throw new TypeError('Unknown Tool availability status');
  if (typeof tool.href !== 'string') throw new TypeError('Live Tools require an HTTPS href');
  const destination = new URL(tool.href);
  if (
    destination.protocol !== 'https:' ||
    !/^https:\/\//i.test(tool.href) ||
    destination.username ||
    destination.password
  ) {
    throw new TypeError(`Live Tool ${tool.id} requires a credential-free HTTPS href`);
  }
}

export function toolsInDisplayOrder(input: readonly Tool[] = tools): Tool[] {
  for (const tool of input) {
    if (!Number.isFinite(tool.order)) {
      throw new TypeError(`Tool ${tool.id} requires a finite display order`);
    }

    validateDestination(tool);
  }

  return [...input].sort((first, second) => first.order - second.order);
}
