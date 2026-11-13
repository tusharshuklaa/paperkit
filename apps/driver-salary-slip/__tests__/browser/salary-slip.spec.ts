import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.print = () => undefined;
    window.confirm = () => true;
  });
});

test('blur validation stays quiet until interaction and corrections clear errors without layout shifts', async ({
  page,
}) => {
  const dateWarnings: string[] = [];
  page.on('console', (message) => {
    if (message.text().includes('does not conform to the required format')) {
      dateWarnings.push(message.text());
    }
  });
  await page.goto('/');
  const driver = page.getByLabel('Driver name', { exact: true });
  const payer = page.getByLabel('Payer name', { exact: true });
  const vehicle = page.getByLabel('Vehicle number', { exact: true });
  await expect(page.locator('[aria-invalid="true"]')).toHaveCount(0);
  const initialPayerTop = (await payer.boundingBox())?.y;
  await driver.focus();
  await payer.focus();
  await expect(driver).toHaveAttribute('aria-invalid', 'true');
  await expect(driver).toHaveAccessibleDescription('Enter a driver name.');
  expect((await payer.boundingBox())?.y).toBe(initialPayerTop);
  await driver.fill('Asha Example');
  await expect(driver).not.toHaveAttribute('aria-invalid', 'true');
  await payer.fill('Morgan Sample');
  await vehicle.fill('KA03AB123456');
  await page.locator('#salary-amount').focus();
  await expect(vehicle).toHaveAccessibleDescription(
    'Vehicle number must be 10 characters or fewer.',
  );
  await vehicle.fill('KA03AB1234');
  await expect(vehicle).not.toHaveAttribute('aria-invalid', 'true');

  const amount = page.getByLabel('Salary amount', { exact: true });
  await amount.clear();
  await page.getByLabel('Currency', { exact: true }).focus();
  await expect(amount).toHaveAccessibleDescription('Enter a salary amount.');
  await amount.fill('-1');
  await expect(amount).toHaveAccessibleDescription('Salary amount must be zero or more.');
  await amount.fill('12500.5');
  await expect(amount).not.toHaveAttribute('aria-invalid', 'true');

  const date = page.getByLabel('Payment date', { exact: true });
  await date.clear();
  await amount.focus();
  await expect(date).toHaveAccessibleDescription('Enter a valid payment date.');
  await page.getByRole('button', { name: 'Print receipt', exact: true }).click();
  await expect(date).toBeFocused();
  await expect(page.locator('dialog[open]')).toHaveCount(0);
  await date.fill('2026-11-13');
  await expect(date).not.toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByText('Receipt ready to print', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Print receipt', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  expect(dateWarnings).toEqual([]);
});

test('shared dropdowns reserve chevron space and signature positioning stays optional', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.locator('.pk-select-control')).toHaveCount(4);
  for (const control of await page.locator('.pk-select-control').all()) {
    const select = control.locator('select');
    const icon = control.locator('svg');
    const selectBox = await select.boundingBox();
    const iconBox = await icon.boundingBox();
    expect(selectBox).not.toBeNull();
    expect(iconBox).not.toBeNull();
    if (!selectBox || !iconBox) throw new Error('Dropdown geometry unavailable.');
    const inset = selectBox.x + selectBox.width - iconBox.x - iconBox.width;
    expect(inset).toBeGreaterThanOrEqual(10);
    const padding = await select.evaluate((element) =>
      Number.parseFloat(getComputedStyle(element).paddingInlineEnd),
    );
    expect(padding).toBeGreaterThan(iconBox.width + inset);
    await expect(icon).toHaveAttribute('aria-hidden', 'true');
  }
  await page.getByLabel('Driver salutation', { exact: true }).selectOption('Mrs.');
  await page.getByLabel('Driver salutation', { exact: true }).focus();
  await page.keyboard.press('Tab');
  await expect(page.getByLabel('Driver salutation', { exact: true })).toHaveValue('Mrs.');
  await expect(page.getByLabel('Driver name', { exact: true })).toBeFocused();
  await page.getByLabel('Driver name', { exact: true }).fill('Asha Example');
  await expect(page.locator('#signature-x')).toBeHidden();
  const summary = page.locator('.signature-adjustments summary');
  await summary.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#signature-x')).toBeVisible();
  await page.locator('#signature-x').fill('25');
  await expect(page.getByRole('img', { name: 'Driver signature', exact: true })).toHaveAttribute(
    'style',
    /translate\(25px/,
  );
});

test('tablet template labels stay within their controls', async ({ page }) => {
  await page.goto('/');
  for (const width of [768, 1024, 1100]) {
    await page.setViewportSize({ width, height: 1000 });
    const overflow = await page
      .locator('.template-option__copy strong')
      .evaluateAll((labels) => labels.some((label) => label.scrollWidth > label.clientWidth));
    expect(overflow).toBe(false);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
  }
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
  await expect(page.getByText('Complete required fields to prepare receipt.')).toBeVisible();
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
  await page.getByLabel('Payer name').fill('Morgan Sample');
  await page.getByLabel('Vehicle number').fill('KA03AB1234');
  await expect(page.getByText('Receipt ready to print')).toBeVisible();
  await page.getByLabel('Vehicle number').clear();
  await expect(page.getByText('Complete required fields to prepare receipt.')).toBeVisible();
  await page.getByLabel('Vehicle number').fill('KA03AB1234');
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
  await page.locator('.signature-adjustments summary').click();
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
