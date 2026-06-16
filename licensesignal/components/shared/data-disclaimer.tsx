import { ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DataDisclaimerProps {
  className?: string
}

const POINTS = [
  'Released under Florida Chapter 119 public-records law.',
  'Business-entity data only (FCRA-safe) — this is not a consumer report and may not be used for credit, employment, tenant, or insurance screening of individuals.',
  'Not affiliated with or endorsed by the Florida DBPR or the State of Florida.',
  'Data is provided "as is" with no warranty. Always verify high-stakes records against the official source before acting on them.',
]

/**
 * Compliance / provenance disclaimer block. Small, muted, token-colored.
 * Server component — safe to render anywhere.
 */
export function DataDisclaimer({ className }: DataDisclaimerProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-5',
        className
      )}
    >
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-4 w-4 text-[var(--ls-fg-3)]" aria-hidden="true" />
        <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--ls-fg-3)]">
          Compliance &amp; data notice
        </h3>
      </div>
      <ul className="mt-3 flex flex-col gap-2">
        {POINTS.map((point) => (
          <li
            key={point}
            className="flex gap-2 text-xs leading-relaxed text-[var(--ls-fg-4)]"
          >
            <span aria-hidden="true" className="text-[var(--ls-fg-4)]">
              &bull;
            </span>
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
