'use client'

import { useActionState, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Check, Copy } from 'lucide-react'
import { signup } from '@/app/account/actions'
import type { AuthResult } from '@/lib/auth'

const inputCls =
  'w-full rounded-md border border-[var(--ls-border-2)] bg-[var(--ls-surface)] px-3 py-2 text-sm text-[var(--ls-fg)] placeholder:text-[var(--ls-fg-4)] focus:outline-none focus:border-indigo-500/60'

export function SignupForm() {
  const [state, action, pending] = useActionState<AuthResult, FormData>(signup, {})
  const [copied, setCopied] = useState(false)

  if (state.apiKey) {
    return (
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-2 text-indigo-700">
          <Check className="h-5 w-5" />
          <h1 className="text-display-sm text-[var(--ls-fg)]">You&apos;re in.</h1>
        </div>
        <p className="text-sm text-[var(--ls-fg-2)] leading-relaxed">
          Your account is created and you&apos;re signed in. Here is your live API key — copy it now,
          it&apos;s shown only once. You can always rotate it from your account.
        </p>
        <div className="flex items-center gap-2 rounded-md border border-[var(--ls-border-2)] bg-[var(--ls-surface-2)] p-3">
          <code className="flex-1 break-all font-mono text-xs text-[var(--ls-fg)]">{state.apiKey}</code>
          <button
            type="button"
            onClick={() => { navigator.clipboard.writeText(state.apiKey!); setCopied(true); setTimeout(() => setCopied(false), 1500) }}
            className="inline-flex items-center gap-1 rounded-md border border-[var(--ls-border-2)] px-2.5 py-1 text-xs text-[var(--ls-fg-2)] hover:text-[var(--ls-fg)]"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
        <Link
          href="/account"
          className="inline-flex w-fit items-center justify-center rounded-md bg-[var(--ls-fg)] text-[var(--ls-bg)] hover:opacity-90 text-sm font-medium px-5 py-2.5 transition-opacity"
        >
          Go to your account <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    )
  }

  return (
    <form action={action} className="flex flex-col gap-4">
      <h1 className="text-display-sm text-[var(--ls-fg)]">Create your account</h1>
      <p className="text-sm text-[var(--ls-fg-2)]">Start your 14-day free trial. No card required.</p>

      {state.error && (
        <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:text-red-300">
          {state.error}
        </p>
      )}

      <div className="grid grid-cols-2 gap-3">
        <input name="name" placeholder="Your name" className={inputCls} autoComplete="name" />
        <input name="company" placeholder="Company (optional)" className={inputCls} autoComplete="organization" />
      </div>
      <input name="email" type="email" required placeholder="you@company.com" className={inputCls} autoComplete="email" />
      <input name="password" type="password" required minLength={8} placeholder="Password (8+ characters)" className={inputCls} autoComplete="new-password" />

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center justify-center rounded-md bg-[var(--ls-fg)] text-[var(--ls-bg)] hover:opacity-90 text-sm font-medium px-5 py-2.5 transition-opacity disabled:opacity-50"
      >
        {pending ? 'Creating account…' : 'Create account'}
      </button>

      <p className="text-xs text-[var(--ls-fg-3)]">
        Already have an account?{' '}
        <Link href="/login" className="text-indigo-700 hover:opacity-80">Sign in</Link>
      </p>
    </form>
  )
}
