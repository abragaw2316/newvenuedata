'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react'
import { LogoMark } from '@/components/shared/logo-mark'

const INPUT_CLASS =
  'w-full rounded-md border border-[var(--ls-border-2)] bg-[var(--ls-surface-2)] px-3 py-2 text-sm text-[var(--ls-fg)] placeholder:text-[var(--ls-fg-4)] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50'

type AuthMode = 'password' | 'magic'

export function LoginContent() {
  const [mode, setMode] = useState<AuthMode>('password')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')

    if (!email.trim()) {
      setError('Enter your work email to continue.')
      return
    }
    if (mode === 'password' && !password) {
      setError('Enter your password to continue.')
      return
    }

    // Mockup only: no real auth — just advance to the confirmation state.
    setSent(true)
  }

  if (sent) {
    return (
      <section className="min-h-[80vh] flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-8 text-center">
          <Wordmark className="justify-center" />

          <div className="mx-auto mt-8 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/30">
            <CheckCircle2 className="h-6 w-6 text-emerald-400" />
          </div>

          <h1 className="mt-5 text-lg font-semibold text-[var(--ls-fg)]">Check your inbox</h1>
          <p className="mt-2 text-sm text-[var(--ls-fg-2)] leading-relaxed">
            We sent a magic link to{' '}
            <span className="font-medium text-[var(--ls-fg)]">{email}</span>. Click the link in that
            email to finish signing in.
          </p>

          <button
            type="button"
            onClick={() => {
              setSent(false)
              setPassword('')
            }}
            className="mt-6 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Use a different email
          </button>

          <p className="mt-8 border-t border-[var(--ls-border)] pt-6 text-xs text-[var(--ls-fg-3)]">
            Didn&apos;t get it? Check your spam folder, or{' '}
            <button
              type="button"
              onClick={() => setSent(true)}
              className="text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              resend the link
            </button>
            .
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="min-h-[80vh] flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-8">
        <Wordmark />

        <h1 className="mt-8 text-lg font-semibold text-[var(--ls-fg)]">Sign in to New Venue Data</h1>
        <p className="mt-1 text-sm text-[var(--ls-fg-3)]">
          Welcome back. Enter your details to access your feed.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4" noValidate>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="login-email" className="text-xs font-medium text-[var(--ls-fg-2)]">
              Work email
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className={INPUT_CLASS}
            />
          </div>

          {mode === 'password' && (
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="login-password" className="text-xs font-medium text-[var(--ls-fg-2)]">
                  Password
                </label>
                <span className="text-xs text-[var(--ls-fg-3)]">Forgot?</span>
              </div>
              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={INPUT_CLASS}
              />
            </div>
          )}

          {error && <p className="text-xs text-red-400">{error}</p>}

          <button
            type="submit"
            className="mt-1 inline-flex items-center justify-center gap-1.5 rounded-md bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium px-5 py-2.5 transition-colors"
          >
            {mode === 'password' ? 'Sign in' : 'Send magic link'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-[var(--ls-border)]" />
          <span className="text-xs text-[var(--ls-fg-4)]">or</span>
          <div className="h-px flex-1 bg-[var(--ls-border)]" />
        </div>

        {/* Alternative auth method */}
        <button
          type="button"
          onClick={() => {
            setMode(mode === 'password' ? 'magic' : 'password')
            setError('')
          }}
          className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-[var(--ls-border-2)] bg-[var(--ls-surface-2)] px-5 py-2.5 text-sm font-medium text-[var(--ls-fg-2)] transition-colors hover:border-indigo-500/40 hover:text-[var(--ls-fg)]"
        >
          <Mail className="h-4 w-4" />
          {mode === 'password' ? 'Sign in with a magic link' : 'Sign in with a password'}
        </button>

        <p className="mt-8 text-center text-sm text-[var(--ls-fg-3)]">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
            Create one
          </Link>
        </p>
      </div>
    </section>
  )
}

function Wordmark({ className = '' }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`}>
      <div className="flex h-7 w-7 items-center justify-center">
        <LogoMark className="h-[18px] w-[18px] text-[var(--ls-fg)]" />
      </div>
      <span className="text-sm font-semibold tracking-tight text-[var(--ls-fg)]">
        New Venue <span className="text-indigo-400">Data</span>
      </span>
    </Link>
  )
}
