'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CodeTab {
  label: string
  language: string
  code: string
}

interface CodeTabsProps {
  tabs: CodeTab[]
  className?: string
}

export function CodeTabs({ tabs, className }: CodeTabsProps) {
  const [active, setActive] = useState(0)
  const [copied, setCopied] = useState(false)

  const activeTab = tabs[active] ?? tabs[0]

  const copy = async () => {
    if (!activeTab) return
    await navigator.clipboard.writeText(activeTab.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!activeTab) return null

  return (
    <div
      className={cn(
        'overflow-hidden rounded-lg border border-[var(--ls-border)] bg-[var(--ls-surface-2)]',
        className
      )}
    >
      {/* Tab row */}
      <div className="flex items-center justify-between border-b border-[var(--ls-border)] bg-[var(--ls-surface-2)]">
        <div
          role="tablist"
          aria-label="Code examples"
          className="flex flex-1 overflow-x-auto"
        >
          {tabs.map((tab, index) => {
            const isActive = index === active
            return (
              <button
                key={tab.label}
                role="tab"
                type="button"
                aria-selected={isActive}
                onClick={() => {
                  setActive(index)
                  setCopied(false)
                }}
                className={cn(
                  '-mb-px whitespace-nowrap border-b-2 px-4 py-2.5 text-xs font-medium transition-colors',
                  isActive
                    ? 'border-indigo-400 text-indigo-400'
                    : 'border-transparent text-[var(--ls-fg-3)] hover:text-[var(--ls-fg-2)]'
                )}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        <button
          onClick={copy}
          type="button"
          aria-label="Copy code"
          className="mr-3 ml-2 flex shrink-0 items-center gap-1.5 rounded-md border border-[var(--ls-border-2)] bg-[var(--ls-border)] px-2.5 py-1 text-xs text-[var(--ls-fg-3)] transition-all hover:border-[var(--ls-fg-4)] hover:text-[var(--ls-fg)]"
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

      {/* Code */}
      <pre
        role="tabpanel"
        className="overflow-x-auto p-4 font-mono text-xs leading-6 text-[var(--ls-fg-2)]"
      >
        {activeTab.code}
      </pre>
    </div>
  )
}
