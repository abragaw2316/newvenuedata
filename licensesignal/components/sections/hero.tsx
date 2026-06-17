'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GradientText } from '@/components/shared/gradient-text'
import { MOCK_LICENSES } from '@/lib/mock-data'
import { getStatusBadgeColor, getEventBadgeColor, formatDate } from '@/lib/utils'

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: 'easeOut' as const },
})

export function Hero() {
  const previewRows = MOCK_LICENSES.slice(0, 4)

  return (
    <section className="relative overflow-hidden gradient-hero pt-20 pb-24 lg:pt-28 lg:pb-32">
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {/* Eyebrow — hairline rule, no glow */}
          <motion.div
            {...fadeUp(0)}
            className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--ls-fg-3)]"
          >
            <span className="h-px w-7 bg-[var(--ls-border-2)]" />
            Real-Time Florida License Intelligence
            <span className="h-px w-7 bg-[var(--ls-border-2)]" />
          </motion.div>

          {/* H1 — editorial serif (Fraunces via base styles) */}
          <motion.h1
            {...fadeUp(0.1)}
            className="mt-6 text-display-2xl text-[var(--ls-fg)] max-w-4xl text-balance"
          >
            Know which restaurants and bars are opening{' '}
            <GradientText className="italic">before your competitors</GradientText>
          </motion.h1>

          {/* Sub */}
          <motion.p
            {...fadeUp(0.2)}
            className="mt-6 text-lg sm:text-xl text-[var(--ls-fg-2)] max-w-2xl leading-relaxed"
          >
            New Venue Data turns Florida&rsquo;s public liquor and food-service license filings
            into a clean daily feed of brand-new venues — delivered by list, API, or webhook the
            week they open.
          </motion.p>

          {/* CTAs — solid ink primary + ghost, no glow */}
          <motion.div {...fadeUp(0.3)} className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Button
              render={<Link href="/pricing" />}
              nativeButton={false}
              size="lg"
              className="bg-[var(--ls-fg)] text-[var(--ls-bg)] hover:opacity-90 border-0 px-6 transition-opacity"
            >
              See plans &amp; pricing <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              render={<Link href="/data-coverage" />}
              nativeButton={false}
              variant="outline"
              size="lg"
              className="border-[var(--ls-border-2)] bg-transparent text-[var(--ls-fg-2)] hover:border-[var(--ls-fg-3)] hover:text-[var(--ls-fg)] px-6"
            >
              View sample data
            </Button>
          </motion.div>

          <motion.p {...fadeUp(0.35)} className="mt-4 text-xs text-[var(--ls-fg-3)]">
            From $149/mo · no contracts · cancel anytime
          </motion.p>

          {/* Live data panel — hairline border, soft shadow, mono numerics */}
          <motion.div
            {...fadeUp(0.5)}
            className="mt-14 w-full max-w-4xl rounded-lg border border-[var(--ls-border)] bg-[var(--ls-surface)] overflow-hidden shadow-[var(--shadow-glow-lg)]"
          >
            <div className="flex items-center justify-between border-b border-[var(--ls-border)] px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulseGlow" />
                <span className="text-xs font-medium tracking-wide text-[var(--ls-fg-2)]">Live license feed</span>
              </div>
              <span className="font-mono text-[11px] text-[var(--ls-fg-3)]">Updated daily · FL DBPR</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--ls-border)]">
                    {['Business', 'Type', 'County', 'Filed', 'Status', 'Event'].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--ls-fg-3)]"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewRows.map((record, i) => (
                    <tr
                      key={record.id}
                      className={`border-b border-[var(--ls-border)] last:border-0 ${i === 0 ? 'animate-tableFlash' : ''} hover:bg-[var(--ls-hover)] transition-colors`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {i === 0 && (
                            <span className="inline-flex items-center rounded-sm border border-indigo-500/25 bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-indigo-700">
                              New
                            </span>
                          )}
                          <span className="font-medium text-[var(--ls-fg)] truncate max-w-[160px]">
                            {record.businessName}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-sm border border-[var(--ls-border-2)] bg-[var(--ls-surface-2)] px-2 py-0.5 font-mono text-xs text-[var(--ls-fg-2)]">
                          {record.licenseType}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[var(--ls-fg-2)]">{record.address.county}</td>
                      <td className="px-4 py-3 font-mono text-[var(--ls-fg-2)] whitespace-nowrap">
                        {formatDate(record.filedDate, { month: 'short', day: 'numeric' })}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded-sm border px-2 py-0.5 text-xs font-medium ${getStatusBadgeColor(record.status)}`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded-sm border px-2 py-0.5 text-xs font-medium ${getEventBadgeColor(record.eventType)}`}>
                          {record.eventType.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border-t border-[var(--ls-border)] px-4 py-2.5 flex items-center justify-between">
              <span className="font-mono text-[11px] text-[var(--ls-fg-3)]">4 recent new filings</span>
              <Link href="/data-coverage" className="text-xs font-medium text-indigo-700 hover:opacity-80 transition-opacity flex items-center gap-1">
                View full feed <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
