'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { AlertCircle, CheckCircle2, Download, FileSpreadsheet, X } from 'lucide-react'
import { MOCK_LICENSES } from '@/lib/mock-data'
import type { LicenseRecord } from '@/lib/types'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const SAMPLE_SIZE = 25

interface SampleDownloadModalProps {
  open: boolean
  onClose: () => void
}

/** Columns included in the generated sample, in order. */
const CSV_COLUMNS: { header: string; value: (r: LicenseRecord) => string }[] = [
  { header: 'license_number', value: (r) => r.licenseNumber },
  { header: 'license_type', value: (r) => r.licenseType },
  { header: 'status', value: (r) => r.status },
  { header: 'business_name', value: (r) => r.businessName },
  { header: 'legal_name', value: (r) => r.legalName },
  { header: 'dba_name', value: (r) => r.dbaName ?? '' },
  { header: 'street', value: (r) => r.address.street },
  { header: 'city', value: (r) => r.address.city },
  { header: 'county', value: (r) => r.address.county },
  { header: 'state', value: (r) => r.address.state },
  { header: 'zip', value: (r) => r.address.zip },
  { header: 'filed_date', value: (r) => r.filedDate },
  { header: 'effective_date', value: (r) => r.effectiveDate ?? '' },
  { header: 'event_type', value: (r) => r.eventType },
  { header: 'event_timestamp', value: (r) => r.eventTimestamp },
  { header: 'source_url', value: (r) => r.sourceUrl },
]

/** RFC-4180-ish escaping: wrap in quotes and double any embedded quotes. */
function escapeCsv(value: string): string {
  if (/[",\r\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

function buildCsv(records: LicenseRecord[]): string {
  const header = CSV_COLUMNS.map((c) => c.header).join(',')
  const rows = records.map((r) =>
    CSV_COLUMNS.map((c) => escapeCsv(c.value(r))).join(',')
  )
  return [header, ...rows].join('\r\n')
}

function downloadCsv(filename: string, csv: string) {
  // Prepend a BOM so Excel reads UTF-8 correctly.
  const blob = new Blob(['﻿', csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  // Defer revocation so the download has a chance to start.
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

/**
 * SampleDownloadModal
 *
 * Email-gated download of a 25-row sample CSV. The modal is controlled by the
 * parent via `open` / `onClose`. On submit it validates the email, then
 * generates the CSV from the first 25 records entirely client-side and triggers
 * a browser download. Dismissible via the close button, backdrop, or Escape.
 */
export function SampleDownloadModal({ open, onClose }: SampleDownloadModalProps) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [downloaded, setDownloaded] = useState(false)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  // Reset transient state whenever the modal is (re)opened.
  useEffect(() => {
    if (open) {
      setError(null)
      setDownloaded(false)
    }
  }, [open])

  // Lock scroll, focus the close control, and wire Escape while open.
  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    const raf = window.requestAnimationFrame(() => closeButtonRef.current?.focus())

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
      window.cancelAnimationFrame(raf)
    }
  }, [open, onClose])

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      const value = email.trim()
      if (!value) {
        setError('Please enter your email address.')
        return
      }
      if (!EMAIL_RE.test(value)) {
        setError('Please enter a valid email address.')
        return
      }
      setError(null)

      const sample = MOCK_LICENSES.slice(0, SAMPLE_SIZE)
      const csv = buildCsv(sample)
      downloadCsv('licensesignal-sample.csv', csv)
      setDownloaded(true)
    },
    [email]
  )

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sample-download-title"
    >
      <button
        type="button"
        aria-label="Close dialog"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-[color-mix(in_srgb,var(--ls-bg)_80%,transparent)] backdrop-blur-sm"
      />

      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-[var(--ls-border-2)] bg-[var(--ls-surface)] shadow-2xl shadow-black/50">
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 rounded-md p-1.5 text-[var(--ls-fg-3)] transition-colors hover:bg-[var(--ls-hover)] hover:text-[var(--ls-fg)] focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>

        {downloaded ? (
          <div className="flex flex-col items-center gap-3 p-8 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10">
              <CheckCircle2 className="h-6 w-6 text-emerald-400" aria-hidden="true" />
            </span>
            <h2
              id="sample-download-title"
              className="text-lg font-semibold text-[var(--ls-fg)]"
            >
              Your sample is downloading
            </h2>
            <p className="text-sm text-[var(--ls-fg-2)]">
              {SAMPLE_SIZE} real Florida filings, ready to open in Excel or your data tool. If
              the download didn&apos;t start, check your browser&apos;s permissions.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-2 inline-flex items-center justify-center rounded-md bg-indigo-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-600"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="p-8">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-1 text-xs font-medium text-indigo-400">
              <FileSpreadsheet className="h-3 w-3" aria-hidden="true" />
              Sample CSV · {SAMPLE_SIZE} rows
            </span>
            <h2
              id="sample-download-title"
              className="mt-4 text-xl font-semibold text-[var(--ls-fg)]"
            >
              Download a 25-row sample
            </h2>
            <p className="mt-2 text-sm text-[var(--ls-fg-2)]">
              Get a real slice of the dataset — business names, addresses, license types, and
              filing events. Enter your email and we&apos;ll start the download instantly.
            </p>

            <form onSubmit={handleSubmit} noValidate className="mt-5 flex flex-col gap-2">
              <label htmlFor="sample-download-email" className="sr-only">
                Email address
              </label>
              <input
                id="sample-download-email"
                type="email"
                placeholder="you@company.com"
                value={email}
                aria-invalid={!!error}
                aria-describedby={error ? 'sample-download-email-error' : undefined}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (error) setError(null)
                }}
                className={`h-11 w-full rounded-md border bg-[var(--ls-surface-2)] px-3.5 text-sm text-[var(--ls-fg)] placeholder:text-[var(--ls-fg-4)] transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                  error
                    ? 'border-red-500/50'
                    : 'border-[var(--ls-border-2)] focus:border-indigo-500/50'
                }`}
              />
              {error && (
                <span
                  id="sample-download-email-error"
                  className="flex items-center gap-1 text-xs text-red-400"
                >
                  <AlertCircle className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
                  {error}
                </span>
              )}
              <button
                type="submit"
                className="mt-1 inline-flex h-11 items-center justify-center gap-1.5 rounded-md bg-indigo-500 px-5 text-sm font-medium text-white transition-colors hover:bg-indigo-600"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                Download sample CSV
              </button>
            </form>
            <p className="mt-3 text-xs text-[var(--ls-fg-3)]">
              We&apos;ll occasionally email you product updates. Unsubscribe anytime.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
