// New-filing / change detection by diffing two normalized snapshots, keyed on
// licenseNumber. This is the AUTHORITATIVE event signal that powers the product's
// "new filing today" feed (more reliable than a single snapshot's date heuristic,
// given DBPR's weekly-refresh caveat). Pair with daily.csv when available.

/**
 * @param {Array<{licenseNumber:string,status:string,effectiveDate?:string,_expirationDate?:string,businessName?:string,address?:any}>} prev
 * @param {Array<same>} curr
 * @returns {Array<{type:string, licenseNumber:string, record:any, change?:object}>}
 */
export function diffSnapshots(prev, curr) {
  const prevByLn = new Map(prev.map((r) => [r.licenseNumber, r]))
  const events = []

  for (const rec of curr) {
    const before = prevByLn.get(rec.licenseNumber)
    if (!before) {
      // License number not present yesterday → a brand-new filing.
      events.push({ type: 'new_filing', licenseNumber: rec.licenseNumber, record: rec })
      continue
    }
    if (before.status !== rec.status) {
      const type =
        rec.status === 'cancelled'
          ? 'cancellation'
          : rec.status === 'active' && before.status !== 'active'
            ? 'reinstatement'
            : 'status_change'
      events.push({
        type,
        licenseNumber: rec.licenseNumber,
        record: rec,
        change: { field: 'status', from: before.status, to: rec.status },
      })
    } else if (before.effectiveDate !== rec.effectiveDate) {
      events.push({
        type: 'renewal',
        licenseNumber: rec.licenseNumber,
        record: rec,
        change: { field: 'effectiveDate', from: before.effectiveDate, to: rec.effectiveDate },
      })
    } else if (addrKey(before.address) !== addrKey(rec.address)) {
      events.push({
        type: 'address_change',
        licenseNumber: rec.licenseNumber,
        record: rec,
        change: { field: 'address', from: addrKey(before.address), to: addrKey(rec.address) },
      })
    }
  }

  // Licenses that disappeared from the feed (often = revoked/void/transferred).
  const currLns = new Set(curr.map((r) => r.licenseNumber))
  for (const before of prev) {
    if (!currLns.has(before.licenseNumber)) {
      events.push({ type: 'removed', licenseNumber: before.licenseNumber, record: before })
    }
  }

  return events
}

function addrKey(a) {
  if (!a) return ''
  return [a.street, a.city, a.zip].map((x) => (x || '').toUpperCase().trim()).join('|')
}
