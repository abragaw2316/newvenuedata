'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { sql, ensureSchema, dbConfigured } from '@/lib/db'
import {
  hashPassword, verifyPassword, createSession, destroySession,
  getCurrentUser, generateApiKey, newId, createAuthToken, consumeAuthToken, siteUrl,
  type AuthResult,
} from '@/lib/auth'
import { sendEmail, verifyEmailMessage, resetPasswordMessage } from '@/lib/email'

const NOT_ENABLED =
  'Accounts are not enabled yet. Email austin@newvenuedata.com and we’ll set you up.'
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

export async function signup(_prev: AuthResult, formData: FormData): Promise<AuthResult> {
  if (!dbConfigured()) return { error: NOT_ENABLED }
  const email = String(formData.get('email') || '').trim().toLowerCase()
  const password = String(formData.get('password') || '')
  const name = String(formData.get('name') || '').trim() || null
  const company = String(formData.get('company') || '').trim() || null

  if (!EMAIL_RE.test(email)) return { error: 'Enter a valid email address.' }
  if (password.length < 8) return { error: 'Password must be at least 8 characters.' }

  try {
    await ensureSchema()
    const exists = await sql`SELECT 1 FROM users WHERE email = ${email} LIMIT 1`
    if (exists.rows.length) return { error: 'An account with that email already exists — try signing in.' }

    const userId = newId()
    const pwHash = await hashPassword(password)
    await sql`INSERT INTO users (id, email, password_hash, name, company, plan)
              VALUES (${userId}, ${email}, ${pwHash}, ${name}, ${company}, 'trial')`

    const { raw, hash, prefix } = generateApiKey()
    await sql`INSERT INTO api_keys (id, user_id, key_hash, key_prefix, plan)
              VALUES (${newId('key_')}, ${userId}, ${hash}, ${prefix}, 'trial')`

    await createSession(userId)

    // Best-effort email verification (no-op until Resend is configured; never blocks signup).
    try {
      const token = await createAuthToken(userId, 'verify', 24 * 60 * 60 * 1000)
      const { subject, html } = verifyEmailMessage(`${siteUrl()}/verify-email?token=${token}`)
      await sendEmail({ to: email, subject, html })
    } catch { /* email is non-critical */ }

    return { apiKey: raw }
  } catch {
    return { error: 'Something went wrong creating your account. Please try again.' }
  }
}

export async function login(_prev: AuthResult, formData: FormData): Promise<AuthResult> {
  if (!dbConfigured()) return { error: NOT_ENABLED }
  const email = String(formData.get('email') || '').trim().toLowerCase()
  const password = String(formData.get('password') || '')
  if (!email || !password) return { error: 'Enter your email and password.' }

  try {
    await ensureSchema()
    const { rows } = await sql`SELECT id, password_hash FROM users WHERE email = ${email} LIMIT 1`
    const user = rows[0] as { id: string; password_hash: string } | undefined
    if (!user || !(await verifyPassword(password, user.password_hash))) {
      return { error: 'Incorrect email or password.' }
    }
    await createSession(user.id)
  } catch {
    return { error: 'Something went wrong signing in. Please try again.' }
  }
  redirect('/account')
}

export async function logout(): Promise<void> {
  await destroySession()
  redirect('/')
}

export async function rotateKey(): Promise<AuthResult> {
  const user = await getCurrentUser()
  if (!user) return { error: 'You are not signed in.' }
  try {
    await sql`UPDATE api_keys SET revoked = true WHERE user_id = ${user.id} AND revoked = false`
    const { raw, hash, prefix } = generateApiKey()
    await sql`INSERT INTO api_keys (id, user_id, key_hash, key_prefix, plan)
              VALUES (${newId('key_')}, ${user.id}, ${hash}, ${prefix}, ${user.plan})`
    revalidatePath('/account')
    return { apiKey: raw }
  } catch {
    return { error: 'Could not rotate your key. Please try again.' }
  }
}

// ── Password reset ──────────────────────────────────────────────────────────────
export async function requestPasswordReset(_prev: AuthResult, formData: FormData): Promise<AuthResult> {
  const email = String(formData.get('email') || '').trim().toLowerCase()
  if (!EMAIL_RE.test(email)) return { error: 'Enter a valid email address.' }
  if (!dbConfigured()) return { error: NOT_ENABLED }
  try {
    await ensureSchema()
    const { rows } = await sql`SELECT id FROM users WHERE email = ${email} LIMIT 1`
    const u = rows[0] as { id: string } | undefined
    if (u) {
      const token = await createAuthToken(u.id, 'reset', 60 * 60 * 1000) // 1 hour
      const { subject, html } = resetPasswordMessage(`${siteUrl()}/reset-password?token=${token}`)
      await sendEmail({ to: email, subject, html }).catch(() => {})
    }
    // Always report success — never reveal whether an account exists for this email.
    return { sent: true }
  } catch {
    return { error: 'Something went wrong. Please try again.' }
  }
}

export async function resetPassword(_prev: AuthResult, formData: FormData): Promise<AuthResult> {
  const token = String(formData.get('token') || '')
  const password = String(formData.get('password') || '')
  if (password.length < 8) return { error: 'Password must be at least 8 characters.' }
  if (!dbConfigured()) return { error: NOT_ENABLED }
  try {
    await ensureSchema()
    const userId = await consumeAuthToken(token, 'reset')
    if (!userId) return { error: 'This reset link is invalid or has expired — request a new one.' }
    const pwHash = await hashPassword(password)
    await sql`UPDATE users SET password_hash = ${pwHash} WHERE id = ${userId}`
    await sql`DELETE FROM sessions WHERE user_id = ${userId}` // sign out everywhere
    return { message: 'Your password has been reset. You can sign in now.' }
  } catch {
    return { error: 'Something went wrong. Please try again.' }
  }
}

// ── Email verification ──────────────────────────────────────────────────────────
export async function resendVerification(_prev: AuthResult, _formData: FormData): Promise<AuthResult> {
  const user = await getCurrentUser()
  if (!user) return { error: 'You are not signed in.' }
  try {
    const token = await createAuthToken(user.id, 'verify', 24 * 60 * 60 * 1000)
    const { subject, html } = verifyEmailMessage(`${siteUrl()}/verify-email?token=${token}`)
    const r = await sendEmail({ to: user.email, subject, html })
    if (r.skipped) return { error: 'Email isn’t enabled yet. Email austin@newvenuedata.com.' }
    return { sent: true }
  } catch {
    return { error: 'Could not send the email. Please try again.' }
  }
}
