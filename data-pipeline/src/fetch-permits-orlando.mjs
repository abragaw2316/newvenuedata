// City of Orlando commercial NEW-construction building permits (Socrata).
// The earliest business-opening signal: a commercial buildout permit fires
// weeks-to-months before any liquor/food license. Public, no API key.
//   node src/fetch-permits-orlando.mjs [limit]
import { mkdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { PATHS } from './config.mjs'

const exec = promisify(execFile)
const BASE = 'https://data.cityoforlando.net/resource/ryhf-m453.json'
// Socrata is behind Cloudflare, which fingerprints Node's fetch (undici) and
// returns 403 regardless of User-Agent. curl negotiates cleanly, so we shell out
// to it for this public open-data API.
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) New Venue DataBot/0.1'

function normalizePermit(p) {
  return {
    id: `permit_orl_${(p.permit_number || '').replace(/[^A-Za-z0-9]/g, '')}`,
    source: 'Orlando-Permits',
    signal: 'commercial_buildout',
    eventType: 'new_filing',
    permitNumber: p.permit_number || '',
    businessName: p.project_name || `${p.worktype || 'New'} ${p.plan_review_type || 'Commercial'}`,
    permitCategory: p.application_type || '',
    address: { street: p.permit_address || '', city: 'Orlando', county: 'Orange', state: 'FL', zip: '' },
    owner: p.property_owner_name || p.parcel_owner_name || '',
    contractor: p.contractor_name || '',
    contractorPhone: p.contractor_phone_number || '',
    estimatedCost: p.estimated_cost ? Number(p.estimated_cost) : null,
    squareFootage: p.square_footage ? Number(p.square_footage) : null,
    appliedDate: (p.processed_date || '').slice(0, 10),
    issuedDate: (p.issue_permit_date || '').slice(0, 10),
    status: p.application_status || '',
    sourceUrl: BASE,
  }
}

async function main() {
  await mkdir(fileURLToPath(PATHS.out), { recursive: true })
  const limit = Number(process.argv[2]) || 50
  // Build manually so the Socrata $-prefixed params stay literal (URLSearchParams
  // would percent-encode the '$' and break the query).
  const where = encodeURIComponent("plan_review_type='Commercial' AND worktype='New'")
  const order = encodeURIComponent('issue_permit_date DESC')
  const url = `${BASE}?$where=${where}&$order=${order}&$limit=${limit}`
  const { stdout } = await exec('curl', ['-sL', '-A', UA, url], { maxBuffer: 64 * 1024 * 1024 })
  const permits = JSON.parse(stdout).map(normalizePermit)

  const dest = fileURLToPath(new URL('normalized-permits-orlando.json', PATHS.out))
  await writeFile(dest, JSON.stringify(permits, null, 2))

  const withValue = permits.filter((p) => p.estimatedCost)
  const totalValue = withValue.reduce((s, p) => s + p.estimatedCost, 0)
  console.log(`✓ Orlando: ${permits.length} commercial NEW-construction permits → normalized-permits-orlando.json`)
  console.log(`  total declared value: $${totalValue.toLocaleString()} across ${withValue.length} valued permits`)
  for (const p of permits.slice(0, 6)) {
    console.log(`  · ${p.businessName} — ${p.address.street} — $${(p.estimatedCost || 0).toLocaleString()} — applied ${p.appliedDate || 'n/a'} — ${p.status}`)
  }
}

main().catch((e) => {
  console.error('Orlando permits fetch failed:', e.message)
  process.exit(1)
})
