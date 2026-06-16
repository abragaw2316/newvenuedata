import { test, expect } from '@playwright/test'

/**
 * Coverage matrix page (/coverage/{county}/{type}): a programmatic SEO page for
 * a county × license-type pair. It renders an <h1> naming the county + license
 * code and a breadcrumb trail (Home / Coverage / County / CODE).
 *
 * `miami-dade` is the top county by volume and `srx` is a known license type,
 * so this pair is part of generateStaticParams and resolves (no notFound).
 */

const COUNTY_SLUG = 'miami-dade'
const TYPE_SLUG = 'srx'

test.describe('coverage matrix page', () => {
  test('renders the h1 and the breadcrumb trail', async ({ page }) => {
    await page.goto(`/coverage/${COUNTY_SLUG}/${TYPE_SLUG}`)

    // The page <h1> names the county and the license code.
    const h1 = page.getByRole('heading', { level: 1 })
    await expect(h1).toBeVisible()
    await expect(h1).toContainText('Miami-Dade County')
    await expect(h1).toContainText('SRX')

    // The breadcrumb nav and its trail.
    const breadcrumb = page.getByRole('navigation', { name: 'Breadcrumb' })
    await expect(breadcrumb).toBeVisible()
    await expect(breadcrumb.getByRole('link', { name: 'Home' })).toBeVisible()
    await expect(breadcrumb.getByRole('link', { name: 'Coverage' })).toBeVisible()
    await expect(
      breadcrumb.getByRole('link', { name: 'Miami-Dade' }),
    ).toBeVisible()
    await expect(breadcrumb).toContainText('SRX')
  })

  test('an unknown county slug 404s', async ({ page }) => {
    const res = await page.goto('/coverage/not-a-real-county/srx')
    expect(res?.status()).toBe(404)
  })
})
