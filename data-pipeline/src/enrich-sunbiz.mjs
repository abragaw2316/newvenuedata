// Entity enrichment from Florida Sunbiz (Division of Corporations) bulk data.
// Joins a license record to its registered business entity → officers, principal
// & mailing address, registered agent, formation date, status.
//
// DATA ACQUISITION (run on your server, not here):
//   Sunbiz publishes free bulk files over SFTP:
//     host: sftp.floridados.gov   user: Public   pass: PubAccess1845!
//   Quarterly full load:  doc/quarterly/cor/cordata*.zip  (10 files, split by
//   document-number last digit). Daily deltas: doc/cor/yyyymmddc.txt.
//   Records are FIXED-WIDTH ASCII, 1,440 chars each (NOT CSV). Unzip, then feed
//   each line to parseSunbizRecord() below.
//
// This module is real, runnable code — it just needs the downloaded file, which
// requires an SFTP pull + unzip + (ideally) a database for the join at scale.

import { readFile } from 'node:fs/promises'

// 1-indexed (start, length) positions from the Sunbiz corporate data layout.
const F = {
  docNumber: [1, 12],
  name: [13, 192],
  status: [205, 1], // A=Active, I=Inactive
  filingType: [206, 15],
  principalAddr1: [221, 42],
  principalAddr2: [263, 42],
  principalCity: [305, 28],
  principalState: [333, 2],
  principalZip: [335, 10],
  mailingAddr1: [347, 42],
  fileDate: [473, 8], // MMDDYYYY
  feiNumber: [481, 14],
  raName: [545, 42],
  officer1: [669, 128],
}

function slice(line, [start, len]) {
  return line.substring(start - 1, start - 1 + len).trim()
}

/** Parse one 1,440-char Sunbiz corporate record. */
export function parseSunbizRecord(line) {
  if (!line || line.length < 200) return null
  const officers = []
  for (let i = 0; i < 6; i++) {
    const seg = line.substring(668 + i * 128, 668 + (i + 1) * 128).trim()
    if (seg) officers.push(seg)
  }
  return {
    documentNumber: slice(line, F.docNumber),
    name: slice(line, F.name),
    status: slice(line, F.status) === 'A' ? 'active' : 'inactive',
    filingType: slice(line, F.filingType),
    principalAddress: [slice(line, F.principalAddr1), slice(line, F.principalCity), slice(line, F.principalState), slice(line, F.principalZip)]
      .filter(Boolean)
      .join(', '),
    fileDate: fmtDate(slice(line, F.fileDate)),
    feiNumber: slice(line, F.feiNumber),
    registeredAgent: slice(line, F.raName),
    officers,
  }
}

function fmtDate(mmddyyyy) {
  const m = String(mmddyyyy).match(/^(\d{2})(\d{2})(\d{4})$/)
  return m ? `${m[3]}-${m[1]}-${m[2]}` : ''
}

/** Normalize a business name for fuzzy matching (drop punctuation, suffixes). */
export function nameKey(name) {
  return String(name || '')
    .toUpperCase()
    .replace(/[.,'"&]/g, ' ')
    .replace(/\b(LLC|INC|CORP|CO|LP|LLP|PA|LTD|COMPANY|INCORPORATED|ENTERPRISES?)\b/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Build an index of Sunbiz entities from a downloaded, unzipped cordata file and
 * join licenses to entities by normalized owner/legal name.
 * @param {string} sunbizFilePath  path to an unzipped cordata*.txt
 * @param {Array<{legalName:string,businessName:string}>} licenses
 */
export async function enrichFromSunbiz(sunbizFilePath, licenses) {
  const text = await readFile(sunbizFilePath, 'utf8')
  const byKey = new Map()
  for (const line of text.split(/\r?\n/)) {
    const rec = parseSunbizRecord(line)
    if (rec) byKey.set(nameKey(rec.name), rec)
  }
  return licenses.map((lic) => {
    const entity = byKey.get(nameKey(lic.legalName)) || byKey.get(nameKey(lic.businessName))
    if (!entity) return lic
    return {
      ...lic,
      enrichment: {
        entityDocumentNumber: entity.documentNumber,
        entityStatus: entity.status,
        registeredAgent: entity.registeredAgent,
        officers: entity.officers,
        entityFileDate: entity.fileDate,
        feiNumber: entity.feiNumber,
      },
    }
  })
}
