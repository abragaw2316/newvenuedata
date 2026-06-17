// Resend adapter (free tier). Sends plain-text 1:1 email with a List-Unsubscribe
// header. Also polls a sent message's status so we can suppress bounces/complaints
// locally (no public webhook needed — fits the local-first engine).
import { SEND } from '../config.mjs'

export async function sendViaResend({ to, subject, text }) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${SEND.apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: `${SEND.fromName} <${SEND.fromEmail}>`,
      to: [to],
      reply_to: SEND.replyTo,
      subject,
      text,
      headers: {
        'List-Unsubscribe': `<${SEND.unsubscribeMailto}>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      },
    }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) return { ok: false, error: data?.message || data?.error || `HTTP ${res.status}` }
  return { ok: true, id: data.id }
}

/** Returns Resend's latest event for a message id ('delivered'|'bounced'|'complained'|...) or null. */
export async function getResendStatus(id) {
  try {
    const res = await fetch(`https://api.resend.com/emails/${id}`, {
      headers: { Authorization: `Bearer ${SEND.apiKey}` },
    })
    if (!res.ok) return null
    const d = await res.json().catch(() => null)
    return d?.last_event || d?.status || null
  } catch {
    return null
  }
}
