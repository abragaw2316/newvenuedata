'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CodeBlockProps {
  code: string
  language?: string
  className?: string
}

export function CodeBlock({ code, language, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn('relative rounded-lg border border-[var(--ls-border)] bg-[var(--ls-surface-2)] overflow-hidden', className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--ls-border)] px-4 py-2">
        {language && (
          <span className="text-xs font-medium text-[var(--ls-fg-3)] uppercase tracking-widest">
            {language}
          </span>
        )}
        <button
          onClick={copy}
          className="ml-auto flex items-center gap-1.5 rounded-md border border-[var(--ls-border-2)] bg-[var(--ls-border)] px-2.5 py-1 text-xs text-[var(--ls-fg-3)] hover:text-[var(--ls-fg)] hover:border-[var(--ls-fg-4)] transition-all"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-xs leading-6 text-[var(--ls-fg-2)]">
        {code}
      </pre>
    </div>
  )
}
