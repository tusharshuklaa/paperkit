import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './apps/web/__tests__',
  testMatch: '**/__tests__/shell.test.ts',
  fullyParallel: true,
  workers: 2,
  timeout: 45_000,
  expect: { timeout: 10_000 },
  outputDir: 'test-results',
  use: {
    baseURL: 'http://127.0.0.1:3102',
    browserName: 'chromium',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'desktop-light',
      use: { viewport: { width: 1440, height: 1000 }, colorScheme: 'light' },
    },
    { name: 'desktop-dark', use: { viewport: { width: 1440, height: 1000 }, colorScheme: 'dark' } },
    { name: 'mobile-light', use: { viewport: { width: 390, height: 844 }, colorScheme: 'light' } },
    { name: 'mobile-dark', use: { viewport: { width: 390, height: 844 }, colorScheme: 'dark' } },
  ],
  webServer: {
    command: 'bun run --cwd apps/web start --port 3102',
    url: 'http://127.0.0.1:3102',
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
