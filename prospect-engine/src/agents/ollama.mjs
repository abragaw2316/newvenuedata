// Thin client for a LOCAL Ollama server (free, private). If Ollama isn't running,
// every helper returns null so callers fall back to deterministic template mode.
import { OLLAMA } from '../config.mjs'

let _available = null

export async function ollamaAvailable() {
  if (_available !== null) return _available
  try {
    const ctrl = new AbortController()
    const t = setTimeout(() => ctrl.abort(), 2500)
    const res = await fetch(`${OLLAMA.url}/api/tags`, { signal: ctrl.signal })
    clearTimeout(t)
    _available = res.ok
  } catch {
    _available = false
  }
  return _available
}

async function generate(prompt, { json = false } = {}) {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), OLLAMA.timeoutMs)
  try {
    const res = await fetch(`${OLLAMA.url}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: ctrl.signal,
      body: JSON.stringify({
        model: OLLAMA.model,
        prompt,
        stream: false,
        ...(json ? { format: 'json' } : {}),
        options: { temperature: OLLAMA.temperature },
      }),
    })
    clearTimeout(t)
    if (!res.ok) return null
    const data = await res.json()
    return data.response ?? null
  } catch {
    clearTimeout(t)
    return null
  }
}

/** Generate and parse a JSON object. Returns null on any failure. */
export async function ollamaJson(prompt) {
  const out = await generate(prompt, { json: true })
  if (!out) return null
  try {
    return JSON.parse(out)
  } catch {
    const m = out.match(/\{[\s\S]*\}/)
    if (m) { try { return JSON.parse(m[0]) } catch { return null } }
    return null
  }
}

export async function ollamaText(prompt) {
  return generate(prompt, { json: false })
}
