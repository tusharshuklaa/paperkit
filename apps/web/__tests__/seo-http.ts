import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const root = fileURLToPath(new URL('../../../', import.meta.url));
const registryPath = fileURLToPath(
  new URL('../../../packages/tool-registry/src/tools.ts', import.meta.url),
);
const original = await readFile(registryPath, 'utf8');
const environment = Object.fromEntries(
  Object.entries(process.env).filter(([name]) => name !== 'PAPERKIT_CANONICAL_ORIGIN'),
);
const origin = 'https://shell.example.test';
const destination = 'https://generator.example.test/verified-fixture';
const fixture = `\ntools.push({ id: 'synthetic-http-fixture', name: 'Synthetic HTTP fixture', description: 'Isolated acceptance fixture.', category: 'expense-proof', format: 'TEST', icon: 'fuel', order: 99, status: 'live', href: '${destination}' });\n`;

async function build(env: Record<string, string | undefined>) {
  const command = Bun.spawn(['bun', 'run', '--cwd', 'apps/web', 'build'], {
    cwd: root,
    env,
    stdout: 'inherit',
    stderr: 'inherit',
  });
  assert.equal(await command.exited, 0, 'HTTP fixture build succeeds');
}

let server: ReturnType<typeof Bun.spawn> | undefined;
let browser: Awaited<ReturnType<typeof chromium.launch>> | undefined;
try {
  await writeFile(registryPath, original + fixture);
  await build({ ...environment, PAPERKIT_CANONICAL_ORIGIN: origin });
  server = Bun.spawn(['bun', 'run', '--cwd', 'apps/web', 'start', '--port', '3103'], {
    cwd: root,
    env: { ...environment, PAPERKIT_CANONICAL_ORIGIN: origin },
    stdout: 'pipe',
    stderr: 'inherit',
  });
  const reader = (server.stdout as ReadableStream<Uint8Array>).getReader();
  const decoder = new TextDecoder();
  let startup = '';
  while (!startup.includes('Ready')) {
    const chunk = await reader.read();
    assert.equal(chunk.done, false, 'Fixture server starts');
    startup += decoder.decode(chunk.value);
  }
  reader.releaseLock();
  browser = await chromium.launch();
  const page = await browser.newPage();
  const response = await page.goto('http://127.0.0.1:3103');
  assert.equal(response?.status(), 200);
  assert.equal(
    new URL((await page.locator('link[rel="canonical"]').getAttribute('href')) ?? '').href,
    `${origin}/`,
  );
  assert.equal(
    new URL((await page.locator('meta[property="og:url"]').getAttribute('content')) ?? '').href,
    `${origin}/`,
  );
  const structured = JSON.parse(
    await page.locator('script[type="application/ld+json"]').innerText(),
  );
  assert.equal(structured['@type'], 'ItemList');
  assert.equal(structured.url, `${origin}/`);
  assert.equal(structured.itemListElement.length, 1);
  assert.equal(structured.itemListElement[0].url, destination);
  assert.equal(structured.itemListElement[0].name, 'Synthetic HTTP fixture');
  const catalog = page.getByRole('region', { name: "For life's paperwork." });
  assert.equal(await catalog.getByText('Coming Soon', { exact: true }).count(), 3);
  assert.equal(
    await catalog.getByRole('link', { name: 'Open Synthetic HTTP fixture' }).getAttribute('href'),
    destination,
  );
  const sitemap = await page.request.get('http://127.0.0.1:3103/sitemap.xml');
  assert.equal(sitemap.status(), 200);
  const locations = await page.evaluate(
    (xml) =>
      [...new DOMParser().parseFromString(xml, 'application/xml').querySelectorAll('loc')].map(
        (node) => node.textContent,
      ),
    await sitemap.text(),
  );
  assert.deepEqual(locations, [`${origin}/`, destination]);
  console.log(
    'PASS configured-origin HTTP metadata, sitemap, registry-driven discovery and Live-only JSON-LD',
  );
} finally {
  await browser?.close();
  server?.kill();
  if (server) await server.exited;
  await writeFile(registryPath, original);
  await build(environment);
  console.log('RESTORED original Coming Soon registry and no-origin preview build');
}
