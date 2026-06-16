// Mint an API key (stopgap, file-backed). Run from the licensesignal/ root:
//   npm run mint-key -- <plan> "<name>"
//   e.g. npm run mint-key -- pro "Acme Insurance Agency"
//
// Prints the raw key ONCE (store it now — only its SHA-256 hash is saved to
// data/api-keys.json, so it cannot be recovered). The deployed API reads that
// file to validate keys. Real key management belongs in a DB (handoff.md TODO-A).
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { randomBytes, createHash } from 'node:crypto'
import path from 'node:path'

const PLAN_RATE_LIMITS = { sandbox: 60, starter: 120, pro: 600, enterprise: 3000 }

const plan = (process.argv[2] || 'starter').toLowerCase()
const name = process.argv[3] || `${plan} key`
if (!PLAN_RATE_LIMITS[plan]) {
  console.error(`Unknown plan "${plan}". Use one of: ${Object.keys(PLAN_RATE_LIMITS).join(', ')}`)
  process.exit(1)
}

const env = plan === 'sandbox' ? 'test' : 'live'
const rawKey = `ls_${env}_${randomBytes(18).toString('hex')}`
const hashedKey = createHash('sha256').update(rawKey).digest('hex')
const id = `key_${randomBytes(4).toString('hex')}`
const createdAt = new Date().toISOString().slice(0, 10)

const file = path.join(process.cwd(), 'data', 'api-keys.json')
let data = { keys: [] }
try {
  const parsed = JSON.parse(await readFile(file, 'utf8'))
  data = { ...parsed, keys: Array.isArray(parsed.keys) ? parsed.keys : [] }
} catch {
  /* first key — start a fresh file */
}

data.keys.push({ id, name, plan, hashedKey, rateLimitPerMin: PLAN_RATE_LIMITS[plan], active: true, createdAt })
await mkdir(path.dirname(file), { recursive: true })
await writeFile(file, JSON.stringify(data, null, 2) + '\n', 'utf8')

console.log('\n✓ API key issued — copy it now, it will not be shown again:\n')
console.log(`    ${rawKey}\n`)
console.log(`  id:    ${id}`)
console.log(`  plan:  ${plan} (${PLAN_RATE_LIMITS[plan]} req/min)`)
console.log(`  name:  ${name}`)
console.log(`\n  Use it as:  Authorization: Bearer ${rawKey}`)
console.log('  (Redeploy / restart the server to load the new key.)\n')
