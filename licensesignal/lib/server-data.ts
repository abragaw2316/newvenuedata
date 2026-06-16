// Server-only loaders for the FULL API dataset.
//
// The UI pages render from the small curated sets bundled into lib/real-data.ts
// and lib/signals.ts. The API routes instead serve the *entire* normalized
// universe — ~59k LicenseRecords (~35 MB) + ~2.2k BusinessSignals — which is too
// large to bundle into a JS module. The data-pipeline emits them as flat JSON
// (data/licenses.json, data/signals.json) via build-full-data.mjs; we read them
// from disk once per server instance (memoized) and next.config.ts
// `outputFileTracingIncludes` ships them with the serverless functions.
//
// This is the documented flat-file stopgap (handoff.md TODO-A); the long-term
// home for this volume is a database. Import only from Node-runtime route
// handlers — it touches the filesystem.
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import type { LicenseRecord, BusinessSignal } from './types'
import { MOCK_LICENSES } from './mock-data'
import { BUSINESS_SIGNALS } from './signals'

const dataFile = (name: string) => path.join(process.cwd(), 'data', name)

async function loadJson<T>(name: string, fallback: T[]): Promise<T[]> {
  try {
    const raw = await readFile(dataFile(name), 'utf8')
    const parsed = JSON.parse(raw) as T[]
    if (Array.isArray(parsed) && parsed.length > 0) return parsed
    throw new Error('empty dataset')
  } catch (err) {
    // Fall back to the bundled curated set so the API never hard-fails, but make
    // the degradation loud — in production this means the full file wasn't shipped
    // with the function (check next.config.ts outputFileTracingIncludes).
    console.warn(
      `[server-data] could not read data/${name} (${(err as Error).message}); ` +
        `serving the bundled curated sample instead.`
    )
    return fallback
  }
}

let licensesPromise: Promise<LicenseRecord[]> | null = null
/** Every normalized Florida license record (memoized for the server instance). */
export function getAllLicenses(): Promise<LicenseRecord[]> {
  if (!licensesPromise) licensesPromise = loadJson('licenses.json', MOCK_LICENSES)
  return licensesPromise
}

let signalsPromise: Promise<BusinessSignal[]> | null = null
/** Every unified business-opening signal (memoized for the server instance). */
export function getAllSignals(): Promise<BusinessSignal[]> {
  if (!signalsPromise) signalsPromise = loadJson('signals.json', BUSINESS_SIGNALS)
  return signalsPromise
}

let texasPromise: Promise<LicenseRecord[]> | null = null
/**
 * Texas TABC licenses (a recent-active sample — full per-record TX awaits the DB
 * migration; see data-pipeline/src/fetch-tabc-full.mjs). Served via
 * /api/licenses?state=TX. Returns [] if the file isn't present.
 */
export function getTexasLicenses(): Promise<LicenseRecord[]> {
  if (!texasPromise) texasPromise = loadJson<LicenseRecord>('licenses-tx.json', [])
  return texasPromise
}
