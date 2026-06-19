# New Venue Data — MCP server

An [MCP](https://modelcontextprotocol.io) server that exposes **Florida new-venue
license data** as tools for AI agents (Claude Desktop, Claude Code, Cursor, and any
MCP client). Ask an agent _"what new bars opened in Miami-Dade this month?"_ and it
can answer from live Florida public-records data.

It's **zero-dependency** — a thin stdio JSON-RPC client over the public
[newvenuedata.com](https://newvenuedata.com) REST API. No build step, no `npm install`.

## Tools

| Tool | What it does |
|------|--------------|
| `search_new_venues` | Search FL liquor & food-service licenses by county, license type, status, and free-text query. |
| `recent_filings` | The most recent **new** filings — freshest newly-licensed venues, optionally by county. |
| `county_stats` | Aggregate counts by county and license type — market sizing. |

License types: `COP, SRX, BEV, APS, FOOD_SERVICE, SEATING, MOBILE_FOOD, TEMP_PERMIT, MANUFACTURER, BOTTLE_CLUB`.

## Install

Requires Node 18+. Clone the repo (or copy this `mcp-server/` folder), then point your
MCP client at `src/index.mjs`.

### Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "new-venue-data": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-server/src/index.mjs"],
      "env": { "NVD_API_KEY": "ls_live_your_key" }
    }
  }
}
```

### Claude Code

```bash
claude mcp add new-venue-data -- node /absolute/path/to/mcp-server/src/index.mjs
```

(Set `NVD_API_KEY` in the environment for higher rate limits.)

## Auth & tiers

- **No key** → public **sandbox** tier (rate-limited). Works out of the box.
- **`NVD_API_KEY=ls_live_…`** → your plan's tier. Get a key at
  [newvenuedata.com/signup](https://newvenuedata.com/signup).

| Env var | Default | Purpose |
|---------|---------|---------|
| `NVD_API_KEY` | _(none)_ | Bearer key; unlocks your plan's rate limit & scope. |
| `NVD_API_BASE` | `https://newvenuedata.com/api` | Override the API base (e.g. for local dev). |

## Develop

```bash
npm run smoke    # drives the JSON-RPC handshake and asserts the protocol
npm start        # run the server on stdio (for manual testing)
```

## How it works

MCP stdio transport is newline-delimited JSON-RPC 2.0. This server implements
`initialize`, `tools/list`, and `tools/call` directly (see `src/index.mjs`) — the
same zero-dependency approach as the project's data pipeline. Each tool call proxies
to a documented REST endpoint (`/api/licenses`, `/api/licenses/search`, `/api/stats`).
