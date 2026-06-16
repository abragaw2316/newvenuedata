// Polite HTTP with timeout + retry/backoff. Shared by discovery + enrichment.
import { USER_AGENT, MAX_RETRIES, FETCH_TIMEOUT_MS, REQUEST_DELAY_MS } from './config.mjs'
import { sleep } from './util.mjs'

/**
 * Fetch a URL as text with a timeout, polite UA, and bounded retries.
 * Returns { ok, status, text, error }. Never throws.
 */
export async function fetchText(url, { method = 'GET', body = null, headers = {}, timeoutMs = FETCH_TIMEOUT_MS, retries = MAX_RETRIES } = {}) {
  let lastErr = ''
  for (let attempt = 0; attempt <= retries; attempt++) {
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), timeoutMs)
    try {
      const res = await fetch(url, {
        method,
        body,
        redirect: 'follow',
        signal: ctrl.signal,
        headers: { 'User-Agent': USER_AGENT, Accept: '*/*', ...headers },
      })
      clearTimeout(timer)
      const text = await res.text()
      if (res.status === 429 || res.status >= 500) {
        lastErr = `HTTP ${res.status}`
        await sleep(REQUEST_DELAY_MS * (attempt + 2)) // backoff
        continue
      }
      return { ok: res.ok, status: res.status, text, error: res.ok ? '' : `HTTP ${res.status}` }
    } catch (e) {
      clearTimeout(timer)
      lastErr = e.name === 'AbortError' ? 'timeout' : String(e.message || e)
      await sleep(REQUEST_DELAY_MS * (attempt + 1))
    }
  }
  return { ok: false, status: 0, text: '', error: lastErr || 'request failed' }
}
