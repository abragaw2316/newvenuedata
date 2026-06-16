import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright end-to-end test configuration for New Venue Data.
 *
 * These tests are intended for CI / local use. They drive the Next.js dev
 * server (`npm run dev`) on port 3000 and exercise the real app + API routes.
 *
 * Run with: `npm run test:e2e`
 * (Requires `@playwright/test` and browsers installed — `npx playwright install`.)
 */

const PORT = 3000
const BASE_URL = `http://localhost:${PORT}`

export default defineConfig({
  testDir: './e2e',
  // Each test gets up to 30s; individual expects up to 10s.
  timeout: 30_000,
  expect: { timeout: 10_000 },
  // Fail the build on CI if test.only is left in the source.
  forbidOnly: !!process.env.CI,
  // Retry flaky tests on CI only.
  retries: process.env.CI ? 2 : 0,
  // Opt out of parallel workers on CI for a more stable dev server.
  workers: process.env.CI ? 1 : undefined,
  fullyParallel: true,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // Boot the Next.js dev server before the tests run.
  webServer: {
    command: 'npm run dev',
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    stdout: 'pipe',
    stderr: 'pipe',
  },
})
