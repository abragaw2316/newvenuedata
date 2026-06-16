import type { LicenseRecord } from '@/lib/types'

export const ALL = '__all__'

export type SortKey = 'business' | 'county' | 'type' | 'filed' | 'status'
export type SortDir = 'asc' | 'desc'
export type Density = 'comfortable' | 'compact'

/** The persisted shape of a filter set (for Saved Views). */
export interface FilterState {
  county: string
  licenseType: string
  status: string
  query: string
  pinnedOnly: boolean
}

export interface SavedView extends FilterState {
  id: string
  name: string
}

/** Identifiers for every toggle-able / re-orderable table column. */
export type ColumnId =
  | 'index'
  | 'business'
  | 'type'
  | 'county'
  | 'filed'
  | 'status'
  | 'event'
  | 'tags'
  | 'notes'

export interface ColumnDef {
  id: ColumnId
  label: string
  /** Whether this column participates in header sorting, and on which key. */
  sortKey?: SortKey
  /** Columns the user is not allowed to hide. */
  locked?: boolean
}

/** Master column registry — the default order. */
export const COLUMNS: ColumnDef[] = [
  { id: 'index', label: '#', locked: true },
  { id: 'business', label: 'Business', sortKey: 'business', locked: true },
  { id: 'type', label: 'Type', sortKey: 'type' },
  { id: 'county', label: 'County', sortKey: 'county' },
  { id: 'filed', label: 'Filed', sortKey: 'filed' },
  { id: 'status', label: 'Status', sortKey: 'status' },
  { id: 'event', label: 'Event' },
  { id: 'tags', label: 'Tags' },
  { id: 'notes', label: 'Notes' },
]

export const DEFAULT_COLUMN_ORDER: ColumnId[] = COLUMNS.map((c) => c.id)
export const DEFAULT_HIDDEN_COLUMNS: ColumnId[] = ['tags', 'notes']

export const COLUMN_MAP: Record<ColumnId, ColumnDef> = COLUMNS.reduce(
  (acc, col) => {
    acc[col.id] = col
    return acc
  },
  {} as Record<ColumnId, ColumnDef>
)

/** Per-record local annotations (pins, notes, tags). */
export interface RecordMeta {
  pinned: boolean
  note: string
  tags: string[]
}

export type RecordMetaMap = Record<string, RecordMeta>

export const EMPTY_META: RecordMeta = { pinned: false, note: '', tags: [] }

export function sortValue(record: LicenseRecord, key: SortKey): string {
  switch (key) {
    case 'business':
      return record.businessName.toLowerCase()
    case 'county':
      return record.address.county.toLowerCase()
    case 'type':
      return record.licenseType
    case 'filed':
      return record.filedDate
    case 'status':
      return record.status
  }
}

/** A short palette of tag accent classes, chosen deterministically per tag. */
const TAG_COLORS = [
  'bg-indigo-500/15 text-indigo-400 border-indigo-500/25',
  'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  'bg-amber-500/15 text-amber-400 border-amber-500/25',
  'bg-violet-500/15 text-violet-400 border-violet-500/25',
  'bg-blue-500/15 text-blue-400 border-blue-500/25',
]

export function tagColor(tag: string): string {
  let hash = 0
  for (let i = 0; i < tag.length; i++) {
    hash = (hash * 31 + tag.charCodeAt(i)) | 0
  }
  return TAG_COLORS[Math.abs(hash) % TAG_COLORS.length]
}
