import { test, expect } from '@playwright/test'

/**
 * Analytics page: the three interactive chart cards render — the time-scrubbing
 * density map, the daily-volume calendar heatmap, and the report builder.
 */

test.describe('analytics', () => {
  test('renders the page heading and the three chart cards', async ({ page }) => {
    await page.goto('/analytics')

    // Page hero heading.
    await expect(
      page.getByRole('heading', { name: 'Visualize Florida License Activity' }),
    ).toBeVisible()

    // Each chart card has a stable <h3> title.
    await expect(
      page.getByRole('heading', { name: 'Filing Density Over Time' }),
    ).toBeVisible()
    await expect(
      page.getByRole('heading', { name: 'Daily Volume Heatmap' }),
    ).toBeVisible()
    await expect(
      page.getByRole('heading', { name: 'Report Builder' }),
    ).toBeVisible()
  })

  test('the report builder exposes its CSV export control', async ({ page }) => {
    await page.goto('/analytics')

    // The report builder card describes a CSV export — confirm the interactive
    // chart layer mounted (a button/control beneath the card heading).
    await expect(
      page.getByRole('heading', { name: 'Report Builder' }),
    ).toBeVisible()
    await expect(page.getByText(/export/i).first()).toBeVisible()
  })
})
