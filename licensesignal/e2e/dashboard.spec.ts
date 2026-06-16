import { test, expect } from '@playwright/test'

/**
 * Dashboard: stat cards + the license table render, and searching the feed
 * changes how many rows are visible.
 */

test.describe('dashboard', () => {
  test('renders stat cards and the license table', async ({ page }) => {
    await page.goto('/dashboard')

    // The four KPI stat cards.
    await expect(page.getByText('New Filings Today')).toBeVisible()
    await expect(page.getByText('Total This Month')).toBeVisible()
    await expect(page.getByText('Counties Active')).toBeVisible()
    await expect(page.getByText('Webhook Events')).toBeVisible()

    // The license feed table (the only <table> on this route).
    const table = page.getByRole('table')
    await expect(table).toBeVisible()
    // It has sortable column headers and at least one data row.
    await expect(table.getByRole('button', { name: 'Business' })).toBeVisible()
    await expect(table.locator('tbody tr').first()).toBeVisible()
  })

  test('searching the feed changes the visible row count', async ({ page }) => {
    await page.goto('/dashboard')

    const table = page.getByRole('table')
    const dataRows = table.locator('tbody tr')

    // The feed is paginated at 10 rows/page, so it starts full.
    await expect(dataRows).toHaveCount(10)

    // Search for a single, unique business — this narrows the table.
    await page
      .getByPlaceholder('Search business, city, or county…')
      .fill('Brickell Social Club')

    await expect(dataRows).toHaveCount(1)
    await expect(table).toContainText('Brickell Social Club')
  })
})
