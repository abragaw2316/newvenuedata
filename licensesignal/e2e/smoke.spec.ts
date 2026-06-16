import { test, expect } from '@playwright/test'

/**
 * Broad smoke test: confirms the key marketing + docs pages render their
 * defining content and the shared chrome (nav + footer) is present.
 */

test.describe('smoke', () => {
  test('home page renders hero, nav, and footer', async ({ page }) => {
    await page.goto('/')

    // Hero headline (the h1 spans multiple lines / a gradient span, so match a
    // stable fragment rather than the full string).
    const heading = page.getByRole('heading', { level: 1 })
    await expect(heading).toBeVisible()
    await expect(heading).toContainText('Before Your Competitors')

    // Site chrome: header (banner) with site nav, and footer (contentinfo).
    await expect(page.getByRole('banner')).toBeVisible()
    await expect(page.getByRole('navigation').first()).toBeVisible()
    await expect(page.getByRole('contentinfo')).toBeVisible()
  })

  test('pricing page renders heading and the ROI sliders', async ({ page }) => {
    await page.goto('/pricing')

    await expect(
      page.getByRole('heading', { name: 'Simple Pricing for Serious Data Teams' })
    ).toBeVisible()

    // The ROI calculator exposes three native range inputs (role="slider").
    const sliders = page.getByRole('slider')
    await expect(sliders).toHaveCount(3)
    await expect(sliders.first()).toBeVisible()
  })

  test('list-licenses docs page renders the playground send button', async ({ page }) => {
    await page.goto('/docs/list-licenses')

    await expect(page.getByRole('button', { name: 'Send Request' })).toBeVisible()
  })
})
