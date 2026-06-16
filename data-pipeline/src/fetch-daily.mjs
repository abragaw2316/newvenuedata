// AB&T Daily Activity feed (daily.csv) — the real-time change feed. Each morning
// this file contains only that day's transactions (not a snapshot), so it
// replaces diffing two 52k-row license snapshots. 17 fields, NO header.
//   node src/fetch-daily.mjs
import { mkdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { PATHS, USER_AGENT } from './config.mjs'
import { parseCsv } from './csv.mjs'
import { seriesToLicenseType, toISODate } from './lookups.mjs'

const URL_ = 'https://www2.myfloridalicense.com/sto/file_download/extracts/daily.csv'

// Transaction codes (field 16) → our event types. The full vocabulary is larger;
// accumulate distinct (code, desc) pairs over several days to extend this map.
const TXN_EVENT = {
  '9505': 'new_filing', // "Versa Online Active License Print" — license went active
}

function classify(code, desc) {
  if (TXN_EVENT[code]) return TXN_EVENT[code]
  const d = (desc || '').toLowerCase()
  if (d.includes('revoke') || d.includes('cancel')) return 'cancellation'
  if (d.includes('renew')) return 'renewal'
  if (d.includes('transfer')) return 'ownership_transfer'
  if (d.includes('add') || d.includes('endorse')) return 'status_change'
  return 'status_change'
}

async function main() {
  await mkdir(fileURLToPath(PATHS.out), { recursive: true })
  const res = await fetch(URL_, { headers: { 'User-Agent': USER_AGENT } })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const rows = parseCsv(await res.text())

  const events = []
  for (const r of rows) {
    if (r.length < 16) continue
    const [board, county, licenseNumber, series, , dba, owner, st1, , , city, state, zip, txnDate, txnCode, txnDesc] = r
    events.push({
      board,
      county,
      licenseNumber,
      licenseType: seriesToLicenseType(series),
      series,
      businessName: dba || owner,
      address: { street: st1, city, state, zip },
      eventDate: toISODate(txnDate),
      eventType: classify(txnCode, txnDesc),
      txnCode,
      txnDescription: txnDesc,
      sourceUrl: URL_,
    })
  }

  const dest = fileURLToPath(new URL('daily-events.json', PATHS.out))
  await writeFile(dest, JSON.stringify(events, null, 2))

  const byType = {}
  events.forEach((e) => (byType[e.eventType] = (byType[e.eventType] || 0) + 1))
  const newActive = events.filter((e) => e.eventType === 'new_filing')
  const retailNew = newActive.filter((e) => e.board === '4006')

  console.log(`✓ daily.csv: ${events.length} transactions on ${events[0]?.eventDate || '?'} → daily-events.json`)
  console.log(`  by event: ${Object.entries(byType).map(([k, v]) => `${k} ${v}`).join(', ')}`)
  console.log(`  retail liquor (4006) new-active today: ${retailNew.length}`)
  for (const e of retailNew.slice(0, 6)) {
    console.log(`  · ${e.businessName} — ${e.series}/${e.licenseType} — ${e.address.city}, ${e.county} — ${e.licenseNumber}`)
  }
}

main().catch((e) => {
  console.error('daily feed failed:', e.message)
  process.exit(1)
})
