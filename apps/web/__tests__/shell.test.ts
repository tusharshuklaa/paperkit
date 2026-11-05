import { test as base, expect } from '@playwright/test';

const test = base.extend<{ browserHealth: undefined }>({
  browserHealth: [
    async ({ page }, use) => {
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await use(undefined);
      expect(errors, 'No uncaught browser errors').toEqual([]);
    },
    { auto: true },
  ],
});

const toolNames = ['Driver Salary Slip', 'Petrol & Fuel Receipt', 'House Rent Receipt'];
const amounts = ['18,500.00', '4,560.00', '1,240.00', '-2,000.00', '₹ 22,300.00'];
const sampleName = 'Sample Driver Disbursement Voucher';

test.afterEach(async ({ page }, testInfo) => {
  if (page.url() === 'about:blank') return;
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      document
        .getAnimations()
        .filter((animation) => Number.isFinite(animation.effect?.getComputedTiming().endTime))
        .map((animation) => animation.finished.catch(() => undefined)),
    );
  });
  const screenshot = testInfo.outputPath(`${testInfo.project.name}.png`);
  await page.screenshot({ path: screenshot, fullPage: true });
  await testInfo.attach('shell', { path: screenshot, contentType: 'image/png' });
});

test('approved shell content, Catalog availability, and real anchors', async ({ page }) => {
  await page.goto('/');
  for (const heading of [
    'Everyday paperwork, done in seconds.',
    'Driver Disbursement Voucher',
    'Available Instruments',
    'Operational Protocol',
    'Why PaperKit is unconditionally free.',
  ]) {
    await expect(page.getByRole('heading', { name: heading, exact: true })).toBeVisible();
  }
  for (const claim of ['No signup', '100% free', 'No watermark', 'Private by design']) {
    await expect(page.getByText(claim, { exact: true })).toBeVisible();
  }
  const catalog = page.getByRole('region', { name: 'Available Instruments' });
  const cards = catalog.getByRole('article');
  await expect(cards).toHaveCount(3);
  await expect(cards.getByRole('heading')).toHaveText(toolNames);
  for (const card of await cards.all()) {
    await expect(card.getByText('Coming Soon', { exact: true })).toBeVisible();
    await expect(card.getByRole('link')).toHaveCount(0);
    await expect(card.getByRole('button')).toHaveCount(0);
  }
  for (const [label, target, region] of [
    ['Tools', '#tool-catalog', 'Available Instruments'],
    ['About', '#about', 'Why PaperKit is unconditionally free.'],
    ['See how it works', '#how-it-works', 'Operational Protocol'],
    ['Browse tools', '#tool-catalog', 'Available Instruments'],
  ]) {
    const link = page.getByRole('link', { name: label, exact: true });
    await expect(link).toHaveAttribute('href', target);
    await link.click();
    await expect(page).toHaveURL(new RegExp(`${target}$`));
    await expect(page.getByRole('region', { name: region })).toBeInViewport();
  }
  const workflow = page.getByRole('region', { name: 'Operational Protocol' });
  await expect(workflow.getByRole('listitem')).toHaveCount(3);
  await expect(workflow.getByRole('heading', { level: 3 })).toHaveText([
    'Input Raw Metadata',
    'Instant Print Inspection',
    'Print or Export Vector PDF',
  ]);
  const footer = page.getByRole('contentinfo');
  for (const [group, labels] of [
    ['Instruments', ['Salary Slip', 'Driver Voucher', 'Rent Receipt', 'Fuel Bill']],
    ['Standards', ['Compliance', 'TDS & HRA', 'Verification', 'Print Specs']],
    ['System', ['Status Ledger', 'Changelog', 'Privacy Policy', 'Terms']],
  ] as const) {
    const navigation = footer.getByRole('navigation', { name: group });
    await expect(navigation.getByRole('link')).toHaveText([...labels]);
    for (const link of await navigation.getByRole('link').all()) {
      await expect(link).toHaveAttribute('href', '#');
    }
  }
  await expect(footer.getByRole('heading', { name: 'Organization' })).toBeVisible();
  await expect(footer.getByText('PaperKit Institutional', { exact: true })).toBeVisible();
  await expect(footer.getByText('v2.4.0-IN-STABLE', { exact: true })).toBeVisible();
  await expect(
    footer.getByText('© 2025 PaperKit. Deterministic ledger instruments.'),
  ).toBeVisible();
});

test('system theme and persistent native toggle preserve visible content and amounts', async ({
  page,
}, testInfo) => {
  await page.goto('/');
  const initial = testInfo.project.use.colorScheme;
  const opposite = initial === 'dark' ? 'light' : 'dark';
  await expect(page.locator('html')).toHaveCSS('color-scheme', initial as string);
  const before = await page.getByRole('main').innerText();
  const control = page.getByRole('button', { name: 'Toggle theme', exact: true });
  await expect(control).toBeEnabled();
  expect(await control.evaluate((element) => element.tagName)).toBe('BUTTON');
  await control.click();
  await expect(page.locator('html')).toHaveCSS('color-scheme', opposite);
  expect(await page.getByRole('main').innerText()).toBe(before);
  await page.reload();
  await expect(page.locator('html')).toHaveCSS('color-scheme', opposite);
  expect(await page.getByRole('main').innerText()).toBe(before);
  await expect(page.getByRole('article', { name: sampleName }).getByRole('cell')).toHaveText(
    amounts,
  );
});

test('sample financial values stay fixed through document and stamp entrance', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const paper = page.getByRole('article', { name: sampleName });
  await paper.waitFor({ state: 'attached' });
  const samples = await paper.evaluate(async (element) => {
    const frames: string[][] = [];
    const started = performance.now();
    await new Promise<void>((resolve) => {
      const sample = () => {
        frames.push(
          Array.from(element.querySelectorAll('td'), (cell) => cell.textContent?.trim() ?? ''),
        );
        if (performance.now() - started < 1500) requestAnimationFrame(sample);
        else resolve();
      };
      sample();
    });
    return frames;
  });
  expect(samples.length).toBeGreaterThan(1);
  for (const frame of samples) expect(frame).toEqual(amounts);
  const values = amounts.map((amount) => Number(amount.replace(/[^\d.-]/g, '')));
  expect(values.slice(0, -1).reduce((total, value) => total + value, 0)).toBe(values.at(-1));
  await expect(paper.getByText('PAID · IN-BROWSER', { exact: true })).toBeVisible();
  await expect(paper.getByText('Rajesh Kumar Verma', { exact: true })).toBeVisible();
  await expect(paper.getByText('October 2024', { exact: true })).toBeVisible();
});

test('reduced motion presents finished paper and stamp immediately', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const paper = page.getByRole('article', { name: sampleName });
  const stamp = paper.getByText('PAID · IN-BROWSER', { exact: true });
  for (const element of [paper, stamp]) {
    await element.waitFor({ state: 'attached' });
    const appearance = await element.evaluate((node) => {
      const style = getComputedStyle(node);
      return {
        animation: style.animationName,
        opacity: style.opacity,
        visibility: style.visibility,
      };
    });
    expect(appearance).toEqual({ animation: 'none', opacity: '1', visibility: 'visible' });
    await expect(element).toBeVisible();
  }
  await expect(paper.getByRole('cell')).toHaveText(amounts);
});

test('keyboard order exposes skip link and visibly focused native controls', async ({ page }) => {
  await page.goto('/');
  const skip = page.getByRole('link', { name: 'Skip to content', exact: true });
  const targets = [
    skip,
    page.getByRole('link', { name: 'PaperKit home', exact: true }),
    page
      .getByRole('navigation', { name: 'Main navigation' })
      .getByRole('link', { name: 'Tools', exact: true }),
    page
      .getByRole('navigation', { name: 'Main navigation' })
      .getByRole('link', { name: 'About', exact: true }),
    page.getByRole('button', { name: 'Toggle theme', exact: true }),
  ];
  for (const target of targets) {
    await page.keyboard.press('Tab');
    await expect(target).toBeFocused();
    await expect(target).toBeInViewport();
    expect(
      await target.evaluate((element) => {
        const style = getComputedStyle(element);
        return (
          element.matches(':focus-visible') &&
          style.outlineStyle !== 'none' &&
          Number.parseFloat(style.outlineWidth) > 0 &&
          style.outlineColor !== 'transparent'
        );
      }),
    ).toBe(true);
  }
  await skip.focus();
  await expect(skip).toHaveAttribute('href', '#main');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#main$/);
  await expect(page.getByRole('main')).toBeInViewport();
});

test('approved fonts and icon artwork load without failed assets', async ({ page }) => {
  const failedAssets: string[] = [];
  page.on('response', (response) => {
    if (
      ['font', 'stylesheet', 'image'].includes(response.request().resourceType()) &&
      !response.ok()
    ) {
      failedAssets.push(`${response.status()} ${response.url()}`);
    }
  });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  const fonts = await page.evaluate(() => ({
    ui: getComputedStyle(document.body).fontFamily,
    numbers: getComputedStyle(document.querySelector('td') as Element).fontFamily,
    loaded: Array.from(document.fonts)
      .filter((font) => font.status === 'loaded')
      .map((font) => font.family),
  }));
  expect.soft(fonts.ui).toMatch(/source.?sans/i);
  expect.soft(fonts.numbers).toMatch(/jetbrains/i);
  expect.soft(fonts.loaded.some((family) => /source.?sans/i.test(family))).toBe(true);
  expect.soft(fonts.loaded.some((family) => /jetbrains/i.test(family))).toBe(true);
  const artwork = [
    page.getByRole('link', { name: 'PaperKit home' }),
    ...(await page
      .getByRole('region', { name: 'Available Instruments' })
      .getByRole('article')
      .all()),
    page.getByRole('button', { name: 'Toggle theme' }),
  ];
  for (const owner of artwork) {
    const icon = owner.locator('svg:visible');
    await expect(icon).toHaveCount(1);
    expect(
      await icon.evaluate((element) => {
        const bounds = element.getBoundingClientRect();
        return (
          bounds.width > 0 &&
          bounds.height > 0 &&
          element.querySelectorAll('path, rect, circle, line, polyline').length > 0
        );
      }),
    ).toBe(true);
  }
  expect(failedAssets).toEqual([]);
});

test('normal text meets canvas contrast in system theme', async ({ page }) => {
  await page.goto('/');
  const contrast = await page.evaluate(() => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas unavailable');
    const luminance = (color: string) => {
      context.fillStyle = color;
      context.fillRect(0, 0, 1, 1);
      const channels = Array.from(context.getImageData(0, 0, 1, 1).data)
        .slice(0, 3)
        .map((channel) => {
          const value = channel / 255;
          return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
        });
      return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
    };
    const background = luminance(getComputedStyle(document.body).backgroundColor);
    return [
      document.body,
      ...Array.from(document.querySelectorAll('footer a, main > section:first-child p')),
    ].map((element) => {
      const foreground = luminance(getComputedStyle(element).color);
      return (Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05);
    });
  });
  for (const ratio of contrast) expect(ratio).toBeGreaterThanOrEqual(4.5);
});

test('shell has no horizontal overflow across phone, tablet, and desktop widths', async ({
  page,
}) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  const original = page.viewportSize();
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: original?.height ?? 844 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      width,
    );
    expect(
      await page.getByRole('main').evaluate((element) => element.scrollWidth),
    ).toBeLessThanOrEqual(width);
  }
  if (original) await page.setViewportSize(original);
});

test('HTTP preview omits origin-dependent SEO and unavailable Tool results', async ({
  request,
  page,
}) => {
  const response = await request.get('/');
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('text/html');
  const html = await response.text();
  await page.goto('/');
  const metadata = await page.evaluate((source) => {
    const document = new DOMParser().parseFromString(source, 'text/html');
    return {
      title: document.title,
      canonical: document.querySelectorAll('link[rel="canonical"]').length,
      originTags: document.querySelectorAll('meta[property="og:url"], meta[name="twitter:url"]')
        .length,
      structuredData: Array.from(
        document.querySelectorAll('script[type="application/ld+json"]'),
        (script) => JSON.parse(script.textContent ?? '{}'),
      ),
    };
  }, html);
  expect(metadata.title).toBe('PaperKit | Everyday paperwork, done in seconds.');
  expect(metadata.canonical).toBe(0);
  expect(metadata.originTags).toBe(0);
  expect(JSON.stringify(metadata.structuredData)).not.toContain('ItemList');
  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.status()).toBe(200);
  expect(sitemap.headers()['content-type']).toContain('xml');
  const xml = await sitemap.text();
  const entries = await page.evaluate((source) => {
    const document = new DOMParser().parseFromString(source, 'application/xml');
    return {
      errors: document.querySelectorAll('parsererror').length,
      roots: document.getElementsByTagNameNS(
        'http://www.sitemaps.org/schemas/sitemap/0.9',
        'urlset',
      ).length,
      urls: document.getElementsByTagName('url').length,
      locations: document.getElementsByTagName('loc').length,
    };
  }, xml);
  expect(entries).toEqual({ errors: 0, roots: 1, urls: 0, locations: 0 });
});
