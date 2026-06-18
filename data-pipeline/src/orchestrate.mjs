// Nightly orchestrator — the full daily refresh. Runs every acquired source in
// sequence (tolerant of individual failures), then regenerates the site's data
// (lib/real-data.ts) and the unified signal feed (lib/signals.ts).
//
//   node src/orchestrate.mjs
//
// Wire this to a scheduler:
//   • GitHub Actions cron — see .github/workflows/data-refresh.yml
//   • OS cron / Task Scheduler — `cd data-pipeline && node src/orchestrate.mjs`
//   • A long-running worker — wrap in node-cron
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { fileURLToPath } from 'node:url'

const exec = promisify(execFile)
const ROOT = fileURLToPath(new URL('..', import.meta.url))

// Ordered steps. `optional` steps (SFTP, third-party APIs) won't fail the run.
const STEPS = [
  { name: 'liquor licenses (bd4006lic)', cmd: ['src/run.mjs', '--source=abt_retail'] },
  { name: 'new restaurants (newfood)', cmd: ['src/run.mjs', '--source=food_new'] },
  { name: 'temp permits (bd4002lic)', cmd: ['src/run.mjs', '--source=abt_temp_permits'], optional: true },
  { name: 'manufacturers (bd4005lic)', cmd: ['src/run.mjs', '--source=abt_distributors'], optional: true },
  { name: 'bottle clubs (bd4014lic)', cmd: ['src/run.mjs', '--source=abt_bottle_clubs'], optional: true },
  { name: 'retail food (FDACS)', cmd: ['src/fetch-fdacs.mjs', '600'], optional: true },
  { name: 'daily change feed', cmd: ['src/fetch-daily.mjs'], optional: true },
  { name: 'commercial permits (Orlando)', cmd: ['src/fetch-permits-orlando.mjs', '60'], optional: true },
  { name: 'new registrations (Sunbiz)', cmd: ['src/fetch-sunbiz.mjs'], optional: true },
  { name: 'Texas TABC aggregates', cmd: ['src/fetch-tabc.mjs'], optional: true },
  { name: 'regenerate site dataset', cmd: ['src/build-app-data.mjs'] },
  { name: 'regenerate signal feed', cmd: ['src/build-signals.mjs'] },
  { name: 'regenerate full API dataset', cmd: ['src/build-full-data.mjs'] },
  { name: 'regenerate coverage stats', cmd: ['src/build-coverage-stats.mjs'] },
]

async function step(s) {
  const started = process.hrtime.bigint()
  try {
    const { stdout } = await exec('node', s.cmd, { cwd: ROOT, maxBuffer: 64 * 1024 * 1024 })
    const ms = Number(process.hrtime.bigint() - started) / 1e6
    const last = stdout.trim().split('\n').slice(-1)[0] || ''
    console.log(`✓ ${s.name.padEnd(34)} ${(ms / 1000).toFixed(1)}s  ${last.slice(0, 80)}`)
    return { name: s.name, ok: true }
  } catch (err) {
    const ms = Number(process.hrtime.bigint() - started) / 1e6
    const msg = (err.stderr || err.message || '').trim().split('\n').slice(-1)[0]
    console.log(`${s.optional ? '○' : '✗'} ${s.name.padEnd(34)} ${(ms / 1000).toFixed(1)}s  ${s.optional ? 'skipped' : 'FAILED'}: ${msg.slice(0, 70)}`)
    return { name: s.name, ok: false, optional: !!s.optional }
  }
}

async function main() {
  console.log(`\n🔄 New Venue Data daily refresh\n`)
  const results = []
  for (const s of STEPS) results.push(await step(s))

  const failedRequired = results.filter((r) => !r.ok && !r.optional)
  const skipped = results.filter((r) => !r.ok && r.optional)
  console.log(
    `\n── done: ${results.filter((r) => r.ok).length}/${results.length} ok` +
      (skipped.length ? `, ${skipped.length} optional skipped` : '') +
      (failedRequired.length ? `, ${failedRequired.length} REQUIRED FAILED` : '') +
      ` ──\n`
  )
  // Fail the job only if a required step broke (so cron/CI alerts correctly).
  process.exit(failedRequired.length ? 1 : 0)
}

main()
