import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { LicenseType, LicenseStatus, EventType } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateStr: string, opts?: Intl.DateTimeFormatOptions): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...opts,
  })
}

export function formatNumber(n: number): string {
  return n.toLocaleString('en-US')
}

export function getLicenseTypeLabel(type: LicenseType): string {
  const labels: Record<LicenseType, string> = {
    SRX: 'Spirituous Liquor',
    COP: 'Consumption On Premises',
    BEV: 'Beer & Wine',
    APS: 'Package Store',
    FOOD_SERVICE: 'Food Service',
    SEATING: 'Seating License',
    MOBILE_FOOD: 'Mobile Food',
  }
  return labels[type] ?? type
}

export function getLicenseTypeBadgeColor(type: LicenseType): string {
  const colors: Record<LicenseType, string> = {
    SRX: 'bg-violet-500/15 text-violet-400 border-violet-500/20',
    COP: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/20',
    BEV: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
    APS: 'bg-pink-500/15 text-pink-400 border-pink-500/20',
    FOOD_SERVICE: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    SEATING: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    MOBILE_FOOD: 'bg-orange-500/15 text-orange-400 border-orange-500/20',
  }
  return colors[type] ?? 'bg-zinc-500/15 text-zinc-400 border-zinc-500/20'
}

export function getStatusBadgeColor(status: LicenseStatus): string {
  const colors: Record<LicenseStatus, string> = {
    approved: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    pending: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    active: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    expired: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/20',
    suspended: 'bg-red-500/15 text-red-400 border-red-500/20',
    cancelled: 'bg-red-500/15 text-red-400 border-red-500/20',
  }
  return colors[status] ?? 'bg-zinc-500/15 text-zinc-400 border-zinc-500/20'
}

export function getEventTypeLabel(event: EventType): string {
  const labels: Record<EventType, string> = {
    new_filing: 'New Filing',
    status_change: 'Status Change',
    ownership_transfer: 'Ownership Transfer',
    address_change: 'Address Change',
    renewal: 'Renewal',
    cancellation: 'Cancellation',
  }
  return labels[event] ?? event
}

export function getEventBadgeColor(event: EventType): string {
  const colors: Record<EventType, string> = {
    new_filing: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/20',
    status_change: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
    ownership_transfer: 'bg-violet-500/15 text-violet-400 border-violet-500/20',
    address_change: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    renewal: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    cancellation: 'bg-red-500/15 text-red-400 border-red-500/20',
  }
  return colors[event] ?? 'bg-zinc-500/15 text-zinc-400 border-zinc-500/20'
}
