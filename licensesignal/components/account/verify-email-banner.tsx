'use client'

import { useActionState } from 'react'
import { resendVerification } from '@/app/account/actions'
import type { AuthResult } from '@/lib/auth'

export function VerifyEmailBanner() {
  const [state, action, pending] = useActionState<AuthResult, FormData>(resendVerification, {})

  return (
    <section className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-5 flex flex-col gap-3">
      <div>
        <p className="text-sm font-medium text-amber-700 dark:text-amber-300">Confirm your email</p>
        <p className="text-xs text-[var(--ls-fg-3)] mt-0.5">
          We sent a confirmation link when you signed up. Didn’t get it? Resend below.
        </p>
      </div>

      {state.error && <p className="text-xs text-red-700 dark:text-red-300">{state.error}</p>}
      {state.sent && <p className="text-xs text-emerald-700 dark:text-emerald-300">Sent — check your inbox.</p>}

      <form action={action}>
        <button
          type="submit"
          disabled={pending}
          className="rounded-md border border-[var(--ls-border-2)] px-3 py-1.5 text-sm text-[var(--ls-fg-2)] hover:text-[var(--ls-fg)] disabled:opacity-50"
        >
          {pending ? 'Sending…' : 'Resend confirmation email'}
        </button>
      </form>
    </section>
  )
}
