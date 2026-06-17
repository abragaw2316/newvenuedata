// Email-verification link target. The verify email links here with ?token=…;
// we single-use the token, flag the user verified, and bounce to /account.
import { consumeAuthToken } from '@/lib/auth'
import { sql, ensureSchema, dbConfigured } from '@/lib/db'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: Request): Promise<Response> {
  const url = new URL(req.url)
  const token = url.searchParams.get('token') || ''
  const base = url.origin

  if (!dbConfigured()) return Response.redirect(`${base}/login`, 302)
  try {
    await ensureSchema()
    const userId = await consumeAuthToken(token, 'verify')
    if (userId) {
      await sql`UPDATE users SET email_verified = true WHERE id = ${userId}`
      return Response.redirect(`${base}/account?verified=1`, 302)
    }
  } catch {
    /* fall through to the failure redirect */
  }
  return Response.redirect(`${base}/login?verify=failed`, 302)
}
