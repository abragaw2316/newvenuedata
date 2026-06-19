// Smoke test for the New Venue Data MCP server. Drives the stdio JSON-RPC
// handshake and asserts the protocol responses. The `initialize` + `tools/list`
// checks are fully offline; the optional `tools/call` check needs network to the
// live API and is treated as best-effort (skipped on network failure).
//   node test/smoke.mjs
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const SERVER = fileURLToPath(new URL('../src/index.mjs', import.meta.url))
const child = spawn('node', [SERVER], { stdio: ['pipe', 'pipe', 'inherit'] })

const responses = new Map()
let buf = ''
child.stdout.on('data', (chunk) => {
  buf += chunk.toString()
  let nl
  while ((nl = buf.indexOf('\n')) >= 0) {
    const line = buf.slice(0, nl).trim()
    buf = buf.slice(nl + 1)
    if (!line) continue
    try {
      const msg = JSON.parse(line)
      if (msg.id != null) responses.set(msg.id, msg)
    } catch {
      /* ignore */
    }
  }
})

const writeMsg = (m) => child.stdin.write(JSON.stringify(m) + '\n')
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function waitFor(id, timeoutMs = 4000) {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    if (responses.has(id)) return responses.get(id)
    await sleep(25)
  }
  return null
}

function assert(cond, label) {
  if (!cond) {
    console.error(`✗ ${label}`)
    child.kill()
    process.exit(1)
  }
  console.log(`✓ ${label}`)
}

async function main() {
  // 1) initialize
  writeMsg({ jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: 'smoke', version: '0' } } })
  const init = await waitFor(1)
  assert(init && init.result, 'initialize returns a result')
  assert(init.result.serverInfo?.name === 'new-venue-data', 'serverInfo.name is new-venue-data')
  assert(init.result.capabilities?.tools, 'declares tools capability')

  writeMsg({ jsonrpc: '2.0', method: 'notifications/initialized' })

  // 2) tools/list
  writeMsg({ jsonrpc: '2.0', id: 2, method: 'tools/list' })
  const list = await waitFor(2)
  assert(list && Array.isArray(list.result?.tools), 'tools/list returns a tools array')
  const names = list.result.tools.map((t) => t.name).sort()
  assert(
    JSON.stringify(names) === JSON.stringify(['county_stats', 'recent_filings', 'search_new_venues']),
    `tools are [county_stats, recent_filings, search_new_venues] (got ${names.join(', ')})`
  )
  for (const t of list.result.tools) {
    assert(t.inputSchema?.type === 'object', `${t.name} has an object inputSchema`)
  }

  // 3) tools/call (best-effort — needs network to the live API)
  writeMsg({ jsonrpc: '2.0', id: 3, method: 'tools/call', params: { name: 'county_stats', arguments: {} } })
  const call = await waitFor(3, 6000)
  if (!call) {
    console.log('• tools/call county_stats: no response in time (network?) — protocol checks still passed')
  } else if (call.result?.isError) {
    console.log(`• tools/call county_stats: API unreachable (${call.result.content?.[0]?.text || 'error'}) — expected if offline`)
  } else {
    assert(Array.isArray(call.result?.content), 'tools/call returns content[]')
    console.log('✓ tools/call county_stats hit the live API')
  }

  console.log('\nSmoke test passed.')
  child.kill()
  process.exit(0)
}

main().catch((e) => {
  console.error('smoke test crashed:', e)
  child.kill()
  process.exit(1)
})
