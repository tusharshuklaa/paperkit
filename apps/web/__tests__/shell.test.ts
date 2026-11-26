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
const amounts = ['₹18,500.00', '₹4,560.00', '₹1,240.00', '-₹2,000.00', '₹22,300.00'];
const sampleName = 'Illustrative Driver salary slip';

test('Plum & Stone tokens follow the shell theme', async ({ page }, testInfo) => {
  await page.goto('/');
  const expected = {
    light: { canvas: '#f6f5f5', accent: '#75496c', field: '#e7dce5' },
    dark: { canvas: '#211d23', accent: '#eabfe0', field: '#4c3b4b' },
  };
  const initial = testInfo.project.use.colorScheme === 'dark' ? 'dark' : 'light';
  const opposite = initial === 'dark' ? 'light' : 'dark';
  const tokens = () =>
    page.evaluate(() => {
      const style = getComputedStyle(document.documentElement);
      return {
        canvas: style.getPropertyValue('--canvas').trim(),
        accent: style.getPropertyValue('--accent').trim(),
        field: style.getPropertyValue('--surface-alt').trim(),
      };
    });
  await expect.poll(tokens).toEqual(expected[initial]);
  await page.getByRole('button', { name: 'Toggle theme' }).click();
  await expect.poll(tokens).toEqual(expected[opposite]);
  await expect(page.getByRole('article', { name: sampleName })).toHaveCSS(
    'background-color',
    'rgb(255, 255, 255)',
  );
});

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
    'PaperKit.',
    'Good on paper.',
    "For life's paperwork.",
    'Less admin. More everyday.',
    'A few useful answers.',
  ]) {
    await expect(page.getByRole('heading', { name: heading, exact: true })).toBeVisible();
  }
  for (const claim of ['No signup', '100% free', 'No watermark', 'Private by design']) {
    await expect(page.getByText(claim, { exact: true })).toHaveCount(0);
  }
  const catalog = page.getByRole('region', { name: "For life's paperwork." });
  const cards = catalog.getByRole('article');
  await expect(cards).toHaveCount(3);
  await expect(cards.getByRole('heading')).toHaveText(toolNames);
  await expect(
    cards.first().getByRole('link', { name: 'Open Driver Salary Slip' }),
  ).toHaveAttribute('href', '/driver-salary-slip');
  for (const card of await cards.all().then((items) => items.slice(1))) {
    await expect(card.getByText('Coming Soon', { exact: true })).toBeVisible();
    await expect(card.getByRole('link')).toHaveCount(0);
    await expect(card.getByRole('button')).toHaveCount(0);
  }
  for (const [label, target, region] of [
    ['Tools', '#tool-catalog', "For life's paperwork."],
    ['About', '#about', 'Less admin. More everyday.'],
    ['Browse tools', '#tool-catalog', "For life's paperwork."],
  ]) {
    const link = page.getByRole('link', { name: label, exact: true });
    await expect(link).toHaveAttribute('href', target);
    await link.click();
    await expect(page).toHaveURL(new RegExp(`${target}$`));
    await expect(page.getByRole('region', { name: region })).toBeInViewport();
  }
  const footer = page.getByRole('contentinfo');
  await expect(footer.getByRole('link', { name: 'Tool catalog' })).toHaveAttribute(
    'href',
    '#tool-catalog',
  );
  await expect(footer.getByRole('link', { name: 'About PaperKit' })).toHaveAttribute(
    'href',
    '#about',
  );
  await expect(page.locator('a[href="#"]')).toHaveCount(0);
  await page.getByText('Can I create a document today?', { exact: true }).click();
  await expect(
    page.getByText('Available tools are linked in the catalog.', { exact: false }),
  ).toBeVisible();
});

test('live driver tool shares navigation, footer, theme, and receipt-only print', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Open Driver Salary Slip' }).click();
  await expect(page).toHaveURL(/\/driver-salary-slip$/);
  const header = page.getByRole('banner');
  await expect(header.getByRole('link', { name: 'PaperKit home' })).toHaveAttribute('href', '/');
  await expect(header.getByText('Driver Salary Slip')).toBeVisible();
  await expect(header.getByRole('link', { name: 'Tools' })).toHaveAttribute(
    'href',
    '/#tool-catalog',
  );
  await expect(header.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/#about');
  await expect(page.getByRole('heading', { name: 'Receipt details' })).toHaveCSS(
    'font-size',
    '18px',
  );
  await expect(page.getByRole('heading', { name: 'Less admin. More everyday.' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'A few useful answers.' })).toBeVisible();
  await expect(page.locator('.receipt-stamp img')).toHaveJSProperty('complete', true);
  expect(
    await page
      .locator('.receipt-stamp img')
      .evaluate((image: HTMLImageElement) => image.naturalWidth),
  ).toBeGreaterThan(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
    page.viewportSize()?.width ?? 0,
  );
  await page.emulateMedia({ media: 'print' });
  await expect(header).toBeHidden();
  await expect(
    page.getByRole('heading', { name: 'Less admin. More everyday.', includeHidden: true }),
  ).toBeHidden();
  await expect(page.locator('.receipt-paper')).toBeVisible();
  await page.emulateMedia({ media: 'screen' });
  await header.getByRole('link', { name: 'Tools' }).click();
  await expect(page).toHaveURL(/\/#tool-catalog$/);
});

test('integrated driver tool fills and prints a receipt', async ({ page }) => {
  await page.addInitScript(() => {
    window.print = () => localStorage.setItem('test-printed', 'yes');
  });
  await page.goto('/driver-salary-slip');
  await page.getByLabel('Driver name', { exact: true }).fill('Asha Example');
  await page.getByLabel('Payer name', { exact: true }).fill('Morgan Sample');
  await page.getByLabel('Vehicle number', { exact: true }).fill('KA03AB1234');
  await page.getByLabel('Salary amount', { exact: true }).fill('12500');
  await expect(page.locator('.receipt-paper')).toContainText('Asha Example');
  await page.getByRole('button', { name: 'Print receipt' }).click();
  await page.getByRole('button', { name: 'Just Print' }).click();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('test-printed'))).toBe('yes');
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
  await expect(page.getByRole('article', { name: sampleName })).toHaveCSS(
    'background-color',
    'rgb(255, 255, 255)',
  );
});

test('sample financial values stay fixed without ambient animations', async ({ page }) => {
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
  expect(await paper.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(
    0,
  );
  await expect(paper.getByText('Rajesh Kumar Verma', { exact: true })).toBeVisible();
  await expect(paper.getByText('October 2024', { exact: true })).toBeVisible();
});

test('reduced motion removes stack transforms including hover and focus', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const paper = page.getByRole('article', { name: sampleName });
  for (const element of [paper, page.getByTestId('front-paper'), page.getByTestId('rear-paper')]) {
    await element.waitFor({ state: 'attached' });
    const appearance = await element.evaluate((node) => {
      const style = getComputedStyle(node);
      return {
        animation: style.animationName,
        opacity: style.opacity,
        visibility: style.visibility,
        transform: style.transform,
        transition: style.transitionDuration,
      };
    });
    expect(appearance).toEqual({
      animation: 'none',
      opacity: '1',
      visibility: 'visible',
      transform: 'none',
      transition: '0s',
    });
  }
  await expect(paper.getByRole('cell')).toHaveText(amounts);
  await page.getByTestId('document-stack').hover();
  await page.getByRole('button', { name: 'Fuel', exact: true }).focus();
  for (const layer of ['front-paper', 'rear-paper']) {
    await expect(page.getByTestId(layer)).toHaveCSS('transform', 'none');
  }
  await page.getByRole('button', { name: 'Fuel', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Fuel', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await expect(page.getByRole('article', { name: 'Illustrative Fuel receipt' })).toBeVisible();
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
    display: getComputedStyle(document.querySelector('h1') as Element).fontFamily,
    loaded: Array.from(document.fonts)
      .filter((font) => font.status === 'loaded')
      .map((font) => font.family),
  }));
  expect.soft(fonts.ui).toMatch(/manrope/i);
  expect.soft(fonts.display).toMatch(/bricolage/i);
  expect.soft(fonts.loaded.some((family) => /manrope/i.test(family))).toBe(true);
  expect.soft(fonts.loaded.some((family) => /bricolage/i.test(family))).toBe(true);
  const artwork = [
    page.getByRole('link', { name: 'PaperKit home' }),
    ...(await page
      .getByRole('region', { name: "For life's paperwork." })
      .getByRole('article')
      .all()),
    page.getByRole('button', { name: 'Toggle theme' }),
  ];
  for (const owner of artwork) {
    const icon = owner.locator('svg:visible').first();
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
    return [
      document.body,
      ...Array.from(document.querySelectorAll('footer a, main > section:first-child p')),
    ].map((element) => {
      let surface: Element | null = element;
      let backgroundColor = 'transparent';
      while (surface) {
        backgroundColor = getComputedStyle(surface).backgroundColor;
        if (backgroundColor !== 'transparent' && backgroundColor !== 'rgba(0, 0, 0, 0)') break;
        surface = surface.parentElement;
      }
      const background = luminance(backgroundColor);
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
  expect(metadata.title).toBe('PaperKit | Everyday document tools');
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

test('sample selection preserves stage geometry, control widths, and truthful totals', async ({
  page,
}) => {
  await page.goto('/');
  const stage = page.getByRole('group', { name: 'Document samples', exact: true });
  const selector = page.getByRole('group', { name: 'Document sample', exact: true });
  await page.evaluate(() => document.fonts.ready);
  const initialStage = await stage.boundingBox();
  const widths = await selector
    .getByRole('button')
    .evaluateAll((buttons) => buttons.map((button) => button.getBoundingClientRect().width));
  for (const [label, name] of [
    ['Fuel', 'Illustrative Fuel receipt'],
    ['Rent', 'Illustrative House rent receipt'],
    ['Salary', sampleName],
  ]) {
    const button = selector.getByRole('button', { name: label, exact: true });
    await button.click();
    await expect(button).toHaveAttribute('aria-pressed', 'true');
    await expect(selector.locator('[aria-pressed="true"]')).toHaveCount(1);
    const paper = stage.getByRole('article', { name, exact: true });
    await expect(paper).toBeVisible();
    const values = await paper.getByRole('cell').allTextContents();
    const numbers = values.map((value) => Number(value.replace(/[^\d.-]/g, '')));
    expect(numbers.slice(0, -1).reduce((total, value) => total + value, 0)).toBe(numbers.at(-1));
    expect((await stage.boundingBox())?.height).toBe(initialStage?.height);
    expect(
      await selector
        .getByRole('button')
        .evaluateAll((buttons) => buttons.map((control) => control.getBoundingClientRect().width)),
    ).toEqual(widths);
    for (const control of await selector.getByRole('button').all()) {
      expect((await control.boundingBox())?.height).toBeGreaterThanOrEqual(44);
    }
    const overflow = await paper.evaluate((element) => {
      const bounds = element.getBoundingClientRect();
      const note = element.lastElementChild?.getBoundingClientRect();
      return (note?.bottom ?? 0) > bounds.bottom;
    });
    expect(overflow, 'All sample content stays on its paper').toBe(false);
  }
  await selector.getByRole('button', { name: 'Fuel', exact: true }).click();
  const fuel = stage.getByRole('article', { name: 'Illustrative Fuel receipt' });
  await expect(fuel.getByRole('row')).toHaveCount(2);
  await expect(fuel.getByText('Petrol / 30 litres at INR 100 per litre')).toBeVisible();
});

test('paper stack hover and selector focus share interruptible transform feedback', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const stack = page.getByTestId('document-stack');
  const front = page.getByTestId('front-paper');
  const rear = page.getByTestId('rear-paper');
  const initial = await front.evaluate((element) => getComputedStyle(element).transform);
  const initialRear = await rear.evaluate((element) => getComputedStyle(element).transform);
  await expect(front).toHaveCSS('transition-property', 'transform');
  expect(await stack.getAttribute('tabindex')).toBeNull();
  await expect(stack).not.toHaveCSS('cursor', 'pointer');
  await stack.hover();
  await expect(front).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, -10)');
  const hoveredRear = await rear.evaluate((element) => getComputedStyle(element).transform);
  expect(hoveredRear).not.toBe(initialRear);
  await page.mouse.move(0, 0);
  await expect(front).toHaveCSS('transform', initial);
  const fuel = page.getByRole('button', { name: 'Fuel', exact: true });
  await fuel.focus();
  await expect(front).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, -10)');
  await expect(rear).toHaveCSS('transform', hoveredRear);
  await page.keyboard.press('Enter');
  await expect(fuel).toHaveAttribute('aria-pressed', 'true');
});

test('finalized landing ignores prototype query variants and keyboard switching', async ({
  page,
}) => {
  await page.goto('/');
  const content = await page.getByRole('main').innerText();
  for (const variant of ['a', 'b', 'c', 'x']) {
    await page.goto(`/?variant=${variant}`);
    expect(await page.getByRole('main').innerText()).toBe(content);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('PaperKit.');
    await expect(page.getByText(/Paper Index|Print Room|Clear Desk|prototype/i)).toHaveCount(0);
    await expect(page.locator('a[href*="variant="]')).toHaveCount(0);
    await page.keyboard.press('ArrowRight');
    await expect(page).toHaveURL(new RegExp(`variant=${variant}$`));
  }
});

test('coarse pointers keep paper still while sample controls stay usable', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    baseURL,
    hasTouch: true,
    isMobile: true,
    viewport: { width: 390, height: 844 },
  });
  try {
    const page = await context.newPage();
    await page.goto('/');
    expect(await page.evaluate(() => matchMedia('(pointer: coarse)').matches)).toBe(true);
    const front = page.getByTestId('front-paper');
    const initial = await front.evaluate((element) => getComputedStyle(element).transform);
    await page.getByTestId('document-stack').hover();
    await expect(front).toHaveCSS('transform', initial);
    await page.getByRole('button', { name: 'Rent', exact: true }).tap();
    await expect(
      page.getByRole('article', { name: 'Illustrative House rent receipt', exact: true }),
    ).toBeVisible();
  } finally {
    await context.close();
  }
});
