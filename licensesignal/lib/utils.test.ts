import { describe, it, expect } from 'vitest'
import {
  cn,
  formatDate,
  formatNumber,
  getLicenseTypeLabel,
  getStatusBadgeColor,
  getEventTypeLabel,
} from './utils'

describe('cn', () => {
  it('merges class names and dedupes conflicting tailwind utilities', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
    expect(cn('text-sm', false, undefined, 'font-bold')).toBe('text-sm font-bold')
  })
})

describe('formatDate', () => {
  it('formats an ISO date with the default options', () => {
    expect(formatDate('2024-12-03')).toMatch(/Dec\s+\d{1,2},\s+2024/)
  })
  it('respects custom options', () => {
    expect(formatDate('2024-12-03', { month: 'long', day: 'numeric', year: undefined })).toContain('December')
  })
})

describe('formatNumber', () => {
  it('adds thousands separators', () => {
    expect(formatNumber(1847)).toBe('1,847')
    expect(formatNumber(1000000)).toBe('1,000,000')
  })
})

describe('label helpers', () => {
  it('maps license types to human labels', () => {
    expect(getLicenseTypeLabel('SRX')).toBe('Spirituous Liquor')
    expect(getLicenseTypeLabel('FOOD_SERVICE')).toBe('Food Service')
  })
  it('maps event types to human labels', () => {
    expect(getEventTypeLabel('new_filing')).toBe('New Filing')
    expect(getEventTypeLabel('ownership_transfer')).toBe('Ownership Transfer')
  })
})

describe('badge color helpers', () => {
  it('returns a class string for known statuses', () => {
    expect(getStatusBadgeColor('active')).toContain('emerald')
    expect(getStatusBadgeColor('suspended')).toContain('red')
  })
})
