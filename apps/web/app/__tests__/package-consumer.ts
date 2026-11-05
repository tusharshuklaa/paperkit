import * as documentEngine from '@repo/document-engine';
import { CATEGORY_LABELS, type Tool, tools, toolsInDisplayOrder } from '@repo/tool-registry';

const registry: Tool[] = tools;
const ordered: Tool[] = toolsInDisplayOrder(registry as readonly Tool[]);
const labels: Record<Tool['category'], string> = CATEGORY_LABELS;
const engine: Record<string, never> = documentEngine;

void [ordered, labels, engine];
