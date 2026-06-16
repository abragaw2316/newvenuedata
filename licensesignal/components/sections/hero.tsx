'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GradientText } from '@/components/shared/gradient-text'
import { TagBadge } from '@/components/shared/tag-badge'
import { MOCK_LICENSES } from '@/lib/mock-data'
import { getLicenseTypeLabel, getStatusBadgeColor, getEventBadgeColor, formatDate } from '@/lib/utils'

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: 'easeOut' as const },
})

export function Hero() {
  const previewRows = MOCK_LICENSES.slice(0, 4)

  return (
    <section className="relative overflow-hidden gradient-hero pt-20 pb-24 lg:pt-28 lg:pb-32">
      {/* Animated drifting indigo blobs (behind all content) */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <motion.div
          className="absolute -left-32 -top-24 h-[28rem] w-[28rem] rounded-full"
          style={{
            background:
              'radial-gradient(circle at center, rgba(99,102,241,0.18) 0%, transparent 70%)',
          }}
          animate={{ x: [0, 60, 0], y: [0, 40, 0], opacity: [0.5, 0.85, 0.5] }}
          transition={{ duration: 12, ease: 'easeInOut', repeat: Infinity }}
        />
        <motion.div
          className="absolute right-[-10rem] top-10 h-[32rem] w-[32rem] rounded-full"
          style={{
            background:
              'radial-gradient(circle at center, rgba(129,140,248,0.14) 0%, transparent 70%)',
          }}
          animate={{ x: [0, -70, 0], y: [0, 50, 0], opacity: [0.45, 0.75, 0.45] }}
          transition={{ duration: 14, ease: 'easeInOut', repeat: Infinity }}
        />
        <motion.div
          className="absolute left-1/2 top-1/3 h-80 w-80 -translate-x-1/2 rounded-full"
          style={{
            background:
              'radial-gradient(circle at center, rgba(99,102,241,0.12) 0%, transparent 70%)',
          }}
          animate={{ x: [0, 40, -30, 0], y: [0, -30, 30, 0], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 9, ease: 'easeInOut', repeat: Infinity }}
        />
      </div>

      {/* Radial bg glow */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(99,102,241,0.12) 0%, transparent 70%)',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {/* Eyebrow */}
          <motion.div {...fadeUp(0)}>
            <TagBadge variant="live">Real-Time Florida License Intelligence</TagBadge>
          </motion.div>

          {/* H1 */}
          <motion.h1
            {...fadeUp(0.1)}
            className="mt-6 text-display-2xl text-[var(--ls-fg)] max-w-4xl md:text-display-2xl text-5xl"
          >
            Know When Restaurants<br className="hidden sm:block" /> and Bars Are Opening
            <br />
            <GradientText>Before Your Competitors</GradientText>
          </motion.h1>

          {/* Sub */}
          <motion.p
            {...fadeUp(0.2)}
            className="mt-6 text-xl text-[var(--ls-fg-2)] max-w-2xl leading-relaxed"
          >
            Monitor Florida liquor and food-service license filings in real time through APIs,
            webhooks, and trigger feeds. Be first in the door — every time.
          </motion.p>

          {/* CTAs */}
          <motion.div {...fadeUp(0.3)} className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button
              render={<Link href="/contact" />}
              nativeButton={false}
              size="lg"
              className="bg-indigo-500 hover:bg-indigo-600 text-white border-0 shadow-[0_0_20px_rgba(99,102,241,0.35)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all px-6"
            >
              Get API Access <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              render={<Link href="/data-coverage" />}
              nativeButton={false}
              variant="outline"
              size="lg"
              className="border-[var(--ls-border-2)] bg-transparent text-[var(--ls-fg-2)] hover:border-[#6366f1] hover:text-[var(--ls-fg)] px-6"
            >
              View Sample Data
            </Button>
          </motion.div>

          {/* Social proof micro-line */}
          <motion.p {...fadeUp(0.35)} className="mt-4 text-xs text-[var(--ls-fg-3)]">
            No contracts. Cancel any time. Starter from $299/mo.
          </motion.p>

          {/* Data preview */}
          <motion.div
            {...fadeUp(0.5)}
            className="mt-14 w-full max-w-4xl rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] overflow-hidden shadow-[0_0_60px_rgba(99,102,241,0.12)]"
          >
            {/* Table header */}
            <div className="flex items-center justify-between border-b border-[var(--ls-border)] px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulseGlow" />
                <span className="text-xs font-medium text-[var(--ls-fg-2)]">Live License Feed</span>
              </div>
              <span className="text-xs text-[var(--ls-fg-3)]">Updated daily · FL DBPR</span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--ls-border)]">
                    {['Business', 'Type', 'County', 'Filed', 'Status', 'Event'].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-widest text-[var(--ls-fg-3)]"
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
                      className={`border-b border-[var(--ls-border)] last:border-0 ${
                        i === 0 ? 'animate-tableFlash' : ''
                      } hover:bg-[var(--ls-hover)] transition-colors`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {i === 0 && (
                            <span className="inline-flex items-center rounded-full border border-indigo-500/20 bg-indigo-500/15 px-1.5 py-0.5 text-[10px] font-medium text-indigo-400">
                              NEW
                            </span>
                          )}
                          <span className="font-medium text-[var(--ls-fg)] truncate max-w-[160px]">
                            {record.businessName}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium`}
                          style={{ background: 'rgba(99,102,241,0.1)', borderColor: 'rgba(99,102,241,0.2)', color: '#818cf8' }}>
                          {record.licenseType}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[var(--ls-fg-2)]">{record.address.county}</td>
                      <td className="px-4 py-3 text-[var(--ls-fg-2)] whitespace-nowrap">
                        {formatDate(record.filedDate, { month: 'short', day: 'numeric' })}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${getStatusBadgeColor(record.status)}`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${getEventBadgeColor(record.eventType)}`}>
                          {record.eventType.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border-t border-[var(--ls-border)] px-4 py-2.5 flex items-center justify-between">
              <span className="text-xs text-[var(--ls-fg-3)]">Showing 4 recent new filings</span>
              <Link href="/data-coverage" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1">
                View full feed <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
