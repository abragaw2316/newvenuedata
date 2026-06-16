import { test, expect } from '@playwright/test'

/**
 * Roadmap board: each card has an upvote button whose accessible name is tied
 * to the item title, with the live vote count rendered inside it. Clicking it
 * increments the count by one and flips the button into its "voted" state
 * (label changes to "Remove your vote for …").
 */

const ITEM_TITLE = 'HMAC-signed webhook payloads'

test.describe('roadmap', () => {
  test('renders the board lanes', async ({ page }) => {
    await page.goto('/roadmap')

    await expect(
      page.getByRole('heading', { name: 'You help decide what we build next.' }),
    ).toBeVisible()

    // The three status lanes. These labels also appear inside each card's
    // status badge, so scope to the first match (the column header).
    await expect(page.getByText('Planned', { exact: true }).first()).toBeVisible()
    await expect(page.getByText('In Progress', { exact: true }).first()).toBeVisible()
    await expect(page.getByText('Shipped', { exact: true }).first()).toBeVisible()
  })

  test('clicking upvote increments the count by one', async ({ page }) => {
    await page.goto('/roadmap')

    // The upvote button starts labelled "Upvote <title>".
    const upvote = page.getByRole('button', { name: `Upvote ${ITEM_TITLE}` })
    await expect(upvote).toBeVisible()

    const before = Number((await upvote.innerText()).trim())
    expect(Number.isNaN(before)).toBe(false)

    await upvote.click()

    // After voting, the same card's button is now labelled "Remove your vote …".
    const voted = page.getByRole('button', {
      name: `Remove your vote for ${ITEM_TITLE}`,
    })
    await expect(voted).toBeVisible()

    // The count incremented by exactly one.
    await expect(voted).toHaveText(String(before + 1))
  })
})
