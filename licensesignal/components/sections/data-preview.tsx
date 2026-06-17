'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { SectionHeading } from '@/components/shared/section-heading'
import { MOCK_LICENSES } from '@/lib/mock-data'
import { getLicenseTypeLabel, getStatusBadgeColor, getEventBadgeColor, formatDate } from '@/lib/utils'

type DisplayRow = { record: (typeof MOCK_LICENSES)[0]; displayKey: string }

export function DataPreview() {
  const [rows, setRows] = useState<DisplayRow[]>(() =>
    MOCK_LICENSES.slice(0, 8).map((r, i) => ({ record: r, displayKey: `${r.id}-${i}` }))
  )
  const [flashKey, setFlashKey] = useState<string | null>(null)

  useEffect(() => {
    let idx = 8
    const interval = setInterval(() => {
      const record = MOCK_LICENSES[idx % MOCK_LICENSES.length]
      const displayKey = `${record.id}-${idx}`
      setRows((prev) => [{ record, displayKey }, ...prev.slice(0, 7)])
      setFlashKey(displayKey)
      setTimeout(() => setFlashKey(null), 1200)
      idx++
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-24 lg:py-32 bg-[var(--ls-surface-2)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeading
            eyebrow="Live Feed"
            heading="Florida License Feed"
            subtext="New filings appear here within 24 hours of being published by FL DBPR."
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[var(--ls-border)] px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-medium text-[var(--ls-fg-2)]">Live</span>
            </div>
            <span className="text-xs text-[var(--ls-fg-3)]">Auto-refreshes every 3.5s</span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead>
                <tr className="border-b border-[var(--ls-border)]">
                  {['Business Name', 'License Type', 'County', 'City', 'Filed Date', 'Status', 'Event'].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-medium uppercase tracking-widest text-[var(--ls-fg-3)]"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence initial={false}>
                  {rows.map(({ record, displayKey }, i) => (
                    <motion.tr
                      key={displayKey}
                      initial={{ opacity: 0, backgroundColor: 'rgba(31,107,76,0.2)' }}
                      animate={{ opacity: 1, backgroundColor: 'transparent' }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.6 }}
                      className="border-b border-[var(--ls-border)] last:border-0 hover:bg-[var(--ls-hover)] transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {i === 0 && (
                            <span className="inline-flex items-center rounded-full border border-indigo-500/20 bg-indigo-500/15 px-1.5 py-0.5 text-[10px] font-medium text-indigo-400 whitespace-nowrap">
                              NEW
                            </span>
                          )}
                          <span className="font-medium text-[var(--ls-fg)] truncate max-w-[160px]">
                            {record.businessName}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-xs font-medium text-indigo-400">
                          {record.licenseType}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[var(--ls-fg-2)] whitespace-nowrap">{record.address.county}</td>
                      <td className="px-4 py-3 text-[var(--ls-fg-2)]">{record.address.city}</td>
                      <td className="px-4 py-3 text-[var(--ls-fg-2)] whitespace-nowrap">
                        {formatDate(record.filedDate, { month: 'short', day: 'numeric' })}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${getStatusBadgeColor(record.status)}`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${getEventBadgeColor(record.eventType)}`}>
                          {record.eventType.replace('_', ' ')}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          <div className="border-t border-[var(--ls-border)] px-4 py-3 flex items-center justify-between">
            <span className="text-xs text-[var(--ls-fg-3)]">
              Showing recent FL DBPR filings. Updated daily from source.
            </span>
            <Link
              href="/data-coverage"
              className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
            >
              Get the full feed <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
