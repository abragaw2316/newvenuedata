'use client'

import { useState } from 'react'
import { Copy, Check, RefreshCw } from 'lucide-react'
import { rotateKey } from '@/app/account/actions'

export function AccountKey({ prefix }: { prefix: string | null }) {
  const [newKey, setNewKey] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [copied, setCopied] = useState(false)

  async function onRotate() {
    if (!confirm('Rotate your API key? Your current key stops working immediately.')) return
    setBusy(true); setErr(null)
    const r = await rotateKey()
    setBusy(false)
    if (r.apiKey) setNewKey(r.apiKey)
    else setErr(r.error || 'Could not rotate key.')
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <code className="font-mono text-sm text-[var(--ls-fg)]">
          {prefix ? `${prefix}${'•'.repeat(16)}` : 'No active key'}
        </code>
        <button
          type="button"
          onClick={onRotate}
          disabled={busy}
          className="inline-flex items-center gap-1.5 rounded-md border border-[var(--ls-border-2)] px-3 py-1.5 text-xs text-[var(--ls-fg-2)] hover:text-[var(--ls-fg)] disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${busy ? 'animate-spin' : ''}`} /> Rotate key
        </button>
      </div>

      {err && <p className="text-xs text-red-600 dark:text-red-400">{err}</p>}

      {newKey && (
        <div className="flex flex-col gap-2 rounded-md border border-indigo-600/30 bg-indigo-500/10 p-3">
          <p className="text-xs text-indigo-700 dark:text-indigo-300">New key — copy it now, it&apos;s shown only once:</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 break-all font-mono text-xs text-[var(--ls-fg)]">{newKey}</code>
            <button
              type="button"
              onClick={() => { navigator.clipboard.writeText(newKey); setCopied(true); setTimeout(() => setCopied(false), 1500) }}
              className="inline-flex items-center gap-1 rounded-md border border-[var(--ls-border-2)] px-2.5 py-1 text-xs text-[var(--ls-fg-2)] hover:text-[var(--ls-fg)]"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}{copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
