import { test, expect } from '@playwright/test'

/**
 * Search page: typing a query into the live faceted search updates the result
 * list (it fetches against /api/licenses/search) and the result-count line
 * reflects the query.
 */

test.describe('search', () => {
  test('renders the empty state before any query', async ({ page }) => {
    await page.goto('/search')

    await expect(
      page.getByRole('heading', { name: 'Search the live Florida license feed' }),
    ).toBeVisible()

    // The combobox search input.
    await expect(
      page.getByRole('combobox', { name: /Search businesses/i }),
    ).toBeVisible()

    // Pre-search hint copy.
    await expect(
      page.getByText('Type a query or pick filters to search the live feed.'),
    ).toBeVisible()
  })

  test('typing a query fetches and shows matching results', async ({ page }) => {
    await page.goto('/search')

    const input = page.getByRole('combobox', { name: /Search businesses/i })
    await input.fill('Brickell Social Club')

    // The result-count status line updates to reference the query.
    await expect(page.getByText(/for ["“]Brickell Social Club["”]/)).toBeVisible()

    // The matching record card renders (it's a heading in the results list).
    await expect(
      page.getByRole('heading', { name: 'Brickell Social Club' }),
    ).toBeVisible()
  })

  test('changing the query updates the visible results', async ({ page }) => {
    await page.goto('/search')

    const input = page.getByRole('combobox', { name: /Search businesses/i })

    await input.fill('Brickell Social Club')
    await expect(
      page.getByRole('heading', { name: 'Brickell Social Club' }),
    ).toBeVisible()

    // Switching the query to a different business swaps the result set.
    await input.fill('Wynwood Tap House')
    await expect(
      page.getByRole('heading', { name: 'Wynwood Tap House' }),
    ).toBeVisible()
    await expect(
      page.getByRole('heading', { name: 'Brickell Social Club' }),
    ).toBeHidden()
  })
})
