import { test, expect } from '@playwright/test'

/**
 * Help center: the landing page lists article cards by category; clicking an
 * article navigates to its detail page, which renders the article title and a
 * breadcrumb back to the Help Center.
 */

test.describe('help center', () => {
  test('lists articles and opens one when clicked', async ({ page }) => {
    await page.goto('/help')

    await expect(
      page.getByRole('heading', { name: 'How can we help you?' }),
    ).toBeVisible()

    // The first getting-started article is a link card. The card's accessible
    // name concatenates the title, excerpt, and "Read article", so match the
    // title as a substring rather than exactly.
    const articleLink = page.getByRole('link', {
      name: /Quickstart: run your first license query/,
    })
    await expect(articleLink).toBeVisible()
    await articleLink.click()

    // Landed on the article route.
    await expect(page).toHaveURL(/\/help\/quickstart-first-query$/)

    // The article renders its title as the page <h1>.
    await expect(
      page.getByRole('heading', {
        name: 'Quickstart: run your first license query',
        level: 1,
      }),
    ).toBeVisible()

    // ...and the breadcrumb back to the Help Center.
    await expect(
      page.getByRole('link', { name: 'Help Center' }).first(),
    ).toBeVisible()

    // The "was this helpful" footer confirms the article body mounted.
    await expect(
      page.getByText('Was this article helpful?'),
    ).toBeVisible()
  })
})
