#!/usr/bin/env node
// New Venue Data — MCP server.
//
// Exposes Florida new-venue license data as tools for AI agents (Claude Desktop,
// Claude Code, Cursor, and any MCP client). ZERO-DEPENDENCY: implements the MCP
// stdio transport (newline-delimited JSON-RPC 2.0) directly, mirroring the
// zero-dep style of the data-pipeline.
//
// It's a thin client over the public REST API at newvenuedata.com — so it doubles
// as a distribution surface: an agent that finds this server needs a key for the
// higher tiers, which is the funnel.
//
// Configure in Claude Desktop (claude_desktop_config.json):
//   {
//     "mcpServers": {
//       "new-venue-data": {
//         "command": "node",
//         "args": ["C:/path/to/mcp-server/src/index.mjs"],
//         "env": { "NVD_API_KEY": "ls_live_..." }
//       }
//     }
//   }
// Without a key it uses the public sandbox tier (rate-limited).
import process from 'node:process'
import readline from 'node:readline'

const API_BASE = (process.env.NVD_API_BASE || 'https://newvenuedata.com/api').replace(/\/$/, '')
const API_KEY = process.env.NVD_API_KEY || ''
const SERVER = { name: 'new-venue-data', version: '0.1.0' }
const DEFAULT_PROTOCOL = '2024-11-05'

// ── transport helpers (newline-delimited JSON-RPC 2.0 on stdout) ──────────────
function send(msg) {
  process.stdout.write(JSON.stringify(msg) + '\n')
}
const ok = (id, value) => send({ jsonrpc: '2.0', id, result: value })
const fail = (id, code, message) => send({ jsonrpc: '2.0', id, error: { code, message } })
const log = (...a) => process.stderr.write('[nvd-mcp] ' + a.join(' ') + '\n')

// ── REST client ───────────────────────────────────────────────────────────────
async function api(path, params = {}) {
  const url = new URL(API_BASE + path)
  for (const [k, v] of Object.entries(params)) {
    if (v != null && v !== '') url.searchParams.set(k, String(v))
  }
  const headers = { accept: 'application/json' }
  if (API_KEY) headers.authorization = `Bearer ${API_KEY}`
  const res = await fetch(url, { headers })
  if (!res.ok) throw new Error(`New Venue Data API returned ${res.status} for ${path}`)
  return res.json()
}

// ── tool catalog ────────────────────────────────────────────────────────────
const LICENSE_TYPES =
  'COP, SRX, BEV, APS, FOOD_SERVICE, SEATING, MOBILE_FOOD, TEMP_PERMIT, MANUFACTURER, BOTTLE_CLUB'

const TOOLS = [
  {
    name: 'search_new_venues',
    description:
      'Search Florida liquor & food-service license records — new bars, restaurants, package stores, breweries, and more. ' +
      'Filter by county, license type, status, and free-text query. Returns venues with name, address, county, license type, and filing date.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Free-text search across business name, owner, city, and license number.' },
        county: { type: 'string', description: 'Florida county name, e.g. "Miami-Dade", "Broward", "Orange".' },
        license_type: { type: 'string', description: `License type code. One of: ${LICENSE_TYPES}.` },
        status: { type: 'string', description: 'License status, e.g. "active".' },
        limit: { type: 'number', description: 'Max results (1–100, default 25).' },
      },
    },
  },
  {
    name: 'recent_filings',
    description:
      'List the most recent NEW Florida license filings — venues that just got licensed (the freshest leads). ' +
      'Optionally filter to a county or license type.',
    inputSchema: {
      type: 'object',
      properties: {
        county: { type: 'string', description: 'Florida county name to filter to (optional).' },
        license_type: { type: 'string', description: `Optional license type code (${LICENSE_TYPES}).` },
        limit: { type: 'number', description: 'Max results (1–100, default 25).' },
      },
    },
  },
  {
    name: 'county_stats',
    description:
      'Get aggregate Florida license counts — totals by county and by license type — for market sizing and reading filing volume by area.',
    inputSchema: { type: 'object', properties: {} },
  },
]

// ── formatting ────────────────────────────────────────────────────────────────
const text = (value) => ({
  content: [{ type: 'text', text: typeof value === 'string' ? value : JSON.stringify(value, null, 2) }],
})

function summarize(data) {
  const rows = Array.isArray(data?.data) ? data.data : []
  if (!rows.length) return 'No matching records.'
  const lines = rows.map((r) => {
    const a = r.address || {}
    const where = [a.street, a.city, a.county].filter(Boolean).join(', ')
    return `• ${r.businessName || r.legalName || '(no name)'} — ${r.licenseType} — ${where} — filed ${r.filedDate || 'n/a'} — ${r.status}`
  })
  return `${rows.length} result(s):\n${lines.join('\n')}`
}

// ── tool dispatch ─────────────────────────────────────────────────────────────
async function callTool(name, args = {}) {
  const limit = Math.min(Math.max(Number(args.limit) || 25, 1), 100)
  switch (name) {
    case 'search_new_venues': {
      const data = args.query
        ? await api('/licenses/search', { q: args.query, county: args.county, license_type: args.license_type, status: args.status, limit })
        : await api('/licenses', { county: args.county, license_type: args.license_type, status: args.status, limit })
      return text(summarize(data))
    }
    case 'recent_filings': {
      const data = await api('/licenses', { event_type: 'new_filing', county: args.county, license_type: args.license_type, limit })
      return text(summarize(data))
    }
    case 'county_stats': {
      return text(await api('/stats'))
    }
    default:
      throw new Error(`Unknown tool: ${name}`)
  }
}

// ── JSON-RPC routing ──────────────────────────────────────────────────────────
async function handle(msg) {
  const { id, method, params } = msg
  switch (method) {
    case 'initialize':
      return ok(id, {
        protocolVersion: params?.protocolVersion || DEFAULT_PROTOCOL,
        capabilities: { tools: {} },
        serverInfo: SERVER,
      })
    case 'notifications/initialized':
      return // notification — no response
    case 'ping':
      return ok(id, {})
    case 'tools/list':
      return ok(id, { tools: TOOLS })
    case 'tools/call':
      try {
        return ok(id, await callTool(params?.name, params?.arguments || {}))
      } catch (e) {
        // Tool errors are reported in-band so the agent can react, not as protocol errors.
        return ok(id, { content: [{ type: 'text', text: `Error: ${e.message}` }], isError: true })
      }
    default:
      if (id != null) fail(id, -32601, `Method not found: ${method}`)
  }
}

const rl = readline.createInterface({ input: process.stdin })
rl.on('line', (line) => {
  const trimmed = line.trim()
  if (!trimmed) return
  let msg
  try {
    msg = JSON.parse(trimmed)
  } catch {
    return // ignore non-JSON lines
  }
  Promise.resolve(handle(msg)).catch((e) => log('handler error:', e.message))
})

log(`ready — API ${API_BASE} (${API_KEY ? 'authenticated' : 'sandbox tier'})`)
