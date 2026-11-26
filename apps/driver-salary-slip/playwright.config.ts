import { defineConfig } from '@playwright/test';

const baseURL = process.env.DRIVER_SALARY_SLIP_BASE_URL ?? 'http://127.0.0.1:3105';

export default defineConfig({
  testDir: './__tests__/browser',
  fullyParallel: true,
  workers: 2,
  timeout: 45_000,
  expect: { timeout: 10_000 },
  outputDir: '../../test-results/driver-salary-slip',
  use: {
    baseURL,
    browserName: 'chromium',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'driver-desktop-light',
      use: { viewport: { width: 1440, height: 1000 }, colorScheme: 'light' },
    },
    {
      name: 'driver-desktop-dark',
      use: { viewport: { width: 1440, height: 1000 }, colorScheme: 'dark' },
    },
    {
      name: 'driver-mobile-light',
      use: { viewport: { width: 390, height: 844 }, colorScheme: 'light' },
    },
    {
      name: 'driver-mobile-dark',
      use: { viewport: { width: 390, height: 844 }, colorScheme: 'dark' },
    },
  ],
  webServer: {
    command: `bun run build && bun run start --port ${new URL(baseURL).port || '3105'}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
