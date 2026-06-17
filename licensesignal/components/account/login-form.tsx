'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { login } from '@/app/account/actions'
import type { AuthResult } from '@/lib/auth'

const inputCls =
  'w-full rounded-md border border-[var(--ls-border-2)] bg-[var(--ls-surface)] px-3 py-2 text-sm text-[var(--ls-fg)] placeholder:text-[var(--ls-fg-4)] focus:outline-none focus:border-indigo-500/60'

export function LoginForm() {
  const [state, action, pending] = useActionState<AuthResult, FormData>(login, {})

  return (
    <form action={action} className="flex flex-col gap-4">
      <h1 className="text-display-sm text-[var(--ls-fg)]">Sign in</h1>
      <p className="text-sm text-[var(--ls-fg-2)]">Welcome back. Sign in to manage your API key and plan.</p>

      {state.error && (
        <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:text-red-300">
          {state.error}
        </p>
      )}

      <input name="email" type="email" required placeholder="you@company.com" className={inputCls} autoComplete="email" />
      <input name="password" type="password" required placeholder="Password" className={inputCls} autoComplete="current-password" />

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center justify-center rounded-md bg-[var(--ls-fg)] text-[var(--ls-bg)] hover:opacity-90 text-sm font-medium px-5 py-2.5 transition-opacity disabled:opacity-50"
      >
        {pending ? 'Signing in…' : 'Sign in'}
      </button>

      <p className="text-xs text-[var(--ls-fg-3)]">
        New here?{' '}
        <Link href="/signup" className="text-indigo-700 hover:opacity-80">Create an account</Link>
        {' · '}
        <a href="mailto:austin@newvenuedata.com?subject=Password%20help" className="text-indigo-700 hover:opacity-80">Forgot password?</a>
      </p>
    </form>
  )
}
