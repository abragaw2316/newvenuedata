// Pull Florida new-business REGISTRATIONS from Sunbiz (Division of Corporations)
// over SFTP — the broadest top-of-funnel "new business formed" signal (every new
// FL LLC/corp, before it ever appears in license data). Daily delta files at
// /doc/cor/yyyymmddc.txt are fixed-width 1,440-char records (parser in
// enrich-sunbiz.mjs). Public creds (published on the Data Downloads page).
//   node src/fetch-sunbiz.mjs
import SftpClient from 'ssh2-sftp-client'
import { mkdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { PATHS, SUNBIZ } from './config.mjs'
import { parseSunbizRecord } from './enrich-sunbiz.mjs'

// Filing-type code → human entity type (partial; extend from cor.html).
const FILING_TYPE = {
  FLAL: 'LLC',
  DOMP: 'Profit Corp',
  FORP: 'Foreign Corp',
  DOMNP: 'Non-Profit Corp',
  FLAP: 'Limited Partnership',
}

function toRegistration(rec, sourceUrl) {
  return {
    id: `corp_${rec.documentNumber}`,
    source: 'FL-Sunbiz-COR',
    signal: 'new_business_formed',
    eventType: 'new_filing',
    documentNumber: rec.documentNumber,
    businessName: rec.name,
    entityType: FILING_TYPE[rec.filingType] || rec.filingType,
    status: rec.status,
    formedDate: rec.fileDate,
    principalAddress: rec.principalAddress,
    feiNumber: rec.feiNumber,
    registeredAgent: rec.registeredAgent,
    officers: rec.officers,
    sourceUrl,
  }
}

async function main() {
  await mkdir(fileURLToPath(PATHS.out), { recursive: true })
  const sftp = new SftpClient()
  try {
    await sftp.connect({ host: SUNBIZ.host, port: 22, username: SUNBIZ.user, password: SUNBIZ.pass, readyTimeout: 20000 })
    const dir = SUNBIZ.dailyPath // doc/cor (relative to the Public landing dir)
    const listing = await sftp.list(dir)
    const dailies = listing
      .filter((f) => /^\d{8}c\.txt$/i.test(f.name))
      .sort((a, b) => b.name.localeCompare(a.name))
    if (dailies.length === 0) throw new Error(`no daily files found in ${dir}`)
    const latest = dailies[0].name
    const remote = `${dir}/${latest}`
    console.log(`latest daily file: ${latest} (${(dailies[0].size / 1024).toFixed(0)} KB)`)

    const buf = await sftp.get(remote)
    const text = buf.toString('latin1')
    const sourceUrl = `sftp://${SUNBIZ.host}${remote}`

    const regs = []
    for (const line of text.split(/\r?\n/)) {
      const rec = parseSunbizRecord(line)
      if (rec && rec.documentNumber && rec.name) regs.push(toRegistration(rec, sourceUrl))
    }

    const dest = fileURLToPath(new URL('sunbiz-new.json', PATHS.out))
    await writeFile(dest, JSON.stringify(regs, null, 2))
    const byType = {}
    regs.forEach((r) => (byType[r.entityType] = (byType[r.entityType] || 0) + 1))
    console.log(`✓ ${regs.length} new FL business registrations from ${latest} → sunbiz-new.json`)
    console.log(`  by type: ${Object.entries(byType).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([k, v]) => `${k} ${v}`).join(', ')}`)
    for (const r of regs.slice(0, 6)) {
      console.log(`  · ${r.businessName} — ${r.entityType} — formed ${r.formedDate} — ${r.documentNumber}`)
    }
  } finally {
    await sftp.end().catch(() => {})
  }
}

main().catch((e) => {
  console.error('Sunbiz fetch failed:', e.message)
  process.exit(1)
})
