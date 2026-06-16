/* eslint-disable */
// @ts-nocheck
//
// k6 load test for the New Venue Data /api/licenses endpoint.
// -----------------------------------------------------------------------------
// This script requires the k6 load-testing runtime to execute — it is NOT a
// Node.js script and will NOT run under `node`. The `import` specifiers below
// (`k6/http`, `k6`, `k6/metrics`) are resolved by the k6 binary, not npm.
//
// Install k6:   https://k6.io/docs/get-started/installation/
//   macOS:      brew install k6
//   Windows:    choco install k6   (or: winget install k6 --source winget)
//   Linux:      see the k6 docs for your distro
//
// Run it (the app must be serving on BASE_URL, default http://localhost:3000):
//   k6 run load/licenses-load.js
//   k6 run -e BASE_URL=https://staging.newvenuedata.com load/licenses-load.js
//
// CI is expected to run `next build && next start` first, then point BASE_URL
// at that server. Do NOT wire this into `npm test` — it needs the k6 binary.
// -----------------------------------------------------------------------------

import http from 'k6/http'
import { check, sleep, group } from 'k6'
import { Rate, Trend } from 'k6/metrics'

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000'

// Custom metrics for sharper visibility than the built-ins alone.
const errorRate = new Rate('errors')
const listLatency = new Trend('list_latency', true)

export const options = {
  // Ramping VUs: warm up, hold, push, then ramp down.
  stages: [
    { duration: '30s', target: 20 }, // ramp up to 20 virtual users
    { duration: '1m', target: 20 }, // hold at 20
    { duration: '30s', target: 50 }, // push to 50
    { duration: '1m', target: 50 }, // hold at 50
    { duration: '30s', target: 0 }, // ramp down
  ],
  thresholds: {
    // 95th percentile request duration must stay under 500ms.
    http_req_duration: ['p(95)<500'],
    // Custom list-endpoint latency: p95 < 500ms, p99 < 800ms.
    list_latency: ['p(95)<500', 'p(99)<800'],
    // Fewer than 1% of checks may fail.
    errors: ['rate<0.01'],
    // Built-in HTTP failure rate under 1%.
    http_req_failed: ['rate<0.01'],
  },
}

// A spread of realistic filter combinations to exercise the query paths.
const QUERIES = [
  '',
  '?limit=25',
  '?county=Miami-Dade',
  '?license_type=BEV',
  '?status=approved',
  '?event_type=new_filing',
  '?county=Broward&license_type=FOOD_SERVICE',
  '?q=bar&limit=10',
]

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

export default function () {
  group('GET /api/licenses', () => {
    const qs = pick(QUERIES)
    const res = http.get(`${BASE_URL}/api/licenses${qs}`, {
      headers: { Accept: 'application/json' },
      tags: { name: 'list_licenses' },
    })

    listLatency.add(res.timings.duration)

    const ok = check(res, {
      'status is 200': (r) => r.status === 200,
      'has data array': (r) => {
        try {
          const body = r.json()
          return Array.isArray(body.data)
        } catch (_e) {
          return false
        }
      },
      'has pagination': (r) => {
        try {
          return r.json('pagination') !== undefined
        } catch (_e) {
          return false
        }
      },
    })

    // Record failures into the custom error rate so the threshold can gate it.
    errorRate.add(!ok)
  })

  // Small think-time between iterations to model real client pacing.
  sleep(Math.random() * 1 + 0.5)
}
