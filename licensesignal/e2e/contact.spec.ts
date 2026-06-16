import { test, expect } from '@playwright/test'

/**
 * Contact form: validation on empty submit, then the success state after a
 * valid submission using a work email (free-email domains are rejected).
 */

test.describe('contact form', () => {
  test('shows inline validation errors when submitted empty', async ({ page }) => {
    await page.goto('/contact')

    await page.getByRole('button', { name: 'Send Message' }).click()

    // The form stays on screen (no success state) and surfaces field errors.
    await expect(page.getByText('Please enter your name.')).toBeVisible()
    await expect(page.getByText('Please enter your company.')).toBeVisible()
    await expect(page.getByText('Please enter your work email.')).toBeVisible()
    await expect(page.getByText('Please select your role.')).toBeVisible()
    await expect(page.getByText('Please select a use case.')).toBeVisible()

    // Success state must NOT be present.
    await expect(page.getByText('Message received.')).toHaveCount(0)
  })

  test('submits successfully with valid fields and a work email', async ({ page }) => {
    await page.goto('/contact')

    await page.getByLabel('Full Name').fill('Jane Smith')
    await page.getByLabel('Company').fill('Acme Corp')
    // A non-free-email domain is required by the validator.
    await page.getByLabel('Work Email').fill('jane@acmecorp.io')

    // Role and Use Case are custom Base UI selects. Their triggers are not
    // wired to the visible <label>, so target each by its placeholder text,
    // open it, and pick an option by its accessible name.
    await page.getByText('Select role').click()
    await page.getByRole('option', { name: 'Engineering' }).click()

    await page.getByText('Select use case').click()
    await page.getByRole('option', { name: 'Market Intelligence' }).click()

    await page.getByRole('button', { name: 'Send Message' }).click()

    // Success state replaces the form.
    await expect(
      page.getByRole('heading', { name: 'Message received.' })
    ).toBeVisible()
    await expect(
      page.getByText("We'll be in touch within 1 business day", { exact: false })
    ).toBeVisible()
  })
})
