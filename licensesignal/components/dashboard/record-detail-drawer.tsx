'use client'

import { useEffect } from 'react'
import { X, ExternalLink } from 'lucide-react'
import type { LicenseRecord } from '@/lib/types'
import {
  getLicenseTypeLabel,
  getStatusBadgeColor,
  getEventBadgeColor,
  getEventTypeLabel,
  getLicenseTypeBadgeColor,
  formatDate,
} from '@/lib/utils'

interface RecordDetailDrawerProps {
  record: LicenseRecord | null
  onClose: () => void
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 border-b border-[var(--ls-border)] py-3 last:border-0">
      <dt className="text-[11px] font-medium uppercase tracking-widest text-[var(--ls-fg-3)]">
        {label}
      </dt>
      <dd className="text-sm text-[var(--ls-fg)]">{value}</dd>
    </div>
  )
}

export function RecordDetailDrawer({ record, onClose }: RecordDetailDrawerProps) {
  const open = record !== null

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!record) return null

  const { address } = record

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="License record detail">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close detail panel"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-black/60 backdrop-blur-sm"
      />

      {/* Panel */}
      <div className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-[var(--ls-border)] bg-[var(--ls-surface-2)] shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[var(--ls-border)] px-5 py-4">
          <div className="flex flex-col gap-2">
            <h2 className="text-base font-semibold leading-tight text-[var(--ls-fg)]">
              {record.businessName}
            </h2>
            <div className="flex flex-wrap items-center gap-1.5">
              <span
                className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${getLicenseTypeBadgeColor(
                  record.licenseType
                )}`}
              >
                {getLicenseTypeLabel(record.licenseType)}
              </span>
              <span
                className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium capitalize ${getStatusBadgeColor(
                  record.status
                )}`}
              >
                {record.status}
              </span>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md border border-[var(--ls-border)] text-[var(--ls-fg-3)] transition-colors hover:border-[var(--ls-border-2)] hover:bg-[var(--ls-hover)] hover:text-[var(--ls-fg)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-2">
          <dl>
            <DetailRow label="License Number" value={<span className="font-mono">{record.licenseNumber}</span>} />
            <DetailRow label="Legal Name" value={record.legalName} />
            <DetailRow label="DBA Name" value={record.dbaName ?? <span className="text-[var(--ls-fg-3)]">—</span>} />
            <DetailRow
              label="Event"
              value={
                <span
                  className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${getEventBadgeColor(
                    record.eventType
                  )}`}
                >
                  {getEventTypeLabel(record.eventType)}
                </span>
              }
            />

            {/* Address */}
            <div className="border-b border-[var(--ls-border)] py-3">
              <dt className="mb-2 text-[11px] font-medium uppercase tracking-widest text-[var(--ls-fg-3)]">
                Address
              </dt>
              <dd className="flex flex-col gap-2 text-sm text-[var(--ls-fg)]">
                <span>{address.street}</span>
                <div className="grid grid-cols-2 gap-2">
                  <span>
                    <span className="text-[var(--ls-fg-3)]">City: </span>
                    {address.city}
                  </span>
                  <span>
                    <span className="text-[var(--ls-fg-3)]">County: </span>
                    {address.county}
                  </span>
                  <span>
                    <span className="text-[var(--ls-fg-3)]">State: </span>
                    {address.state}
                  </span>
                  <span>
                    <span className="text-[var(--ls-fg-3)]">ZIP: </span>
                    {address.zip}
                  </span>
                  <span>
                    <span className="text-[var(--ls-fg-3)]">Lat: </span>
                    {address.lat ?? '—'}
                  </span>
                  <span>
                    <span className="text-[var(--ls-fg-3)]">Lng: </span>
                    {address.lng ?? '—'}
                  </span>
                </div>
              </dd>
            </div>

            <DetailRow label="Filed Date" value={formatDate(record.filedDate)} />
            <DetailRow
              label="Effective Date"
              value={record.effectiveDate ? formatDate(record.effectiveDate) : <span className="text-[var(--ls-fg-3)]">—</span>}
            />
            <DetailRow
              label="Issued Date"
              value={record.issuedDate ? formatDate(record.issuedDate) : <span className="text-[var(--ls-fg-3)]">—</span>}
            />
            <DetailRow
              label="Expiration Date"
              value={record.expirationDate ? formatDate(record.expirationDate) : <span className="text-[var(--ls-fg-3)]">—</span>}
            />
            <DetailRow
              label="Event Timestamp"
              value={formatDate(record.eventTimestamp, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            />
          </dl>
        </div>

        {/* Footer */}
        <div className="border-t border-[var(--ls-border)] px-5 py-4">
          <a
            href={record.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-[var(--ls-border-2)] px-4 py-2.5 text-sm font-medium text-[var(--ls-fg-2)] transition-colors hover:border-indigo-500/40 hover:text-[var(--ls-fg)]"
          >
            View source
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  )
}
