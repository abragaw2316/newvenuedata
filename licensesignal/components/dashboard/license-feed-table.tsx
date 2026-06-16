'use client'

import { useState } from 'react'
import { Download, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MOCK_LICENSES } from '@/lib/mock-data'
import {
  getLicenseTypeLabel,
  getStatusBadgeColor,
  getEventBadgeColor,
  getEventTypeLabel,
  formatDate,
} from '@/lib/utils'

const PAGE_SIZE = 10

export function LicenseFeedTable() {
  const [page, setPage] = useState(0)
  const totalPages = Math.ceil(MOCK_LICENSES.length / PAGE_SIZE)
  const rows = MOCK_LICENSES.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  return (
    <div className="flex flex-col gap-0 rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--ls-border)] px-4 py-3">
        <h3 className="text-sm font-medium text-[var(--ls-fg)]">License Feed</h3>
        <Button
          size="sm"
          variant="outline"
          className="h-7 border-[var(--ls-border-2)] text-xs text-[var(--ls-fg-2)] hover:text-[var(--ls-fg)]"
        >
          <Download className="mr-1.5 h-3 w-3" />
          Export CSV
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[800px]">
          <thead>
            <tr className="border-b border-[var(--ls-border)]">
              {['#', 'Business Name', 'Type', 'County', 'City', 'Filed', 'Status', 'Event'].map((h) => (
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
            {rows.map((record, i) => (
              <tr
                key={record.id}
                className="border-b border-[var(--ls-border)] last:border-0 hover:bg-[var(--ls-hover)] transition-colors"
              >
                <td className="px-4 py-3 text-xs text-[var(--ls-fg-3)] tabular-nums">
                  {page * PAGE_SIZE + i + 1}
                </td>
                <td className="px-4 py-3">
                  <span className="font-medium text-[var(--ls-fg)] truncate max-w-[180px] block">
                    {record.businessName}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-xs font-medium text-indigo-400">
                    {record.licenseType}
                  </span>
                </td>
                <td className="px-4 py-3 text-[var(--ls-fg-2)] whitespace-nowrap">{record.address.county}</td>
                <td className="px-4 py-3 text-[var(--ls-fg-2)]">{record.address.city}</td>
                <td className="px-4 py-3 text-[var(--ls-fg-2)] whitespace-nowrap text-xs">
                  {formatDate(record.filedDate, { month: 'short', day: 'numeric' })}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${getStatusBadgeColor(record.status)}`}>
                    {record.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${getEventBadgeColor(record.eventType)}`}>
                    {getEventTypeLabel(record.eventType)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-[var(--ls-border)] px-4 py-3">
        <span className="text-xs text-[var(--ls-fg-3)]">
          {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, MOCK_LICENSES.length)} of{' '}
          {MOCK_LICENSES.length} records
        </span>
        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 text-[var(--ls-fg-3)] hover:text-[var(--ls-fg)]"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-xs text-[var(--ls-fg-3)] px-2">
            {page + 1} / {totalPages}
          </span>
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 text-[var(--ls-fg-3)] hover:text-[var(--ls-fg)]"
            disabled={page === totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
