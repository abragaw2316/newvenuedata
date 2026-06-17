'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { sql, ensureSchema, dbConfigured } from '@/lib/db'
import {
  hashPassword, verifyPassword, createSession, destroySession,
  getCurrentUser, generateApiKey, newId, type AuthResult,
} from '@/lib/auth'

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
