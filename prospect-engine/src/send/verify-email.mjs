// Free pre-send email validation: syntax + MX record check (node:dns). Cuts bounces
// before they hurt the sending domain's reputation. No paid verifier needed.
//
// Tri-state result so a flaky DNS lookup NEVER permanently suppresses a prospect:
//   verdict 'ok'      → safe to send
//   verdict 'invalid' → bad syntax or domain has no mail (ENOTFOUND/ENODATA) → suppress
//   verdict 'unknown' → DNS error/timeout → skip this run, retry next time (no suppress)
// Set SEND_SKIP_VERIFY=1 to skip the MX check entirely (e.g. restricted DNS env).
import { resolveMx } from 'node:dns/promises'

const SYNTAX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
const ROLE = /^(info|sales|admin|office|contact|support|hello|team)@/i

export async function isSendable(email) {
  if (!email || !SYNTAX.test(email)) return { ok: false, verdict: 'invalid', reason: 'bad-syntax' }
  const note = ROLE.test(email) ? 'role-address' : ''
  if (process.env.SEND_SKIP_VERIFY === '1') return { ok: true, verdict: 'ok', reason: note }

  const domain = email.split('@')[1].toLowerCase()
  try {
    const mx = await resolveMx(domain)
    if (mx && mx.length) return { ok: true, verdict: 'ok', reason: note }
    return { ok: false, verdict: 'invalid', reason: 'no-mx' }
  } catch (e) {
    const code = e?.code || ''
    if (code === 'ENOTFOUND' || code === 'ENODATA') return { ok: false, verdict: 'invalid', reason: 'no-mx' }
    return { ok: false, verdict: 'unknown', reason: `dns-${code || 'error'}` }
  }
}
