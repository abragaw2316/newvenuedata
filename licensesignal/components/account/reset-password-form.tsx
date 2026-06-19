'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { resetPassword } from '@/app/account/actions'
import type { AuthResult } from '@/lib/auth'

const inputCls =
  'w-full rounded-md border border-[var(--ls-border-2)] bg-[var(--ls-surface)] px-3 py-2 text-sm text-[var(--ls-fg)] placeholder:text-[var(--ls-fg-4)] focus:outline-none focus:border-indigo-500/60'

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState<AuthResult, FormData>(resetPassword, {})

  if (!token) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-display-sm text-[var(--ls-fg)]">Reset link invalid</h1>
        <p className="text-sm text-[var(--ls-fg-2)]">
          This link is missing or malformed.{' '}
          <Link href="/forgot-password" className="text-indigo-700 hover:opacity-80">Request a new one</Link>.
        </p>
      </div>
    )
  }

  return (
    <form action={action} className="flex flex-col gap-4">
      <h1 className="text-display-sm text-[var(--ls-fg)]">Choose a new password</h1>

      {state.error && (
        <p role="alert" aria-live="polite" className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:text-red-300">
          {state.error}
        </p>
      )}

      {state.message ? (
        <>
          <p role="status" aria-live="polite" className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-300">
            {state.message}
          </p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-md bg-[var(--ls-fg)] text-[var(--ls-bg)] hover:opacity-90 text-sm font-medium px-5 py-2.5 transition-opacity"
          >
            Sign in
          </Link>
        </>
      ) : (
        <>
          <input type="hidden" name="token" value={token} />
          <input
            name="password"
            type="password"
            required
            minLength={8}
            aria-label="New password (at least 8 characters)"
            placeholder="New password (8+ characters)"
            className={inputCls}
            autoComplete="new-password"
          />
          <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center justify-center rounded-md bg-[var(--ls-fg)] text-[var(--ls-bg)] hover:opacity-90 text-sm font-medium px-5 py-2.5 transition-opacity disabled:opacity-50"
          >
            {pending ? 'Saving…' : 'Reset password'}
          </button>
        </>
      )}
    </form>
  )
}
