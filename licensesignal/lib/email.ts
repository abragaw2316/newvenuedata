// Transactional email via Resend (free tier: 3k/mo). No SDK dependency — just
// fetch, mirroring prospect-engine/src/send/resend.mjs. BUILD-SAFE: when
// RESEND_API_KEY is unset, sendEmail() is a no-op returning { skipped: true },
// so signup/webhooks/build all work before you connect Resend.
//
// To turn on (free): create a Resend account, verify newvenuedata.com (or a
// send.newvenuedata.com subdomain), then set in Vercel:
//   RESEND_API_KEY=re_...           (required to actually send)
//   EMAIL_FROM=austin@newvenuedata.com   (optional; defaults to this)
//   EMAIL_FROM_NAME=New Venue Data       (optional)
//   EMAIL_REPLY_TO=austin@newvenuedata.com (optional)
//   MAILING_ADDRESS="New Venue Data, 123 Main St, City, FL 33000" (your real
//     business postal address — appended to every email footer to satisfy the
//     CAN-SPAM Act's physical-address requirement on marketing email)

const RESEND_ENDPOINT = 'https://api.resend.com/emails'

export interface SendEmailInput {
  to: string
  subject: string
  html: string
  text?: string
  replyTo?: string
}
export interface SendEmailResult {
  ok: boolean
  id?: string
  skipped?: boolean
  error?: string
}

export function emailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY)
}

function fromAddress(): string {
  const email = process.env.EMAIL_FROM || 'austin@newvenuedata.com'
  const name = process.env.EMAIL_FROM_NAME || 'New Venue Data'
  return `${name} <${email}>`
}

/** Strip tags for a plain-text fallback part (improves deliverability). */
export function htmlToText(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<a [^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, '$2 ($1)')
    .replace(/<\/(p|div|tr|h[1-6]|li)>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim()
}

export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return { ok: false, skipped: true } // not configured yet — no-op
  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: fromAddress(),
        to: [input.to],
        reply_to: input.replyTo || process.env.EMAIL_REPLY_TO || 'austin@newvenuedata.com',
        subject: input.subject,
        html: input.html,
        text: input.text ?? htmlToText(input.html),
      }),
    })
    const data = (await res.json().catch(() => ({}))) as { id?: string; message?: string; error?: string }
    if (!res.ok) return { ok: false, error: data?.message || data?.error || `HTTP ${res.status}` }
    return { ok: true, id: data.id }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'send-failed' }
  }
}

// ── Branded HTML shell (inline styles — email clients ignore <style>) ───────────
const INK = '#1c1917'
const PAPER = '#faf8f5'
const GREEN = '#15803d'
const MUTED = '#57534e'
const BORDER = '#e7e2db'

function shell(heading: string, bodyHtml: string): string {
  return `<!DOCTYPE html><html><body style="margin:0;padding:0;background:${PAPER};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PAPER};padding:32px 0;font-family:'Helvetica Neue',Arial,sans-serif;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border:1px solid ${BORDER};border-radius:12px;overflow:hidden;">
        <tr><td style="padding:24px 32px 8px;">
          <span style="font-size:15px;font-weight:700;color:${INK};letter-spacing:-0.01em;">New Venue <span style="color:${GREEN};">Data</span></span>
        </td></tr>
        <tr><td style="padding:8px 32px 0;">
          <h1 style="margin:0 0 12px;font-size:22px;line-height:1.3;color:${INK};">${heading}</h1>
        </td></tr>
        <tr><td style="padding:0 32px 28px;font-size:15px;line-height:1.6;color:${MUTED};">
          ${bodyHtml}
        </td></tr>
      </table>
      <p style="max-width:520px;margin:16px auto 0;font-size:12px;color:#a8a29e;font-family:'Helvetica Neue',Arial,sans-serif;">
        New Venue Data · Florida public-record business intelligence · newvenuedata.com${
          process.env.MAILING_ADDRESS ? `<br/>${process.env.MAILING_ADDRESS}` : ''
        }
      </p>
    </td></tr>
  </table>
  </body></html>`
}

function button(href: string, label: string): string {
  return `<a href="${href}" style="display:inline-block;background:${GREEN};color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;padding:12px 22px;border-radius:8px;">${label}</a>`
}

// ── Specific emails ─────────────────────────────────────────────────────────────
export function welcomeEmail(name?: string): { subject: string; html: string } {
  const hi = name ? `Hi ${name},` : 'Hi there,'
  return {
    subject: "You're in — your first New Venue Data list is on the way",
    html: shell('Welcome to New Venue Data', `
      <p style="margin:0 0 14px;">${hi}</p>
      <p style="margin:0 0 14px;">Thanks for subscribing — you're all set. Here's what happens next:</p>
      <ul style="margin:0 0 18px;padding-left:18px;">
        <li style="margin-bottom:8px;">Your first list of brand-new venues licensed to serve alcohol in your county arrives within one business day.</li>
        <li style="margin-bottom:8px;">After that, a fresh batch lands in your inbox every Monday morning.</li>
        <li style="margin-bottom:8px;">Your 14-day free trial is running now — no charge until it ends, cancel anytime.</li>
      </ul>
      <p style="margin:0 0 18px;">Want me to add a county, focus on bars vs. restaurants, or look into phone numbers? Just reply to this email — a real person reads every one.</p>
      <p style="margin:0;">— Austin Bragaw, New Venue Data</p>
    `),
  }
}

export function verifyEmailMessage(verifyUrl: string): { subject: string; html: string } {
  return {
    subject: 'Confirm your email — New Venue Data',
    html: shell('Confirm your email', `
      <p style="margin:0 0 18px;">Tap the button below to confirm this is your email address and activate your account.</p>
      <p style="margin:0 0 22px;">${button(verifyUrl, 'Confirm my email')}</p>
      <p style="margin:0 0 8px;font-size:13px;color:#a8a29e;">Or paste this link into your browser:</p>
      <p style="margin:0 0 18px;font-size:13px;word-break:break-all;"><a href="${verifyUrl}" style="color:${GREEN};">${verifyUrl}</a></p>
      <p style="margin:0;font-size:13px;color:#a8a29e;">If you didn't create an account, you can ignore this email.</p>
    `),
  }
}

export function resetPasswordMessage(resetUrl: string): { subject: string; html: string } {
  return {
    subject: 'Reset your password — New Venue Data',
    html: shell('Reset your password', `
      <p style="margin:0 0 18px;">We got a request to reset your password. Tap below to choose a new one. This link expires in 1 hour.</p>
      <p style="margin:0 0 22px;">${button(resetUrl, 'Reset password')}</p>
      <p style="margin:0 0 8px;font-size:13px;color:#a8a29e;">Or paste this link into your browser:</p>
      <p style="margin:0 0 18px;font-size:13px;word-break:break-all;"><a href="${resetUrl}" style="color:${GREEN};">${resetUrl}</a></p>
      <p style="margin:0;font-size:13px;color:#a8a29e;">If you didn't request this, ignore this email — your password won't change.</p>
    `),
  }
}

export function weeklyDigestEmail(opts: {
  name?: string
  region: string
  count: number
  filedRange: string
  highlights: string[]
}): { subject: string; html: string } {
  const hi = opts.name ? `Hi ${opts.name},` : 'Hi there,'
  const items = opts.highlights.length
    ? `<ul style="margin:0 0 18px;padding-left:18px;">${opts.highlights
        .map((h) => `<li style="margin-bottom:6px;">${h}</li>`)
        .join('')}</ul>`
    : ''
  return {
    subject: `This week: ${opts.count} new ${opts.region} venues that need liquor liability`,
    html: shell('This week’s new venues', `
      <p style="margin:0 0 14px;">${hi}</p>
      <p style="margin:0 0 14px;">Here are this week's <strong>${opts.count}</strong> brand-new ${opts.region} venues licensed to serve alcohol (filed ${opts.filedRange}). Your full list is attached as a spreadsheet.</p>
      ${items}
      <p style="margin:0 0 0;">Reply any time to change counties or ask a question.</p>
    `),
  }
}
