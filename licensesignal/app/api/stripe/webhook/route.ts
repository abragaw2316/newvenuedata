// Stripe webhook → bind a paying customer to their plan automatically.
// Dependency-free: the Stripe signature is verified with node:crypto HMAC
// (same scheme as Stripe's SDK), so we don't pull in the `stripe` package.
//
// BUILD-SAFE: with no STRIPE_WEBHOOK_SECRET (or no DB) this acknowledges the
// event and does nothing — so the route is harmless until you switch it on.
//
// To turn on (free): in the Stripe Dashboard → Developers → Webhooks, add an
// endpoint at https://newvenuedata.com/api/stripe/webhook, subscribe to
// checkout.session.completed + customer.subscription.updated/deleted, copy the
// signing secret, and set STRIPE_WEBHOOK_SECRET=whsec_... in Vercel.
import { createHmac, timingSafeEqual } from 'node:crypto'
import { sql, ensureSchema, dbConfigured } from '@/lib/db'
import { sendEmail, welcomeEmail } from '@/lib/email'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type Json = Record<string, unknown>
const asObj = (v: unknown): Json => (v && typeof v === 'object' ? (v as Json) : {})
const str = (v: unknown): string => (typeof v === 'string' ? v : '')
const num = (v: unknown): number => (typeof v === 'number' ? v : Number(v) || 0)

// Amount paid (cents) → internal plan name (matches ACCOUNT_PLAN_TIER in lib/api-keys).
function planFromAmountCents(cents: number): string {
  if (!cents || cents < 1) return 'trial'
  if (cents >= 49900) return 'statewide' // $499+ statewide / feed & API
  if (cents >= 29900) return 'south_fl' // $299 South Florida tri-county
  return 'county' // $99 founding / $149 single county
}

function verifyStripeSignature(payload: string, sigHeader: string | null, secret: string): boolean {
  if (!sigHeader) return false
  const parts: Record<string, string> = {}
  for (const kv of sigHeader.split(',')) {
    const i = kv.indexOf('=')
    if (i > 0) parts[kv.slice(0, i).trim()] = kv.slice(i + 1).trim()
  }
  const t = parts['t']
  const v1 = parts['v1']
  if (!t || !v1) return false
  const ageSec = Math.abs(Date.now() / 1000 - Number(t))
  if (!Number.isFinite(ageSec) || ageSec > 300) return false // replay protection (5 min)
  const expected = createHmac('sha256', secret).update(`${t}.${payload}`).digest('hex')
  const a = Buffer.from(expected)
  const b = Buffer.from(v1)
  return a.length === b.length && timingSafeEqual(a, b)
}

async function setPlanByEmail(email: string, plan: string, customerId: string): Promise<boolean> {
  const { rows } = await sql`SELECT id FROM users WHERE email = ${email} LIMIT 1`
  const u = rows[0] as { id: string } | undefined
  if (!u) return false // concierge buyer with no app account — nothing to bind
  await sql`UPDATE users SET plan = ${plan}, stripe_customer_id = COALESCE(${customerId || null}, stripe_customer_id) WHERE id = ${u.id}`
  await sql`UPDATE api_keys SET plan = ${plan} WHERE user_id = ${u.id} AND revoked = false`
  return true
}

async function setPlanByCustomer(customerId: string, plan: string): Promise<void> {
  if (!customerId) return
  await sql`UPDATE users SET plan = ${plan} WHERE stripe_customer_id = ${customerId}`
  await sql`UPDATE api_keys SET plan = ${plan}
            WHERE revoked = false AND user_id IN (SELECT id FROM users WHERE stripe_customer_id = ${customerId})`
}

const ack = (extra: Json = {}) =>
  new Response(JSON.stringify({ received: true, ...extra }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  })

let warnedStripeDisabled = false

export async function POST(req: Request): Promise<Response> {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  const payload = await req.text()

  // Off until configured — acknowledge so Stripe doesn't retry-storm.
  if (!secret || !dbConfigured()) {
    // LOUD in production: a paid checkout will NOT bind the customer to their
    // plan until this is set. Warn once so it shows up in the Vercel logs.
    if (process.env.NODE_ENV === 'production' && !warnedStripeDisabled) {
      warnedStripeDisabled = true
      console.error(
        '[stripe] STRIPE_WEBHOOK_SECRET or DB not set — paid checkouts will NOT auto-assign plans. ' +
          'Set STRIPE_WEBHOOK_SECRET in Vercel and configure the webhook endpoint.'
      )
    }
    return ack({ configured: false })
  }

  if (!verifyStripeSignature(payload, req.headers.get('stripe-signature'), secret)) {
    return new Response('invalid signature', { status: 400 })
  }

  let event: Json
  try {
    event = JSON.parse(payload) as Json
  } catch {
    return new Response('bad payload', { status: 400 })
  }

  try {
    await ensureSchema()
    const obj = asObj(asObj(event.data).object)
    switch (str(event.type)) {
      case 'checkout.session.completed': {
        const email = (str(asObj(obj.customer_details).email) || str(obj.customer_email)).toLowerCase()
        const plan = planFromAmountCents(num(obj.amount_total))
        if (email) {
          await setPlanByEmail(email, plan, str(obj.customer))
          const { subject, html } = welcomeEmail()
          await sendEmail({ to: email, subject, html }).catch(() => {})
        }
        break
      }
      case 'customer.subscription.updated': {
        const items = asObj(obj.items)
        const first = asObj(Array.isArray(items.data) ? items.data[0] : undefined)
        const cents = num(asObj(first.price).unit_amount)
        const status = str(obj.status)
        const active = status === 'active' || status === 'trialing'
        await setPlanByCustomer(str(obj.customer), active ? planFromAmountCents(cents) : 'trial')
        break
      }
      case 'customer.subscription.deleted': {
        await setPlanByCustomer(str(obj.customer), 'trial')
        break
      }
      default:
        break
    }
  } catch {
    return ack({ handled: false }) // never 500 — Stripe would retry-storm
  }

  return ack()
}
