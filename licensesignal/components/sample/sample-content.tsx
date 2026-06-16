'use client'

import { useMemo, useState } from 'react'
import { Download, ChevronLeft, ChevronRight } from 'lucide-react'
import { MOCK_LICENSES } from '@/lib/mock-data'
import {
  cn,
  formatDate,
  getStatusBadgeColor,
  getLicenseTypeLabel,
} from '@/lib/utils'
import { LiveDataBadge } from '@/components/shared/live-data-badge'

// Number of real records exposed in the public sample.
const SAMPLE_SIZE = 25
const PAGE_SIZE = 10

const SAMPLE_RECORDS = MOCK_LICENSES.slice(0, SAMPLE_SIZE)

const COLUMNS = [
  'Business Name',
  'Type',
  'City',
  'County',
  'Filed',
  'Status',
] as const

// CSV column order — mirrors what the API/exports deliver for these fields.
const CSV_HEADERS = [
  'license_number',
  'business_name',
  'license_type',
  'license_type_label',
  'city',
  'county',
  'state',
  'zip',
  'filed_date',
  'status',
] as const

function escapeCsv(value: string): string {
  // Quote fields containing commas, quotes, or newlines; double internal quotes.
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

function buildCsv(records: typeof SAMPLE_RECORDS): string {
  const rows = records.map((r) =>
    [
      r.licenseNumber,
      r.businessName,
      r.licenseType,
      getLicenseTypeLabel(r.licenseType),
      r.address.city,
      r.address.county,
      r.address.state,
      r.address.zip,
      r.filedDate,
      r.status,
    ]
      .map((cell) => escapeCsv(String(cell ?? '')))
      .join(',')
  )
  return [CSV_HEADERS.join(','), ...rows].join('\r\n')
}

export function SampleContent() {
  const [page, setPage] = useState(0)

  const pageCount = Math.ceil(SAMPLE_RECORDS.length / PAGE_SIZE)
  const pageRecords = useMemo(
    () => SAMPLE_RECORDS.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE),
    [page]
  )

  function handleDownload() {
    const csv = buildCsv(SAMPLE_RECORDS)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'licensesignal-florida-sample.csv'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const firstShown = page * PAGE_SIZE + 1
  const lastShown = Math.min((page + 1) * PAGE_SIZE, SAMPLE_RECORDS.length)

  return (
    <div className="flex flex-col gap-6">
      {/* Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <LiveDataBadge />
          <span className="text-sm text-[var(--ls-fg-3)]">
            {SAMPLE_RECORDS.length} real Florida records
          </span>
        </div>
        <button
          type="button"
          onClick={handleDownload}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-sm font-medium text-indigo-400 transition-colors hover:border-indigo-500/50 hover:bg-indigo-500/15"
        >
          <Download className="h-4 w-4" />
          Download sample CSV
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-[var(--ls-border)]">
                {COLUMNS.map((h) => (
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
              {pageRecords.map((record) => (
                <tr
                  key={record.id}
                  className="border-b border-[var(--ls-border)] transition-colors last:border-0 hover:bg-[var(--ls-hover)]"
                >
                  <td className="px-4 py-3">
                    <span className="block max-w-[220px] truncate font-medium text-[var(--ls-fg)]">
                      {record.businessName}
                    </span>
                    <span className="block text-xs text-[var(--ls-fg-4)]">
                      {record.licenseNumber}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-flex items-center rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-xs font-medium text-indigo-400"
                      title={getLicenseTypeLabel(record.licenseType)}
                    >
                      {record.licenseType}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[var(--ls-fg-2)]">
                    {record.address.city}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-[var(--ls-fg-2)]">
                    {record.address.county}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-[var(--ls-fg-2)]">
                    {formatDate(record.filedDate)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize',
                        getStatusBadgeColor(record.status)
                      )}
                    >
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination footer */}
        <div className="flex items-center justify-between gap-4 border-t border-[var(--ls-border)] px-4 py-3">
          <span className="text-xs text-[var(--ls-fg-3)]">
            Showing{' '}
            <span className="tabular-nums text-[var(--ls-fg-2)]">{firstShown}</span>
            {'–'}
            <span className="tabular-nums text-[var(--ls-fg-2)]">{lastShown}</span>{' '}
            of{' '}
            <span className="tabular-nums text-[var(--ls-fg-2)]">
              {SAMPLE_RECORDS.length}
            </span>
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="inline-flex items-center gap-1 rounded-lg border border-[var(--ls-border-2)] bg-transparent px-3 py-1.5 text-xs font-medium text-[var(--ls-fg-2)] transition-colors hover:border-indigo-500/40 hover:text-[var(--ls-fg)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[var(--ls-border-2)] disabled:hover:text-[var(--ls-fg-2)]"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Prev
            </button>
            <span className="text-xs tabular-nums text-[var(--ls-fg-3)]">
              {page + 1} / {pageCount}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
              disabled={page >= pageCount - 1}
              className="inline-flex items-center gap-1 rounded-lg border border-[var(--ls-border-2)] bg-transparent px-3 py-1.5 text-xs font-medium text-[var(--ls-fg-2)] transition-colors hover:border-indigo-500/40 hover:text-[var(--ls-fg)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[var(--ls-border-2)] disabled:hover:text-[var(--ls-fg-2)]"
            >
              Next
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      <p className="text-xs leading-relaxed text-[var(--ls-fg-4)]">
        This is a fixed public sample of {SAMPLE_RECORDS.length} records. The full
        dataset covers all 67 Florida counties and is delivered via the
        New Venue Data API and scheduled exports.
      </p>
    </div>
  )
}
