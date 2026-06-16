'use client'

import { useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import {
  ArrowUp,
  ArrowDown,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Search,
  Star,
} from 'lucide-react'
import { MOCK_LICENSES } from '@/lib/mock-data'
import type { LicenseRecord, LicenseType, LicenseStatus } from '@/lib/types'
import {
  getStatusBadgeColor,
  getEventBadgeColor,
  getEventTypeLabel,
  getLicenseTypeLabel,
  formatDate,
} from '@/lib/utils'
import { RecordDetailDrawer } from '@/components/dashboard/record-detail-drawer'
import { useLocalStorage } from '@/components/dashboard/use-local-storage'
import { SavedViews } from '@/components/dashboard/saved-views'
import { ColumnControls } from '@/components/dashboard/column-controls'
import { BulkActionBar } from '@/components/dashboard/bulk-action-bar'
import { NoteCell } from '@/components/dashboard/note-cell'
import { TagCell } from '@/components/dashboard/tag-cell'
import {
  DensityToggle,
  PinnedFilterToggle,
} from '@/components/dashboard/table-toolbar-controls'
import { TableSkeleton, EmptyState } from '@/components/dashboard/table-states'
import {
  ALL,
  COLUMN_MAP,
  DEFAULT_COLUMN_ORDER,
  DEFAULT_HIDDEN_COLUMNS,
  EMPTY_META,
  sortValue,
  type ColumnId,
  type Density,
  type FilterState,
  type RecordMeta,
  type RecordMetaMap,
  type SavedView,
  type SortDir,
  type SortKey,
} from '@/components/dashboard/dashboard-types'

const PAGE_SIZE = 10

// localStorage keys (namespaced to avoid collisions).
const LS_VIEWS = 'ls.dashboard.savedViews'
const LS_COLUMN_ORDER = 'ls.dashboard.columnOrder'
const LS_HIDDEN_COLS = 'ls.dashboard.hiddenColumns'
const LS_DENSITY = 'ls.dashboard.density'
const LS_META = 'ls.dashboard.recordMeta'

function ChartSkeleton({ height = 240 }: { height?: number }) {
  return (
    <div
      className="w-full animate-pulse rounded-lg bg-[var(--ls-hover)]"
      style={{ height }}
      aria-hidden="true"
    />
  )
}

// Recharts is heavy — load the analytics charts lazily on the client.
const LicenseTypeDonut = dynamic(
  () => import('@/components/charts/license-type-donut').then((m) => m.LicenseTypeDonut),
  { ssr: false, loading: () => <ChartSkeleton height={220} /> }
)
const VelocityTrend = dynamic(
  () => import('@/components/charts/velocity-trend').then((m) => m.VelocityTrend),
  { ssr: false, loading: () => <ChartSkeleton height={280} /> }
)
const CountyComparison = dynamic(
  () => import('@/components/charts/county-comparison').then((m) => m.CountyComparison),
  { ssr: false, loading: () => <ChartSkeleton height={300} /> }
)
const FloridaMap = dynamic(
  () => import('@/components/charts/florida-map').then((m) => m.FloridaMap),
  { ssr: false, loading: () => <ChartSkeleton height={320} /> }
)

// Derive distinct filter options from the dataset (stable, sorted).
const COUNTY_OPTIONS = Array.from(
  new Set(MOCK_LICENSES.map((r) => r.address.county))
).sort()
const TYPE_OPTIONS = Array.from(
  new Set(MOCK_LICENSES.map((r) => r.licenseType))
).sort() as LicenseType[]
const STATUS_OPTIONS = Array.from(
  new Set(MOCK_LICENSES.map((r) => r.status))
).sort() as LicenseStatus[]

function csvCell(val: string | null) {
  const s = val ?? ''
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

function toCsv(rows: LicenseRecord[], meta: RecordMetaMap): string {
  const headers = [
    'License Number',
    'License Type',
    'Status',
    'Business Name',
    'Legal Name',
    'DBA Name',
    'Street',
    'City',
    'County',
    'State',
    'ZIP',
    'Filed Date',
    'Effective Date',
    'Event',
    'Event Timestamp',
    'Source URL',
    'Pinned',
    'Tags',
    'Note',
  ]

  const lines = rows.map((r) => {
    const m = meta[r.id] ?? EMPTY_META
    return [
      r.licenseNumber,
      r.licenseType,
      r.status,
      r.businessName,
      r.legalName,
      r.dbaName,
      r.address.street,
      r.address.city,
      r.address.county,
      r.address.state,
      r.address.zip,
      r.filedDate,
      r.effectiveDate,
      getEventTypeLabel(r.eventType),
      r.eventTimestamp,
      r.sourceUrl,
      m.pinned ? 'yes' : '',
      m.tags.join('; '),
      m.note,
    ]
      .map(csvCell)
      .join(',')
  })

  return [headers.join(','), ...lines].join('\n')
}

function downloadCsv(csv: string, suffix: string) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `licensesignal-${suffix}-${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

const SELECT_CLASS =
  'appearance-none rounded-md border border-[var(--ls-border-2)] bg-[var(--ls-surface-2)] px-3 py-2 text-sm text-[var(--ls-fg)] outline-none transition-colors hover:border-[var(--ls-fg-4)] focus:border-indigo-500/60'

function ChartCard({
  title,
  subtitle,
  children,
  className,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-4 ${className ?? ''}`}>
      <div className="mb-4 flex items-center justify-between gap-2">
        <h3 className="text-sm font-medium text-[var(--ls-fg)]">{title}</h3>
        {subtitle && <span className="text-xs text-[var(--ls-fg-3)]">{subtitle}</span>}
      </div>
      {children}
    </div>
  )
}

export function DashboardContent() {
  // --- Filters ---
  const [county, setCounty] = useState<string>(ALL)
  const [licenseType, setLicenseType] = useState<string>(ALL)
  const [status, setStatus] = useState<string>(ALL)
  const [query, setQuery] = useState('')
  const [pinnedOnly, setPinnedOnly] = useState(false)

  const [sortKey, setSortKey] = useState<SortKey>('filed')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [page, setPage] = useState(0)

  const [selected, setSelected] = useState<LicenseRecord | null>(null)

  // --- Bulk selection (ephemeral, not persisted) ---
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  // --- Persisted preferences ---
  const [savedViews, setSavedViews] = useLocalStorage<SavedView[]>(LS_VIEWS, [])
  const [columnOrder, setColumnOrder] = useLocalStorage<ColumnId[]>(
    LS_COLUMN_ORDER,
    DEFAULT_COLUMN_ORDER
  )
  const [hiddenColumns, setHiddenColumns] = useLocalStorage<ColumnId[]>(
    LS_HIDDEN_COLS,
    DEFAULT_HIDDEN_COLUMNS
  )
  const [density, setDensity] = useLocalStorage<Density>(LS_DENSITY, 'comfortable')
  const [meta, setMeta] = useLocalStorage<RecordMetaMap>(LS_META, {})

  // --- Initial loading skeleton (simulate first query resolving) ---
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 550)
    return () => clearTimeout(t)
  }, [])

  function getMeta(id: string): RecordMeta {
    return meta[id] ?? EMPTY_META
  }

  const pinnedCount = useMemo(
    () => Object.values(meta).filter((m) => m?.pinned).length,
    [meta]
  )

  const knownTags = useMemo(() => {
    const set = new Set<string>()
    for (const m of Object.values(meta)) {
      m?.tags?.forEach((t) => set.add(t))
    }
    return Array.from(set).sort()
  }, [meta])

  // --- Filtering + sorting ---
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const result = MOCK_LICENSES.filter((r) => {
      if (county !== ALL && r.address.county !== county) return false
      if (licenseType !== ALL && r.licenseType !== licenseType) return false
      if (status !== ALL && r.status !== status) return false
      if (pinnedOnly && !(meta[r.id]?.pinned)) return false
      if (q) {
        const m = meta[r.id]
        const tagText = m?.tags?.join(' ') ?? ''
        const noteText = m?.note ?? ''
        const haystack =
          `${r.businessName} ${r.address.city} ${r.address.county} ${tagText} ${noteText}`.toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })

    result.sort((a, b) => {
      const av = sortValue(a, sortKey)
      const bv = sortValue(b, sortKey)
      const cmp = av < bv ? -1 : av > bv ? 1 : 0
      return sortDir === 'asc' ? cmp : -cmp
    })

    return result
  }, [county, licenseType, status, query, pinnedOnly, sortKey, sortDir, meta])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages - 1)
  const rows = filtered.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE)

  const hasFilters =
    county !== ALL ||
    licenseType !== ALL ||
    status !== ALL ||
    query.trim() !== '' ||
    pinnedOnly

  // Visible, ordered columns.
  const visibleColumns = useMemo(() => {
    const hidden = new Set(hiddenColumns)
    return columnOrder.filter((id) => COLUMN_MAP[id] && !hidden.has(id))
  }, [columnOrder, hiddenColumns])
  const colCount = visibleColumns.length + 1 // + selection checkbox column

  // --- Selection helpers (scoped to current page) ---
  const pageIds = rows.map((r) => r.id)
  const allPageSelected = pageIds.length > 0 && pageIds.every((id) => selectedIds.has(id))
  const somePageSelected = pageIds.some((id) => selectedIds.has(id))

  function toggleRow(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleSelectAllPage() {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (allPageSelected) {
        pageIds.forEach((id) => next.delete(id))
      } else {
        pageIds.forEach((id) => next.add(id))
      }
      return next
    })
  }

  function clearSelection() {
    setSelectedIds(new Set())
  }

  // --- Sorting ---
  function handleSort(key: SortKey) {
    setPage(0)
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir(key === 'filed' ? 'desc' : 'asc')
    }
  }

  function resetFilters() {
    setCounty(ALL)
    setLicenseType(ALL)
    setStatus(ALL)
    setQuery('')
    setPinnedOnly(false)
    setPage(0)
  }

  // --- Saved views ---
  const currentFilterState: FilterState = {
    county,
    licenseType,
    status,
    query,
    pinnedOnly,
  }

  function saveView(name: string) {
    const view: SavedView = {
      id: `view_${Date.now().toString(36)}`,
      name,
      ...currentFilterState,
    }
    setSavedViews((prev) => [...prev, view])
  }

  function applyView(view: SavedView) {
    setCounty(view.county)
    setLicenseType(view.licenseType)
    setStatus(view.status)
    setQuery(view.query)
    setPinnedOnly(view.pinnedOnly)
    setPage(0)
  }

  function deleteView(id: string) {
    setSavedViews((prev) => prev.filter((v) => v.id !== id))
  }

  // --- Column controls ---
  function toggleColumn(id: ColumnId) {
    if (COLUMN_MAP[id]?.locked) return
    setHiddenColumns((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    )
  }

  function moveColumn(id: ColumnId, dir: -1 | 1) {
    setColumnOrder((prev) => {
      const idx = prev.indexOf(id)
      const target = idx + dir
      if (idx < 0 || target < 0 || target >= prev.length) return prev
      const next = [...prev]
      ;[next[idx], next[target]] = [next[target], next[idx]]
      return next
    })
  }

  function resetColumns() {
    setColumnOrder(DEFAULT_COLUMN_ORDER)
    setHiddenColumns(DEFAULT_HIDDEN_COLUMNS)
  }

  // --- Per-record meta mutations ---
  function updateMeta(id: string, patch: Partial<RecordMeta>) {
    setMeta((prev) => {
      const existing = prev[id] ?? EMPTY_META
      return { ...prev, [id]: { ...existing, ...patch } }
    })
  }

  function togglePin(id: string) {
    updateMeta(id, { pinned: !getMeta(id).pinned })
  }

  function setNote(id: string, note: string) {
    updateMeta(id, { note })
  }

  function removeTag(id: string, tag: string) {
    updateMeta(id, { tags: getMeta(id).tags.filter((t) => t !== tag) })
  }

  // --- Bulk actions ---
  function bulkExport() {
    const chosen = MOCK_LICENSES.filter((r) => selectedIds.has(r.id))
    if (chosen.length === 0) return
    downloadCsv(toCsv(chosen, meta), 'selection')
  }

  function bulkTag(tag: string) {
    setMeta((prev) => {
      const next = { ...prev }
      selectedIds.forEach((id) => {
        const existing = next[id] ?? EMPTY_META
        if (!existing.tags.includes(tag)) {
          next[id] = { ...existing, tags: [...existing.tags, tag] }
        }
      })
      return next
    })
  }

  function bulkPin() {
    setMeta((prev) => {
      const next = { ...prev }
      selectedIds.forEach((id) => {
        const existing = next[id] ?? EMPTY_META
        next[id] = { ...existing, pinned: true }
      })
      return next
    })
  }

  function exportFiltered() {
    if (filtered.length === 0) return
    downloadCsv(toCsv(filtered, meta), 'export')
  }

  function SortIcon({ column }: { column: SortKey }) {
    if (column !== sortKey) {
      return <ChevronsUpDown className="h-3 w-3 text-[var(--ls-fg-4)]" />
    }
    return sortDir === 'asc' ? (
      <ArrowUp className="h-3 w-3 text-indigo-400" />
    ) : (
      <ArrowDown className="h-3 w-3 text-indigo-400" />
    )
  }

  // Density-derived classes.
  const cellPad = density === 'compact' ? 'px-3 py-1.5' : 'px-4 py-3'
  const headPad = density === 'compact' ? 'px-3 py-2' : 'px-4 py-2.5'

  function renderHeaderCell(id: ColumnId) {
    const col = COLUMN_MAP[id]
    const base = `${headPad} text-left text-xs font-medium uppercase tracking-widest text-[var(--ls-fg-3)]`
    if (col.sortKey) {
      const key = col.sortKey
      return (
        <th key={id} className={`${headPad} text-left`} scope="col">
          <button
            type="button"
            onClick={() => handleSort(key)}
            className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-[var(--ls-fg-3)] transition-colors hover:text-[var(--ls-fg-2)]"
          >
            {col.label}
            <SortIcon column={key} />
          </button>
        </th>
      )
    }
    return (
      <th key={id} className={base} scope="col">
        {col.label}
      </th>
    )
  }

  function renderBodyCell(id: ColumnId, record: LicenseRecord, rowIndex: number) {
    const m = getMeta(record.id)
    switch (id) {
      case 'index':
        return (
          <td key={id} className={`${cellPad} text-xs text-[var(--ls-fg-3)] tabular-nums`}>
            {currentPage * PAGE_SIZE + rowIndex + 1}
          </td>
        )
      case 'business':
        return (
          <td key={id} className={cellPad}>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label={m.pinned ? 'Unpin record' : 'Pin record'}
                aria-pressed={m.pinned}
                onClick={(e) => {
                  e.stopPropagation()
                  togglePin(record.id)
                }}
                className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded transition-colors ${
                  m.pinned
                    ? 'text-amber-400'
                    : 'text-[var(--ls-fg-4)] hover:text-amber-400'
                }`}
              >
                <Star className={`h-3.5 w-3.5 ${m.pinned ? 'fill-amber-400' : ''}`} />
              </button>
              <span className="min-w-0">
                <span className="block max-w-[200px] truncate font-medium text-[var(--ls-fg)]">
                  {record.businessName}
                </span>
                {density === 'comfortable' && (
                  <span className="text-xs text-[var(--ls-fg-3)]">{record.address.city}</span>
                )}
              </span>
            </div>
          </td>
        )
      case 'type':
        return (
          <td key={id} className={cellPad}>
            <span className="inline-flex items-center rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-xs font-medium text-indigo-400">
              {record.licenseType}
            </span>
          </td>
        )
      case 'county':
        return (
          <td key={id} className={`${cellPad} whitespace-nowrap text-[var(--ls-fg-2)]`}>
            {record.address.county}
          </td>
        )
      case 'filed':
        return (
          <td key={id} className={`${cellPad} whitespace-nowrap text-xs text-[var(--ls-fg-2)]`}>
            {formatDate(record.filedDate, { month: 'short', day: 'numeric' })}
          </td>
        )
      case 'status':
        return (
          <td key={id} className={cellPad}>
            <span
              className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${getStatusBadgeColor(
                record.status
              )}`}
            >
              {record.status}
            </span>
          </td>
        )
      case 'event':
        return (
          <td key={id} className={cellPad}>
            <span
              className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${getEventBadgeColor(
                record.eventType
              )}`}
            >
              {getEventTypeLabel(record.eventType)}
            </span>
          </td>
        )
      case 'tags':
        return (
          <td key={id} className={cellPad}>
            <TagCell tags={m.tags} onRemove={(tag) => removeTag(record.id, tag)} />
          </td>
        )
      case 'notes':
        return (
          <td key={id} className={cellPad}>
            <NoteCell
              note={m.note}
              businessName={record.businessName}
              onChange={(note) => setNote(record.id, note)}
            />
          </td>
        )
    }
  }

  return (
    <>
      {/* Filter bar */}
      <div className="mb-6 rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative min-w-[220px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ls-fg-3)]" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setPage(0)
              }}
              placeholder="Search business, city, county, tag, or note…"
              className="w-full rounded-md border border-[var(--ls-border-2)] bg-[var(--ls-surface-2)] py-2 pl-9 pr-3 text-sm text-[var(--ls-fg)] outline-none transition-colors placeholder:text-[var(--ls-fg-3)] hover:border-[var(--ls-fg-4)] focus:border-indigo-500/60"
            />
          </div>

          {/* County */}
          <select
            aria-label="Filter by county"
            value={county}
            onChange={(e) => {
              setCounty(e.target.value)
              setPage(0)
            }}
            className={SELECT_CLASS}
          >
            <option value={ALL}>All counties</option>
            {COUNTY_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* License type */}
          <select
            aria-label="Filter by license type"
            value={licenseType}
            onChange={(e) => {
              setLicenseType(e.target.value)
              setPage(0)
            }}
            className={SELECT_CLASS}
          >
            <option value={ALL}>All types</option>
            {TYPE_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {getLicenseTypeLabel(t)}
              </option>
            ))}
          </select>

          {/* Status */}
          <select
            aria-label="Filter by status"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value)
              setPage(0)
            }}
            className={SELECT_CLASS}
          >
            <option value={ALL}>All statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s} className="capitalize">
                {s}
              </option>
            ))}
          </select>

          {/* Pinned-only filter */}
          <PinnedFilterToggle
            active={pinnedOnly}
            count={pinnedCount}
            onToggle={() => {
              setPinnedOnly((p) => !p)
              setPage(0)
            }}
          />

          {/* Reset */}
          {hasFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-sm font-medium text-[var(--ls-fg-2)] underline-offset-4 transition-colors hover:text-[var(--ls-fg)] hover:underline"
            >
              Reset
            </button>
          )}
        </div>

        {/* Secondary controls row: saved views, columns, density, export */}
        <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-[var(--ls-border)] pt-3">
          <SavedViews
            views={savedViews}
            current={currentFilterState}
            hasFilters={hasFilters}
            onSave={saveView}
            onApply={applyView}
            onDelete={deleteView}
          />
          <ColumnControls
            order={columnOrder}
            hidden={hiddenColumns}
            onToggle={toggleColumn}
            onMove={moveColumn}
            onReset={resetColumns}
          />
          <DensityToggle density={density} onChange={setDensity} />

          <button
            type="button"
            onClick={exportFiltered}
            disabled={filtered.length === 0}
            className="ml-auto inline-flex items-center justify-center gap-1.5 rounded-md border border-[var(--ls-border-2)] px-3 py-2 text-sm font-medium text-[var(--ls-fg-2)] transition-colors hover:border-indigo-500/40 hover:text-[var(--ls-fg)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* License table */}
      <div className="mb-6 flex flex-col overflow-hidden rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)]">
        <div className="flex items-center justify-between border-b border-[var(--ls-border)] px-4 py-3">
          <h3 className="text-sm font-medium text-[var(--ls-fg)]">License Feed</h3>
          <span className="text-xs tabular-nums text-[var(--ls-fg-3)]">
            {loading
              ? 'Loading…'
              : `${filtered.length} ${filtered.length === 1 ? 'record' : 'records'}`}
          </span>
        </div>

        {/* Bulk action bar */}
        <BulkActionBar
          count={selectedIds.size}
          knownTags={knownTags}
          onExport={bulkExport}
          onTag={bulkTag}
          onPin={bulkPin}
          onClear={clearSelection}
        />

        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-sm">
            <thead>
              <tr className="border-b border-[var(--ls-border)]">
                {/* Select-all checkbox */}
                <th className={`${headPad} w-10 text-left`} scope="col">
                  <input
                    type="checkbox"
                    aria-label="Select all rows on this page"
                    checked={allPageSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = !allPageSelected && somePageSelected
                    }}
                    onChange={toggleSelectAllPage}
                    disabled={loading || rows.length === 0}
                    className="h-4 w-4 cursor-pointer rounded border-[var(--ls-border-2)] bg-[var(--ls-surface-2)] accent-indigo-500"
                  />
                </th>
                {visibleColumns.map((id) => renderHeaderCell(id))}
              </tr>
            </thead>

            {loading ? (
              <TableSkeleton
                rows={PAGE_SIZE}
                columns={colCount}
                rowHeight={density === 'compact' ? 'py-2.5' : 'py-3.5'}
              />
            ) : rows.length === 0 ? (
              <EmptyState
                hasFilters={hasFilters}
                pinnedOnly={pinnedOnly}
                onReset={resetFilters}
                colSpan={colCount}
              />
            ) : (
              <tbody>
                {rows.map((record, i) => {
                  const isSelected = selectedIds.has(record.id)
                  return (
                    <tr
                      key={record.id}
                      onClick={() => setSelected(record)}
                      className={`cursor-pointer border-b border-[var(--ls-border)] transition-colors last:border-0 hover:bg-[var(--ls-hover)] ${
                        isSelected ? 'bg-indigo-500/[0.06]' : ''
                      }`}
                    >
                      <td
                        className={`${cellPad} w-10`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          aria-label={`Select ${record.businessName}`}
                          checked={isSelected}
                          onChange={() => toggleRow(record.id)}
                          className="h-4 w-4 cursor-pointer rounded border-[var(--ls-border-2)] bg-[var(--ls-surface-2)] accent-indigo-500"
                        />
                      </td>
                      {visibleColumns.map((id) => renderBodyCell(id, record, i))}
                    </tr>
                  )
                })}
              </tbody>
            )}
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-[var(--ls-border)] px-4 py-3">
          <span className="text-xs tabular-nums text-[var(--ls-fg-3)]">
            {filtered.length === 0
              ? '0 of 0'
              : `${currentPage * PAGE_SIZE + 1}–${Math.min(
                  (currentPage + 1) * PAGE_SIZE,
                  filtered.length
                )} of ${filtered.length}`}
            {selectedIds.size > 0 && (
              <span className="ml-2 text-indigo-400">· {selectedIds.size} selected</span>
            )}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Previous page"
              disabled={currentPage === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--ls-fg-3)] transition-colors hover:bg-[var(--ls-hover)] hover:text-[var(--ls-fg)] disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-2 text-xs tabular-nums text-[var(--ls-fg-3)]">
              {currentPage + 1} / {totalPages}
            </span>
            <button
              type="button"
              aria-label="Next page"
              disabled={currentPage >= totalPages - 1}
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--ls-fg-3)] transition-colors hover:bg-[var(--ls-hover)] hover:text-[var(--ls-fg)] disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="License Type Mix" subtitle="All records">
          <LicenseTypeDonut />
        </ChartCard>

        <ChartCard title="Filing Velocity" subtitle="Daily totals">
          <VelocityTrend />
        </ChartCard>

        <ChartCard title="County Comparison" subtitle="Pick up to 3">
          <CountyComparison />
        </ChartCard>

        <ChartCard title="Filing Density Map" subtitle="By county">
          <FloridaMap />
        </ChartCard>
      </div>

      {/* Detail drawer */}
      <RecordDetailDrawer record={selected} onClose={() => setSelected(null)} />
    </>
  )
}
