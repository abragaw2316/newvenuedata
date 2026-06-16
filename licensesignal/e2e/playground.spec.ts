import { test, expect } from '@playwright/test'

/**
 * Docs API playground: sending the default request hits the live /api/licenses
 * route and renders a 200 status pill plus the JSON response body.
 */

test.describe('docs API playground', () => {
  test('sends a request and renders a 200 status pill and JSON response', async ({
    page,
  }) => {
    await page.goto('/docs/list-licenses')

    const sendButton = page.getByRole('button', { name: 'Send Request' })
    await expect(sendButton).toBeVisible()
    await sendButton.click()

    // Success status pill (component renders "200 OK" for 2xx responses).
    await expect(page.getByText('200 OK')).toBeVisible()

    // The rendered JSON response body — "pagination" only appears in the
    // response, not in the curl preview above it.
    await expect(page.getByText('Response', { exact: true })).toBeVisible()
    await expect(page.getByText('"pagination"', { exact: false })).toBeVisible()
    await expect(page.getByText('"data"', { exact: false })).toBeVisible()
  })
})
