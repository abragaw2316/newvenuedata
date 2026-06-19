'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { requestPasswordReset } from '@/app/account/actions'
import type { AuthResult } from '@/lib/auth'

const inputCls =
  'w-full rounded-md border border-[var(--ls-border-2)] bg-[var(--ls-surface)] px-3 py-2 text-sm text-[var(--ls-fg)] placeholder:text-[var(--ls-fg-4)] focus:outline-none focus:border-indigo-500/60'

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState<AuthResult, FormData>(requestPasswordReset, {})

  return (
    <form action={action} className="flex flex-col gap-4">
      <h1 className="text-display-sm text-[var(--ls-fg)]">Reset your password</h1>
      <p className="text-sm text-[var(--ls-fg-2)]">Enter your email and we’ll send you a link to choose a new password.</p>

      {state.error && (
        <p role="alert" aria-live="polite" className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:text-red-300">
          {state.error}
        </p>
      )}
      {state.sent && (
        <p role="status" aria-live="polite" className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-300">
          If an account exists for that email, a reset link is on its way. Check your inbox.
        </p>
      )}

      <input name="email" type="email" required aria-label="Email address" placeholder="you@company.com" className={inputCls} autoComplete="email" />

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center justify-center rounded-md bg-[var(--ls-fg)] text-[var(--ls-bg)] hover:opacity-90 text-sm font-medium px-5 py-2.5 transition-opacity disabled:opacity-50"
      >
        {pending ? 'Sending…' : 'Send reset link'}
      </button>

      <p className="text-xs text-[var(--ls-fg-3)]">
        <Link href="/login" className="text-indigo-700 hover:opacity-80">Back to sign in</Link>
      </p>
    </form>
  )
}
