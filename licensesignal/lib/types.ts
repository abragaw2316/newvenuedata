export type LicenseType =
  | 'SRX'           // Spirituous liquor
  | 'COP'           // Consumption on premises
  | 'BEV'           // Beer & wine
  | 'APS'           // Adult entertainment / lounge
  | 'FOOD_SERVICE'  // Food service establishment
  | 'SEATING'       // Seating license
  | 'MOBILE_FOOD'   // Mobile food dispensing vehicle

export type LicenseStatus =
  | 'approved'
  | 'pending'
  | 'active'
  | 'expired'
  | 'suspended'
  | 'cancelled'

export type EventType =
  | 'new_filing'
  | 'status_change'
  | 'ownership_transfer'
  | 'address_change'
  | 'renewal'
  | 'cancellation'

export interface LicenseAddress {
  street: string
  city: string
  county: string
  state: 'FL' | 'TX'
  zip: string
  lat: number | null
  lng: number | null
}

export interface LicenseEnrichment {
  phone: string | null
  website: string | null
  naicsCode: string | null
  naicsDescription: string | null
  employeeCount: string | null
  yearsInBusiness: number | null
}

export interface LicenseRecord {
  id: string
  licenseNumber: string
  // FL DBPR codes (the LicenseType union). Note: multi-state records served via the
  // API (e.g. Texas TABC: MB, BG, BQ…) carry their native jurisdiction code here at
  // runtime; the FL-typed UI components only ever render Florida records.
  licenseType: LicenseType
  status: LicenseStatus
  businessName: string
  legalName: string
  dbaName: string | null
  address: LicenseAddress
  filedDate: string
  effectiveDate: string | null
  expirationDate: string | null
  issuedDate: string | null
  eventType: EventType
  eventTimestamp: string
  sourceUrl: string
  enrichment?: LicenseEnrichment
}

export interface PaginationMeta {
  cursor: string | null
  hasMore: boolean
  total: number
  limit: number
}

export interface ApiListResponse<T> {
  data: T[]
  pagination: PaginationMeta
  requestId: string
  timestamp: string
}

export interface WebhookPayload {
  id: string
  event: EventType
  timestamp: string
  data: LicenseRecord
  webhookId: string
  attempt: number
  signature: string
}

export interface WebhookRegistration {
  id: string
  url: string
  events: EventType[]
  counties: string[]
  licenseTypes: LicenseType[]
  active: boolean
  secret: string
  createdAt: string
  lastDeliveredAt: string | null
  failureCount: number
}

export interface WebhookEvent {
  id: string
  webhookId: string
  payload: WebhookPayload
  status: 'delivered' | 'pending' | 'failed'
  statusCode: number | null
  attemptCount: number
  nextRetryAt: string | null
  createdAt: string
}

export interface StatCardData {
  label: string
  value: number
  change: number
  sparklineData: number[]
  prefix?: string
  suffix?: string
}

export interface CountyVolume {
  county: string
  count: number
  lat: number
  lng: number
}

export interface DailyVolume {
  date: string
  liquor: number
  food: number
  total: number
}

export interface PricingFeature {
  name: string
  starter: string | boolean
  pro: string | boolean
  enterprise: string | boolean
}

export interface PricingPlan {
  id: 'starter' | 'pro' | 'enterprise'
  name: string
  price: number | null
  annualPrice: number | null
  description: string
  features: string[]
  cta: string
  highlighted: boolean
}

export interface DocsNavItem {
  title: string
  slug?: string
  children?: DocsNavItem[]
}

export interface ApiParam {
  name: string
  type: string
  required: boolean
  description: string
  example: string
}

export interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  path: string
  description: string
  params: ApiParam[]
}

// A unified "business-opening signal" across all acquired sources — licenses,
// new-business registrations, commercial building permits, and retail-food
// establishments. Powers the /signals feed and /api/signals.
export type SignalSource = 'license' | 'registration' | 'permit' | 'retail_food'

export interface BusinessSignal {
  id: string
  signalType: SignalSource
  businessName: string
  category: string
  detail: string
  city: string
  county: string
  date: string
  value: number | null
  phone: string | null
  sourceLabel: string
  lat: number | null
  lng: number | null
}

export interface LicenseQueryParams {
  county?: string
  licenseType?: LicenseType
  status?: LicenseStatus
  eventType?: EventType
  filedAfter?: string
  filedBefore?: string
  city?: string
  zip?: string
  cursor?: string
  limit?: number
  q?: string
}
