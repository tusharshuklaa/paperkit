import { readFile } from 'node:fs/promises';
import { dirname, join, sep } from 'node:path';
import { type Download, type Page, expect, test } from '@playwright/test';
import { currencyOptions } from '../../lib/driver-salary-slip/currency-options';

async function fillReceipt(page: Page) {
  await page.getByLabel('Driver name', { exact: true }).fill('Asha Example');
  await page.getByLabel('Payer name', { exact: true }).fill('Morgan Sample');
  await page.getByLabel('Vehicle number', { exact: true }).fill('ka03ab1234');
  await page.getByLabel('Payment date', { exact: true }).fill('2026-11-13');
  await page.getByLabel('Salary month', { exact: true }).selectOption('November');
  await page.getByLabel('Salary amount', { exact: true }).fill('12500');
}

async function downloadReceipt(page: Page) {
  const [download] = await Promise.all([
    page.waitForEvent('download', { timeout: 15_000 }),
    page.getByRole('button', { name: 'Download PDF', exact: true }).click(),
    expect(page.getByText('PDF download started.', { exact: true })).toBeVisible(),
  ]);
  return download;
}

async function readReceiptPdf(download: Download) {
  return readPdf(await readFile(await download.path()));
}

async function readPdf(bytes: Buffer, precision = 1) {
  expect(bytes.subarray(0, 5).toString()).toBe('%PDF-');
  const { getDocument, OPS } = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const task = getDocument({
    data: new Uint8Array(bytes),
    useSystemFonts: false,
    standardFontDataUrl:
      join(dirname(require.resolve('pdfjs-dist/package.json')), 'standard_fonts') + sep,
  });
  try {
    const pdf = await task.promise;
    const pages = [];
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      expect(page.view[2]).toBeCloseTo(595.28, precision);
      expect(page.view[3]).toBeCloseTo(841.89, precision);
      const { items } = await page.getTextContent({ disableNormalization: true });
      const { fnArray } = await page.getOperatorList();
      pages.push({
        text: items
          .flatMap((item) => ('str' in item ? [item.str, item.hasEOL ? '\n' : ''] : []))
          .join(''),
        images: fnArray.filter(
          (op) => op === OPS.paintImageXObject || op === OPS.paintInlineImageXObject,
        ).length,
        landmarks: Object.fromEntries(
          items.flatMap((item) =>
            'str' in item ? [[item.str, item.transform.slice(4, 6) as number[]]] : [],
          ),
        ),
      });
    }
    return pages;
  } finally {
    await task.destroy();
  }
}

for (const [template, label] of [
  [1, /Split receipt/],
  [2, /Summary/],
  [3, /Certification/],
] as const) {
  test(`template ${template} keeps print and download receipt landmarks aligned`, async ({
    page,
  }) => {
    await page.goto('/');
    await fillReceipt(page);
    await page.getByRole('radio', { name: label }).check();
    await page.locator('.signature-adjustments summary').click();
    await page.locator('#signature-x').fill('25');
    await expect(page.getByRole('img', { name: 'Driver signature', exact: true })).toBeVisible();
    await page.evaluate(() => document.fonts.ready);

    const downloaded = await readReceiptPdf(await downloadReceipt(page));
    const printed = await readPdf(await page.pdf({ preferCSSPageSize: true }), 0);
    expect(downloaded).toHaveLength(1);
    expect(printed).toHaveLength(1);
    const landmarks = ['Driver Salary Receipt', 'Driver signature'];
    if (template !== 3) landmarks.push('Receipt Acknowledgement');
    if (template === 3) {
      for (const [receipt] of [downloaded, printed]) {
        expect(receipt.text).toMatch(/PAYER NAME\s+Mr\. Morgan Sample/i);
      }
    }
    for (const landmark of landmarks) {
      const actual = downloaded[0].landmarks[landmark];
      const expected = printed[0].landmarks[landmark];
      expect(actual, `${landmark} in download`).toBeDefined();
      expect(expected, `${landmark} in print`).toBeDefined();
      expect(Math.abs(actual[0] - expected[0]), `${landmark} horizontal offset`).toBeLessThan(5);
      expect(Math.abs(actual[1] - expected[1]), `${landmark} vertical offset`).toBeLessThan(20);
    }

    const declaration = 'Payment was recorded and checked against the sample ledger. '.repeat(90);
    await page.getByRole('textbox', { name: /declaration/i }).fill(`${declaration}Final marker.`);
    for (const pages of [
      await readReceiptPdf(await downloadReceipt(page)),
      await readPdf(await page.pdf({ preferCSSPageSize: true }), 0),
    ]) {
      expect(pages.length).toBeGreaterThan(1);
      expect(pages.map(({ text }) => text).join('\n')).toContain('Final marker.');
      const signaturePage = pages.find(({ text }) => text.includes('Driver signature'));
      expect(signaturePage?.images).toBeGreaterThanOrEqual(1);
      if (template === 2) expect(signaturePage?.text).toContain('Driver Name: Asha Example');
    }
  });
}

test('downloads a receipt-only A4 PDF without opening print or saving a draft', async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.print = () => {
      document.documentElement.dataset.printCalled = 'true';
    };
  });
  await page.goto('/');
  await fillReceipt(page);
  const origin = new URL(page.url()).origin;
  const unexpectedRequests: string[] = [];
  page.on('request', (request) => {
    const url = new URL(request.url());
    if (url.protocol === 'blob:' || url.protocol === 'data:') return;
    if (url.origin !== origin || request.method() !== 'GET' || url.search) {
      unexpectedRequests.push(`${request.method()} ${request.url()}`);
    }
  });
  const download = await downloadReceipt(page);

  expect(download.suggestedFilename()).toBe('driver-salary-receipt-november.pdf');
  const pages = await readReceiptPdf(download);
  expect(pages).toHaveLength(1);
  expect(pages[0].text).toContain('Driver Salary Receipt');
  expect(pages[0].text).toContain('Receipt Acknowledgement');
  expect(pages[0].text).toContain('Asha Example');
  expect(pages[0].text).toContain('Morgan Sample');
  expect(pages[0].text).toContain('KA03AB1234');
  expect(pages[0].text).toContain('\u20b912500');
  expect(pages[0].text).toContain('Revenue Stamp');
  expect(pages[0].text).toContain('Driver signature');
  expect(pages[0].text).not.toContain('Download PDF');
  expect(pages[0].images).toBe(2);
  await expect(page.locator('dialog[open]')).toHaveCount(0);
  await expect(page.locator('html')).not.toHaveAttribute('data-print-called', 'true');
  expect(
    await page.evaluate(() => localStorage.getItem('paperkit.driver-salary-slip.draft')),
  ).toBeNull();
  expect(unexpectedRequests).toEqual([]);
});

test('rejects invalid receipt details before download', async ({ page }) => {
  await page.goto('/');
  const downloads: Download[] = [];
  page.on('download', (download) => downloads.push(download));
  await page.getByRole('button', { name: 'Download PDF', exact: true }).click();
  await expect(page.getByLabel('Driver name', { exact: true })).toBeFocused();
  await expect(page.locator('.receipt-output-message')).toContainText('Enter a driver name.');
  expect(downloads).toHaveLength(0);
});

test('downloads selectable accented Latin and Devanagari text', async ({ page }) => {
  const driver = '\u0935\u093f\u0915\u093e\u0938 \u0936\u0930\u094d\u092e\u093e';
  const payer = '\u00c9lodie N\u00fa\u00f1ez';
  const declaration =
    '\u092d\u0941\u0917\u0924\u093e\u0928 \u092a\u094d\u0930\u093e\u092a\u094d\u0924 \u0939\u0941\u0906\u0964';
  await page.goto('/');
  await fillReceipt(page);
  await page.getByLabel('Driver name', { exact: true }).fill(driver);
  await page.getByLabel('Payer name', { exact: true }).fill(payer);
  await page.getByRole('textbox', { name: /declaration/i }).fill(declaration);

  const pages = await readReceiptPdf(await downloadReceipt(page));
  const sortedGlyphs = (text: string) => [...text].sort().join('');
  const extractedDriver = pages[0].text.match(/NAME OF DRIVER\s+Mr\. ([^\n]+)/)?.[1];
  expect(extractedDriver).toBeDefined();
  expect(sortedGlyphs(extractedDriver ?? '')).toBe(sortedGlyphs(driver));
  expect(pages[0].text).toContain(payer);
  expect(pages[0].text).toContain(declaration);
});

test('preserves the current currency glyphs and paginates a long summary declaration', async ({
  page,
}) => {
  await page.goto('/');
  await fillReceipt(page);
  await page.getByRole('radio', { name: /Summary/ }).check();
  const symbols = [...new Set(currencyOptions.map(({ symbol }) => symbol))];
  const declaration = [
    ...symbols.map((symbol) => `Symbol: ${symbol}`),
    'Last line of declaration.',
  ].join('\n');
  await page.getByRole('textbox', { name: /declaration/i }).fill(declaration);
  const pages = await readReceiptPdf(await downloadReceipt(page));
  expect(pages.length).toBeGreaterThan(1);
  const text = pages.map((page) => page.text).join('\n');
  expect(text).toContain('Last line of declaration.');
  expect(text).toContain('Receipt Acknowledgement');
  for (const glyph of new Set(symbols.join('').replace(/\s/g, ''))) {
    expect(text, `PDF text should include U+${glyph.codePointAt(0)?.toString(16)}`).toContain(
      glyph,
    );
  }
});

test('downloads the compact template with a transformed uploaded WebP signature and no stamp', async ({
  page,
}) => {
  await page.goto('/');
  await fillReceipt(page);
  await page.getByRole('radio', { name: /Certification/ }).check();
  await page.getByLabel('Include revenue stamp image').uncheck();
  const signature = await page.evaluate(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 16;
    const context = canvas.getContext('2d');
    context?.fillRect(4, 4, 24, 4);
    return canvas.toDataURL('image/webp').split(',')[1];
  });
  await page.getByLabel('Upload signature image').setInputFiles({
    name: 'signature.webp',
    mimeType: 'image/webp',
    buffer: Buffer.from(signature, 'base64'),
  });
  await expect(page.getByRole('img', { name: 'Uploaded signature preview' })).toBeVisible();
  await page.locator('.signature-adjustments summary').click();
  await page.locator('#signature-x').fill('25');

  const pages = await readReceiptPdf(await downloadReceipt(page));
  expect(pages).toHaveLength(1);
  expect(pages[0].text).toContain('This is to certify that Mr. Morgan Sample');
  expect(pages[0].text).not.toContain('Receipt Acknowledgement');
  expect(pages[0].text).not.toContain('Revenue Stamp');
  expect(pages[0].images).toBe(1);
});

test('keeps print available when the PDF fonts cannot display a character', async ({ page }) => {
  await page.goto('/');
  await fillReceipt(page);
  await page.getByRole('textbox', { name: /declaration/i }).fill('\u{1f9ea}');
  const downloads: Download[] = [];
  page.on('download', (download) => downloads.push(download));
  await page.getByRole('button', { name: 'Download PDF', exact: true }).click();
  await expect(page.locator('.receipt-output-message')).toContainText('The PDF cannot display');
  expect(downloads).toHaveLength(0);
  await page.getByRole('button', { name: 'Print receipt', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
});
