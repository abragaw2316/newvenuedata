/**
 * db-schema.ts — TARGET Postgres schema for New Venue Data (NOT yet wired to a DB).
 *
 * This file is a dependency-free, design-time description of the database we
 * intend to implement once a Postgres instance is provisioned. It exists so the
 * rest of the codebase can reference stable row shapes and table/column names
 * before any real persistence layer is in place.
 *
 * Implementation plan:
 *   - ORM: Drizzle ORM (`drizzle-orm` + `drizzle-kit`) targeting Postgres.
 *   - The `SCHEMA` constant below is the source of truth for the migration: each
 *     table, its columns, types, nullability, and indexes are documented as
 *     plain data so they can be translated 1:1 into Drizzle `pgTable(...)`
 *     definitions and a generated SQL migration.
 *   - The exported `*Row` / entity interfaces describe the TypeScript shape of a
 *     selected row. Once Drizzle is added, these should be replaced by (or
 *     checked against) `InferSelectModel<typeof table>` from the Drizzle schema.
 *
 * IMPORTANT: There are intentionally NO runtime imports here. Nothing in this
 * file connects to a database. It compiles standalone.
 */

// ---------------------------------------------------------------------------
// Shared primitive aliases (documentation only — all resolve to string/number)
// ---------------------------------------------------------------------------

/** UUID v4/v7 primary key, e.g. "acct_01HZ8X...". Stored as `uuid` or `text`. */
export type Id = string
/** ISO-8601 timestamp string, mapped to Postgres `timestamptz`. */
export type Timestamptz = string
/** Calendar date with no time component, mapped to Postgres `date`. */
export type DateOnly = string
/** Arbitrary JSON payload, mapped to Postgres `jsonb`. */
export type Json = Record<string, unknown>

// ---------------------------------------------------------------------------
// Domain enums (mirror lib/types.ts; duplicated here to keep this file
// dependency-free and to document the DB-level enum/check constraints)
// ---------------------------------------------------------------------------

export type PlanTier = 'starter' | 'pro' | 'enterprise'
export type MembershipRole = 'owner' | 'admin' | 'member' | 'viewer'
export type AccountStatus = 'active' | 'invited' | 'suspended' | 'deleted'
export type ApiKeyScope = 'read' | 'write' | 'admin'
export type ApiKeyStatus = 'active' | 'revoked'
export type WebhookStatus = 'active' | 'paused' | 'disabled'
export type WebhookDeliveryStatus = 'pending' | 'delivered' | 'failed' | 'retrying'
export type DbLicenseStatus =
  | 'approved'
  | 'pending'
  | 'active'
  | 'expired'
  | 'suspended'
  | 'cancelled'
export type DbEventType =
  | 'new_filing'
  | 'status_change'
  | 'ownership_transfer'
  | 'address_change'
  | 'renewal'
  | 'cancellation'
export type AlertChannel = 'email' | 'webhook' | 'slack'
export type AlertFrequency = 'realtime' | 'hourly' | 'daily' | 'weekly'

// ---------------------------------------------------------------------------
// Entity row interfaces (shape of a selected row)
// ---------------------------------------------------------------------------

/** A single human login. Belongs to one or more orgs via Membership. */
export interface Account {
  id: Id
  email: string
  /** NULL until the user finishes onboarding / accepts an invite. */
  name: string | null
  /** Argon2/bcrypt hash. NULL for SSO-only or magic-link accounts. */
  passwordHash: string | null
  emailVerifiedAt: Timestamptz | null
  status: AccountStatus
  lastLoginAt: Timestamptz | null
  createdAt: Timestamptz
  updatedAt: Timestamptz
}

/** A billing/team boundary. Owns api keys, webhooks, saved views, alerts. */
export interface Org {
  id: Id
  name: string
  /** URL-safe unique handle, e.g. "acme-distributing". */
  slug: string
  plan: PlanTier
  /** Stripe customer id; NULL on free/trial orgs. */
  billingCustomerId: string | null
  /** Monthly included API call quota for the current plan. */
  monthlyQuota: number
  trialEndsAt: Timestamptz | null
  createdAt: Timestamptz
  updatedAt: Timestamptz
}

/** Join row connecting an Account to an Org with a role. */
export interface Membership {
  id: Id
  orgId: Id
  accountId: Id
  role: MembershipRole
  invitedByAccountId: Id | null
  invitedAt: Timestamptz | null
  acceptedAt: Timestamptz | null
  createdAt: Timestamptz
}

/** A hashed API credential scoped to an Org. */
export interface ApiKey {
  id: Id
  orgId: Id
  /** Human label shown in the dashboard, e.g. "Production server". */
  name: string
  /** Non-secret display prefix, e.g. "ls_live_a1b2". */
  prefix: string
  /** SHA-256 of the full key. The plaintext is shown only once at creation. */
  hashedKey: string
  scopes: ApiKeyScope[]
  status: ApiKeyStatus
  lastUsedAt: Timestamptz | null
  expiresAt: Timestamptz | null
  createdByAccountId: Id | null
  createdAt: Timestamptz
  revokedAt: Timestamptz | null
}

/** A registered webhook subscription for an Org. */
export interface WebhookEndpoint {
  id: Id
  orgId: Id
  url: string
  /** HMAC signing secret (stored encrypted at rest). */
  secret: string
  /** Event types this endpoint subscribes to. Empty = all. */
  eventTypes: DbEventType[]
  /** Optional filters narrowing which licenses trigger delivery. */
  counties: string[]
  licenseTypes: string[]
  status: WebhookStatus
  /** Consecutive failures; auto-disabled when this crosses a threshold. */
  failureCount: number
  lastDeliveredAt: Timestamptz | null
  createdAt: Timestamptz
  updatedAt: Timestamptz
}

/** One delivery attempt (or attempt chain) for a WebhookEndpoint. */
export interface WebhookDelivery {
  id: Id
  endpointId: Id
  orgId: Id
  /** FK to the license_event that triggered this delivery. */
  eventId: Id
  status: WebhookDeliveryStatus
  /** HTTP status returned by the customer endpoint, if any. */
  responseStatus: number | null
  /** Truncated response body captured for debugging. */
  responseBody: string | null
  attemptCount: number
  nextRetryAt: Timestamptz | null
  /** Snapshot of the JSON body that was POSTed. */
  payload: Json
  createdAt: Timestamptz
  deliveredAt: Timestamptz | null
}

/**
 * Canonical persisted license record (snake_case columns map to the camelCase
 * `LicenseRecord` returned by the API). This is the "current state" table.
 */
export interface LicenseRecordRow {
  id: Id
  licenseNumber: string
  licenseType: string
  status: DbLicenseStatus
  businessName: string
  legalName: string
  dbaName: string | null
  /** Address columns are flattened on the table (no nested jsonb). */
  street: string
  city: string
  county: string
  state: string
  zip: string
  lat: number | null
  lng: number | null
  filedDate: DateOnly
  effectiveDate: DateOnly | null
  expirationDate: DateOnly | null
  issuedDate: DateOnly | null
  /** Optional enrichment, denormalized as jsonb to avoid a wide table. */
  enrichment: Json | null
  /** The source system/document this row was last reconciled from. */
  sourceUrl: string
  /** Most recent event type applied to this record. */
  lastEventType: DbEventType
  lastEventAt: Timestamptz
  createdAt: Timestamptz
  updatedAt: Timestamptz
}

/**
 * Append-only event log. Every change to a license produces one row, which in
 * turn fans out to webhook_deliveries and alert evaluations.
 */
export interface LicenseEvent {
  id: Id
  /** FK to license_records.id. */
  licenseId: Id
  eventType: DbEventType
  /** Status before/after for status_change events; NULL otherwise. */
  previousStatus: DbLicenseStatus | null
  newStatus: DbLicenseStatus | null
  /** Full before/after diff captured as jsonb for auditing. */
  changes: Json | null
  sourceUrl: string
  occurredAt: Timestamptz
  createdAt: Timestamptz
}

/** A persisted search/filter configuration owned by an Org. */
export interface SavedView {
  id: Id
  orgId: Id
  createdByAccountId: Id | null
  name: string
  /** Serialized LicenseQueryParams (county, licenseType, status, q, ...). */
  filters: Json
  /** Whether every member of the org can see this view. */
  shared: boolean
  createdAt: Timestamptz
  updatedAt: Timestamptz
}

/** A rule that turns matching license events into notifications. */
export interface AlertRule {
  id: Id
  orgId: Id
  createdByAccountId: Id | null
  name: string
  /** Serialized filter the incoming event must match. */
  filters: Json
  /** Event types that arm this rule. Empty = all. */
  eventTypes: DbEventType[]
  channel: AlertChannel
  frequency: AlertFrequency
  /** Delivery target — email address, webhook endpoint id, or channel id. */
  destination: string
  enabled: boolean
  lastTriggeredAt: Timestamptz | null
  createdAt: Timestamptz
  updatedAt: Timestamptz
}

// ---------------------------------------------------------------------------
// Plain-object schema description (the migration source of truth)
// ---------------------------------------------------------------------------

/** Postgres column types we use, as string literals for documentation. */
export type PgColumnType =
  | 'uuid'
  | 'text'
  | 'varchar'
  | 'boolean'
  | 'integer'
  | 'bigint'
  | 'numeric'
  | 'double precision'
  | 'date'
  | 'timestamptz'
  | 'jsonb'
  | 'text[]'

export interface ColumnDef {
  name: string
  type: PgColumnType
  /** Defaults to false. PK columns are implicitly NOT NULL. */
  nullable?: boolean
  primaryKey?: boolean
  unique?: boolean
  /** SQL default expression, e.g. "now()" or "false". */
  default?: string
  /** If set, this column is a foreign key "table.column". */
  references?: string
  /** Human note about the column. */
  comment?: string
}

export interface IndexDef {
  name: string
  columns: string[]
  unique?: boolean
  /** Index method; defaults to btree. */
  method?: 'btree' | 'gin' | 'gist'
}

export interface TableDef {
  name: string
  comment: string
  columns: ColumnDef[]
  indexes?: IndexDef[]
}

export interface DbSchema {
  /** Identifier hint for the eventual Drizzle/Postgres implementation. */
  dialect: 'postgres'
  orm: 'drizzle'
  tables: TableDef[]
}

const timestamps: ColumnDef[] = [
  { name: 'created_at', type: 'timestamptz', default: 'now()' },
  { name: 'updated_at', type: 'timestamptz', default: 'now()' },
]

export const SCHEMA: DbSchema = {
  dialect: 'postgres',
  orm: 'drizzle',
  tables: [
    {
      name: 'accounts',
      comment: 'A single human login; joins orgs via memberships.',
      columns: [
        { name: 'id', type: 'uuid', primaryKey: true },
        { name: 'email', type: 'text', unique: true },
        { name: 'name', type: 'text', nullable: true },
        { name: 'password_hash', type: 'text', nullable: true, comment: 'NULL for SSO/magic-link.' },
        { name: 'email_verified_at', type: 'timestamptz', nullable: true },
        { name: 'status', type: 'text', default: "'active'", comment: 'active|invited|suspended|deleted' },
        { name: 'last_login_at', type: 'timestamptz', nullable: true },
        ...timestamps,
      ],
      indexes: [{ name: 'accounts_email_uq', columns: ['email'], unique: true }],
    },
    {
      name: 'orgs',
      comment: 'Billing/team boundary owning keys, webhooks, views and alerts.',
      columns: [
        { name: 'id', type: 'uuid', primaryKey: true },
        { name: 'name', type: 'text' },
        { name: 'slug', type: 'text', unique: true },
        { name: 'plan', type: 'text', default: "'starter'", comment: 'starter|pro|enterprise' },
        { name: 'billing_customer_id', type: 'text', nullable: true },
        { name: 'monthly_quota', type: 'integer', default: '1000' },
        { name: 'trial_ends_at', type: 'timestamptz', nullable: true },
        ...timestamps,
      ],
      indexes: [{ name: 'orgs_slug_uq', columns: ['slug'], unique: true }],
    },
    {
      name: 'memberships',
      comment: 'Join row connecting an account to an org with a role.',
      columns: [
        { name: 'id', type: 'uuid', primaryKey: true },
        { name: 'org_id', type: 'uuid', references: 'orgs.id' },
        { name: 'account_id', type: 'uuid', references: 'accounts.id' },
        { name: 'role', type: 'text', default: "'member'", comment: 'owner|admin|member|viewer' },
        { name: 'invited_by_account_id', type: 'uuid', nullable: true, references: 'accounts.id' },
        { name: 'invited_at', type: 'timestamptz', nullable: true },
        { name: 'accepted_at', type: 'timestamptz', nullable: true },
        { name: 'created_at', type: 'timestamptz', default: 'now()' },
      ],
      indexes: [
        { name: 'memberships_org_account_uq', columns: ['org_id', 'account_id'], unique: true },
        { name: 'memberships_account_idx', columns: ['account_id'] },
      ],
    },
    {
      name: 'api_keys',
      comment: 'Hashed API credentials scoped to an org.',
      columns: [
        { name: 'id', type: 'uuid', primaryKey: true },
        { name: 'org_id', type: 'uuid', references: 'orgs.id' },
        { name: 'name', type: 'text' },
        { name: 'prefix', type: 'text', comment: 'Non-secret display prefix.' },
        { name: 'hashed_key', type: 'text', unique: true, comment: 'SHA-256 of the full key.' },
        { name: 'scopes', type: 'text[]', default: "'{read}'" },
        { name: 'status', type: 'text', default: "'active'", comment: 'active|revoked' },
        { name: 'last_used_at', type: 'timestamptz', nullable: true },
        { name: 'expires_at', type: 'timestamptz', nullable: true },
        { name: 'created_by_account_id', type: 'uuid', nullable: true, references: 'accounts.id' },
        { name: 'created_at', type: 'timestamptz', default: 'now()' },
        { name: 'revoked_at', type: 'timestamptz', nullable: true },
      ],
      indexes: [
        { name: 'api_keys_hashed_key_uq', columns: ['hashed_key'], unique: true },
        { name: 'api_keys_org_idx', columns: ['org_id'] },
      ],
    },
    {
      name: 'webhook_endpoints',
      comment: 'Registered webhook subscriptions for an org.',
      columns: [
        { name: 'id', type: 'uuid', primaryKey: true },
        { name: 'org_id', type: 'uuid', references: 'orgs.id' },
        { name: 'url', type: 'text' },
        { name: 'secret', type: 'text', comment: 'HMAC signing secret, encrypted at rest.' },
        { name: 'event_types', type: 'text[]', default: "'{}'", comment: 'Empty = all events.' },
        { name: 'counties', type: 'text[]', default: "'{}'" },
        { name: 'license_types', type: 'text[]', default: "'{}'" },
        { name: 'status', type: 'text', default: "'active'", comment: 'active|paused|disabled' },
        { name: 'failure_count', type: 'integer', default: '0' },
        { name: 'last_delivered_at', type: 'timestamptz', nullable: true },
        ...timestamps,
      ],
      indexes: [{ name: 'webhook_endpoints_org_idx', columns: ['org_id'] }],
    },
    {
      name: 'webhook_deliveries',
      comment: 'One delivery attempt chain for a webhook endpoint.',
      columns: [
        { name: 'id', type: 'uuid', primaryKey: true },
        { name: 'endpoint_id', type: 'uuid', references: 'webhook_endpoints.id' },
        { name: 'org_id', type: 'uuid', references: 'orgs.id' },
        { name: 'event_id', type: 'uuid', references: 'license_events.id' },
        { name: 'status', type: 'text', default: "'pending'", comment: 'pending|delivered|failed|retrying' },
        { name: 'response_status', type: 'integer', nullable: true },
        { name: 'response_body', type: 'text', nullable: true },
        { name: 'attempt_count', type: 'integer', default: '0' },
        { name: 'next_retry_at', type: 'timestamptz', nullable: true },
        { name: 'payload', type: 'jsonb' },
        { name: 'created_at', type: 'timestamptz', default: 'now()' },
        { name: 'delivered_at', type: 'timestamptz', nullable: true },
      ],
      indexes: [
        { name: 'webhook_deliveries_endpoint_idx', columns: ['endpoint_id'] },
        { name: 'webhook_deliveries_status_idx', columns: ['status', 'next_retry_at'] },
      ],
    },
    {
      name: 'license_records',
      comment: 'Canonical current-state license record (one row per license).',
      columns: [
        { name: 'id', type: 'uuid', primaryKey: true },
        { name: 'license_number', type: 'text', unique: true },
        { name: 'license_type', type: 'text' },
        { name: 'status', type: 'text', comment: 'approved|pending|active|expired|suspended|cancelled' },
        { name: 'business_name', type: 'text' },
        { name: 'legal_name', type: 'text' },
        { name: 'dba_name', type: 'text', nullable: true },
        { name: 'street', type: 'text' },
        { name: 'city', type: 'text' },
        { name: 'county', type: 'text' },
        { name: 'state', type: 'varchar', default: "'FL'" },
        { name: 'zip', type: 'text' },
        { name: 'lat', type: 'double precision', nullable: true },
        { name: 'lng', type: 'double precision', nullable: true },
        { name: 'filed_date', type: 'date' },
        { name: 'effective_date', type: 'date', nullable: true },
        { name: 'expiration_date', type: 'date', nullable: true },
        { name: 'issued_date', type: 'date', nullable: true },
        { name: 'enrichment', type: 'jsonb', nullable: true },
        { name: 'source_url', type: 'text' },
        { name: 'last_event_type', type: 'text' },
        { name: 'last_event_at', type: 'timestamptz' },
        ...timestamps,
      ],
      indexes: [
        { name: 'license_records_number_uq', columns: ['license_number'], unique: true },
        { name: 'license_records_county_idx', columns: ['county'] },
        { name: 'license_records_type_status_idx', columns: ['license_type', 'status'] },
        { name: 'license_records_filed_idx', columns: ['filed_date'] },
        { name: 'license_records_enrichment_gin', columns: ['enrichment'], method: 'gin' },
      ],
    },
    {
      name: 'license_events',
      comment: 'Append-only log of every change applied to a license.',
      columns: [
        { name: 'id', type: 'uuid', primaryKey: true },
        { name: 'license_id', type: 'uuid', references: 'license_records.id' },
        { name: 'event_type', type: 'text', comment: 'new_filing|status_change|...' },
        { name: 'previous_status', type: 'text', nullable: true },
        { name: 'new_status', type: 'text', nullable: true },
        { name: 'changes', type: 'jsonb', nullable: true, comment: 'before/after diff' },
        { name: 'source_url', type: 'text' },
        { name: 'occurred_at', type: 'timestamptz' },
        { name: 'created_at', type: 'timestamptz', default: 'now()' },
      ],
      indexes: [
        { name: 'license_events_license_idx', columns: ['license_id'] },
        { name: 'license_events_type_time_idx', columns: ['event_type', 'occurred_at'] },
      ],
    },
    {
      name: 'saved_views',
      comment: 'Persisted search/filter configurations owned by an org.',
      columns: [
        { name: 'id', type: 'uuid', primaryKey: true },
        { name: 'org_id', type: 'uuid', references: 'orgs.id' },
        { name: 'created_by_account_id', type: 'uuid', nullable: true, references: 'accounts.id' },
        { name: 'name', type: 'text' },
        { name: 'filters', type: 'jsonb', comment: 'Serialized LicenseQueryParams.' },
        { name: 'shared', type: 'boolean', default: 'false' },
        ...timestamps,
      ],
      indexes: [{ name: 'saved_views_org_idx', columns: ['org_id'] }],
    },
    {
      name: 'alert_rules',
      comment: 'Rules that turn matching license events into notifications.',
      columns: [
        { name: 'id', type: 'uuid', primaryKey: true },
        { name: 'org_id', type: 'uuid', references: 'orgs.id' },
        { name: 'created_by_account_id', type: 'uuid', nullable: true, references: 'accounts.id' },
        { name: 'name', type: 'text' },
        { name: 'filters', type: 'jsonb' },
        { name: 'event_types', type: 'text[]', default: "'{}'" },
        { name: 'channel', type: 'text', default: "'email'", comment: 'email|webhook|slack' },
        { name: 'frequency', type: 'text', default: "'realtime'", comment: 'realtime|hourly|daily|weekly' },
        { name: 'destination', type: 'text' },
        { name: 'enabled', type: 'boolean', default: 'true' },
        { name: 'last_triggered_at', type: 'timestamptz', nullable: true },
        ...timestamps,
      ],
      indexes: [
        { name: 'alert_rules_org_idx', columns: ['org_id'] },
        { name: 'alert_rules_enabled_idx', columns: ['enabled'] },
      ],
    },
  ],
}

/** Convenience: look up a single table definition by name. */
export function getTable(name: string): TableDef | undefined {
  return SCHEMA.tables.find((t) => t.name === name)
}
