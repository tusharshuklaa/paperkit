import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.print = () => undefined;
    window.confirm = () => true;
  });
});

test('Plum & Stone tokens follow the tool theme and keep receipts white', async ({
  page,
}, testInfo) => {
  await page.goto('/');
  const expected = {
    light: { canvas: '#f6f5f5', action: '#75496c' },
    dark: { canvas: '#211d23', action: '#eabfe0' },
  };
  const initial = testInfo.project.use.colorScheme === 'dark' ? 'dark' : 'light';
  const opposite = initial === 'dark' ? 'light' : 'dark';
  const tokens = () =>
    page.evaluate(() => {
      const style = getComputedStyle(document.documentElement);
      return {
        canvas: style.getPropertyValue('--canvas').trim(),
        action: style.getPropertyValue('--action').trim(),
      };
    });
  await expect.poll(tokens).toEqual(expected[initial]);
  await page.getByRole('button', { name: 'Toggle theme' }).click();
  await expect.poll(tokens).toEqual(expected[opposite]);
  await expect(page.locator('.receipt-paper')).toHaveCSS('background-color', 'rgb(255, 255, 255)');
});

test('defaults, required validation, three templates, and signature presentation', async ({
  page,
}) => {
  const failedAssets: string[] = [];
  const externalRequests: string[] = [];
  const browserErrors: string[] = [];
  page.on('pageerror', (error) => browserErrors.push(error.message));
  page.on('response', (response) => {
    if (
      ['font', 'stylesheet', 'image'].includes(response.request().resourceType()) &&
      !response.ok()
    ) {
      failedAssets.push(`${response.status()} ${response.url()}`);
    }
  });
  await page.goto('/');
  const appOrigin = new URL(page.url()).origin;
  page.on('request', (request) => {
    if (new URL(request.url()).origin !== appOrigin) externalRequests.push(request.url());
  });
  await expect(page.locator('#salary-month')).toHaveValue('November');
  await expect(page.locator('#currency')).toHaveValue('currency-68');
  await expect(page.locator('#salary-amount')).toHaveValue('0');
  await expect(page.locator('#payment-date')).toHaveValue(
    await page.evaluate(() => {
      const date = new Date();
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }),
  );
  await expect(page.locator('#currency option')).toHaveCount(165);
  await expect(page.getByRole('img', { name: 'Revenue stamp' })).toBeVisible();
  await page.getByLabel('Driver name').fill('Asha Example');
  await expect(page.getByRole('img', { name: 'Driver signature' })).toBeVisible();
  const currentDate = await page.evaluate(() =>
    new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(new Date()),
  );
  expect(
    await page.evaluate(() => {
      const family = getComputedStyle(document.documentElement)
        .getPropertyValue('--font-signature')
        .trim();
      return family.length > 0 && document.fonts.check(`42px ${family}`);
    }),
  ).toBe(true);

  for (const [label, template, expected] of [
    ['Split receipt', '1', 'Receipt Acknowledgement'],
    ['Summary', '2', 'Receipt Acknowledgement'],
    ['Certification', '3', 'Payer Name'],
  ]) {
    await page.getByRole('radio', { name: new RegExp(label) }).check();
    const receipt = page.getByRole('article', { name: new RegExp(`template ${template}`) });
    await expect(receipt).toContainText(expected);
    await expect(receipt).toContainText('Asha Example');
    await expect(receipt).toContainText(currentDate);
    await expect(page.getByRole('img', { name: 'Driver signature' })).toBeVisible();
  }

  await page.getByLabel('Driver name').clear();
  await expect(page.getByRole('img', { name: 'Driver signature' })).toHaveCount(0);
  await page.getByRole('button', { name: 'Print receipt' }).click();
  await expect(page.getByText('Enter a driver name.', { exact: true })).toBeVisible();
  await expect(page.getByLabel('Driver name')).toBeFocused();
  await expect(page.locator('dialog[open]')).toHaveCount(0);
  expect(failedAssets).toEqual([]);
  expect(externalRequests).toEqual([]);
  expect(browserErrors).toEqual([]);
});

test('print choices, opt-in draft restore, reset, and clear have distinct effects', async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem('test-print-count', '0');
    window.print = () => {
      const count = Number(localStorage.getItem('test-print-count') ?? 0);
      localStorage.setItem('test-print-count', String(count + 1));
    };
  });
  await page.goto('/');
  await page.getByLabel('Driver name').fill('Asha Example');
  await page.getByLabel('Payer name').fill('Morgan Sample');
  await page.getByLabel('Vehicle number').fill('KA03AB1234');
  await page.locator('#salary-amount').fill('12500.5');
  await page.getByLabel('Include revenue stamp image').uncheck();
  await expect(page.getByRole('img', { name: 'Revenue stamp' })).toHaveCount(0);
  await page.getByLabel('Include revenue stamp image').check();
  await page.getByLabel('Upload signature image').setInputFiles({
    name: 'unsupported.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('not an image'),
  });
  await expect(page.getByText('Choose a PNG, JPEG, or WebP signature image.')).toBeVisible();
  await page.getByLabel('Upload signature image').setInputFiles({
    name: 'driver-signature.png',
    mimeType: 'image/png',
    buffer: Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/r3sAAAAASUVORK5CYII=',
      'base64',
    ),
  });
  await expect(page.getByRole('img', { name: 'Uploaded signature preview' })).toBeVisible();
  await page.getByRole('button', { name: 'Remove upload' }).click();
  await expect(page.getByRole('img', { name: 'Driver signature' })).toBeVisible();
  await page.getByLabel('Upload signature image').setInputFiles({
    name: 'driver-signature.png',
    mimeType: 'image/png',
    buffer: Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/r3sAAAAASUVORK5CYII=',
      'base64',
    ),
  });
  await expect(page.getByRole('img', { name: 'Uploaded signature preview' })).toBeVisible();
  await page.locator('#signature-x').fill('25');
  await expect(page.getByRole('img', { name: 'Driver signature' })).toHaveAttribute(
    'style',
    /translate\(25px/,
  );

  await page.getByRole('button', { name: 'Print receipt' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Cancel' }).click();
  const printCount = () => page.evaluate(() => Number(localStorage.getItem('test-print-count')));
  expect(await printCount()).toBe(0);
  expect(
    await page.evaluate(() => localStorage.getItem('paperkit.driver-salary-slip.draft')),
  ).toBeNull();

  await page.getByRole('button', { name: 'Print receipt' }).click();
  await page.getByRole('button', { name: 'Just Print' }).click();
  await expect.poll(printCount).toBe(1);
  expect(
    await page.evaluate(() => localStorage.getItem('paperkit.driver-salary-slip.draft')),
  ).toBeNull();

  await page.getByRole('button', { name: 'Print receipt' }).click();
  await page.getByRole('button', { name: 'Save & Print' }).click();
  await expect.poll(printCount).toBe(2);
  await expect(page.getByText('Details saved in this browser.')).toBeVisible();
  await page.reload();
  await expect(page.getByLabel('Driver name')).toHaveValue('Asha Example');
  await expect(page.getByLabel('Payer name')).toHaveValue('Morgan Sample');
  await expect(page.locator('#salary-month')).toHaveValue('November');
  await expect(page.locator('#payment-date')).toHaveValue(
    await page.evaluate(() => {
      const date = new Date();
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }),
  );
  await expect(page.getByRole('img', { name: 'Uploaded signature preview' })).toBeVisible();
  await expect(page.getByRole('img', { name: 'Driver signature' })).toHaveAttribute(
    'style',
    /translate\(25px/,
  );

  await page.getByRole('button', { name: 'Clear saved data' }).click();
  expect(
    await page.evaluate(() => localStorage.getItem('paperkit.driver-salary-slip.draft')),
  ).toBeNull();
  await expect(page.getByLabel('Driver name')).toHaveValue('Asha Example');
  await page.getByRole('button', { name: 'Reset form' }).click();
  await expect(page.getByLabel('Driver name')).toHaveValue('');
  await expect(page.locator('#salary-amount')).toHaveValue('0');
});

test('save failure is reported but does not prevent printing', async ({ page }) => {
  await page.addInitScript(() => {
    (window as unknown as { printCount: number }).printCount = 0;
    window.print = () => {
      const state = window as unknown as { printCount: number };
      state.printCount += 1;
    };
    const setItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (key === 'paperkit.driver-salary-slip.draft') {
        throw new DOMException('Quota exceeded', 'QuotaExceededError');
      }
      setItem.call(this, key, value);
    };
  });
  await page.goto('/');
  await page.getByLabel('Driver name').fill('Asha Example');
  await page.getByLabel('Payer name').fill('Morgan Sample');
  await page.getByLabel('Vehicle number').fill('KA03AB1234');
  await page.getByRole('button', { name: 'Print receipt' }).click();
  await page.getByRole('button', { name: 'Save & Print' }).click();
  await expect(
    page.getByText('Details could not be saved in this browser. The receipt will still print.'),
  ).toBeVisible();
  await expect
    .poll(() => page.evaluate(() => (window as unknown as { printCount: number }).printCount))
    .toBe(1);
  expect(
    await page.evaluate(() => localStorage.getItem('paperkit.driver-salary-slip.draft')),
  ).toBeNull();
});

test('mobile layout keeps form first without horizontal overflow and print emits A4 receipt', async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const layout = await page.evaluate(() => ({
    documentWidth: document.documentElement.scrollWidth,
    viewportWidth: window.innerWidth,
    formTop: document.querySelector('.form-panel')?.getBoundingClientRect().top ?? 0,
    previewTop: document.querySelector('.preview-panel')?.getBoundingClientRect().top ?? 0,
  }));
  expect(layout.documentWidth).toBe(layout.viewportWidth);
  expect(layout.formTop).toBeLessThan(layout.previewTop);

  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('.form-panel')).toBeHidden();
  await expect(page.locator('.receipt-paper')).toBeVisible();
  await expect(page.locator('.receipt-paper')).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  const pdfPath = testInfo.outputPath('driver-salary-receipt.pdf');
  const pdf = await page.pdf({ format: 'A4', path: pdfPath, printBackground: true });
  expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
  expect(pdf.byteLength).toBeGreaterThan(2000);
});
