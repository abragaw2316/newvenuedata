import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { sql, ensureSchema } from '@/lib/db'
import { logout } from './actions'
import { AccountKey } from '@/components/account/account-content'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Account', robots: { index: false, follow: false } }

const PLAN_LABEL: Record<string, string> = {
  trial: 'Free trial',
  county: 'County',
  south_fl: 'South Florida',
  statewide: 'Statewide',
}

export default async function AccountPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  let prefix: string | null = null
  try {
    await ensureSchema()
    const { rows } = await sql`
      SELECT key_prefix FROM api_keys
      WHERE user_id = ${user.id} AND revoked = false
      ORDER BY created_at DESC LIMIT 1`
    prefix = (rows[0]?.key_prefix as string) ?? null
  } catch { /* show "no active key" */ }

  return (
    <div className="min-h-[70vh] bg-[var(--ls-bg)]">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24 flex flex-col gap-8">
        <header className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-display-sm text-[var(--ls-fg)]">{user.name || user.email}</h1>
            <p className="text-sm text-[var(--ls-fg-3)]">{user.email}</p>
          </div>
          <form action={logout}>
            <button className="rounded-md border border-[var(--ls-border-2)] px-3 py-1.5 text-sm text-[var(--ls-fg-2)] hover:text-[var(--ls-fg)]">
              Sign out
            </button>
          </form>
        </header>

        {/* Plan */}
        <section className="rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-[var(--ls-fg-4)]">Plan</p>
            <p className="text-sm font-medium text-[var(--ls-fg)]">{PLAN_LABEL[user.plan] || user.plan}</p>
          </div>
          <a href="/pricing" className="text-sm font-medium text-indigo-700 hover:opacity-80">Change plan</a>
        </section>

        {/* API key */}
        <section className="rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-5 flex flex-col gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-[var(--ls-fg-4)]">API key</p>
            <p className="text-xs text-[var(--ls-fg-3)] mt-0.5">
              Use this as <code className="font-mono">Authorization: Bearer …</code> against the API. Keep it secret.
            </p>
          </div>
          <AccountKey prefix={prefix} />
        </section>

        <p className="text-xs text-[var(--ls-fg-3)]">
          Need help? Email <a href="mailto:austin@newvenuedata.com" className="text-indigo-700 hover:opacity-80">austin@newvenuedata.com</a>.
        </p>
      </div>
    </div>
  )
}
