import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { GET } from './route'

// Absolute path to the published OpenAPI document that the docs site serves.
const OPENAPI_PATH = fileURLToPath(
  new URL('../../../public/openapi.json', import.meta.url)
)

const openapi = JSON.parse(readFileSync(OPENAPI_PATH, 'utf-8')) as {
  paths: Record<string, unknown>
  components: { schemas: Record<string, { properties: Record<string, unknown> }> }
}

const LICENSE_SCHEMA_PROPS = openapi.components.schemas.License.properties
const ADDRESS_SCHEMA_PROPS = openapi.components.schemas.Address.properties

async function callList(query = ''): Promise<{
  data: unknown[]
  pagination: {
    cursor: string | null
    hasMore: boolean
    total: number
    limit: number
  }
}> {
  const res = await GET(new Request(`https://example.com/api/licenses${query}`))
  expect(res.status).toBe(200)
  return res.json()
}

describe('OpenAPI document', () => {
  it('declares the /licenses path', () => {
    expect(openapi.paths).toHaveProperty('/licenses')
    expect(openapi.paths['/licenses']).toHaveProperty('get')
  })

  it('declares the License schema with the documented properties', () => {
    expect(openapi.components.schemas).toHaveProperty('License')
    for (const prop of [
      'id',
      'licenseNumber',
      'licenseType',
      'status',
      'businessName',
      'address',
      'filedDate',
      'eventType',
    ]) {
      expect(LICENSE_SCHEMA_PROPS).toHaveProperty(prop)
    }
  })

  it('declares the Address schema with county/city/state', () => {
    expect(openapi.components.schemas).toHaveProperty('Address')
    for (const prop of ['city', 'county', 'state']) {
      expect(ADDRESS_SCHEMA_PROPS).toHaveProperty(prop)
    }
  })
})

describe('GET /api/licenses contract', () => {
  it('returns a JSON body with a data array and pagination object', async () => {
    const body = await callList()
    expect(Array.isArray(body.data)).toBe(true)
    expect(body.data.length).toBeGreaterThan(0)
    expect(body.pagination).toBeTypeOf('object')
    expect(body.pagination).not.toBeNull()
  })

  it('each item conforms to the documented License schema shape', async () => {
    const body = await callList()

    for (const item of body.data as Array<Record<string, unknown>>) {
      // Every documented License property the task calls out must be present
      // with the documented primitive type.
      expect(typeof item.id).toBe('string')
      expect(typeof item.licenseNumber).toBe('string')
      expect(typeof item.licenseType).toBe('string')
      expect(typeof item.status).toBe('string')
      expect(typeof item.businessName).toBe('string')
      expect(typeof item.filedDate).toBe('string')
      expect(typeof item.eventType).toBe('string')

      // licenseType / eventType must be within the OpenAPI-declared enums.
      const licenseTypeEnum = (
        LICENSE_SCHEMA_PROPS.licenseType as { enum: string[] }
      ).enum
      const eventTypeEnum = (LICENSE_SCHEMA_PROPS.eventType as { enum: string[] })
        .enum
      expect(licenseTypeEnum).toContain(item.licenseType)
      expect(eventTypeEnum).toContain(item.eventType)

      // Address with the documented county/city/state.
      const address = item.address as Record<string, unknown>
      expect(address).toBeTypeOf('object')
      expect(address).not.toBeNull()
      expect(typeof address.county).toBe('string')
      expect(typeof address.city).toBe('string')
      expect(typeof address.state).toBe('string')
    }
  })

  it('pagination matches the documented Pagination schema', async () => {
    const body = await callList()
    const { cursor, hasMore, total, limit } = body.pagination

    // cursor is string | null per the OpenAPI ["string","null"] type.
    expect(cursor === null || typeof cursor === 'string').toBe(true)
    expect(typeof hasMore).toBe('boolean')
    expect(typeof total).toBe('number')
    expect(typeof limit).toBe('number')

    // Relationship assertions that must hold for any real page.
    expect(total).toBeGreaterThanOrEqual(body.data.length)
    expect(body.data.length).toBeLessThanOrEqual(limit)
    if (hasMore) {
      expect(typeof cursor).toBe('string')
    } else {
      expect(cursor).toBeNull()
    }
  })

  it('honors the limit parameter and exposes a usable next cursor', async () => {
    const firstPage = await callList('?limit=5')
    expect(firstPage.pagination.limit).toBe(5)
    expect(firstPage.data.length).toBeLessThanOrEqual(5)

    if (firstPage.pagination.hasMore) {
      expect(firstPage.pagination.cursor).toBeTypeOf('string')
      const nextPage = await callList(
        `?limit=5&cursor=${encodeURIComponent(firstPage.pagination.cursor as string)}`
      )
      expect(Array.isArray(nextPage.data)).toBe(true)
      // Totals are stable across pages of the same query.
      expect(nextPage.pagination.total).toBe(firstPage.pagination.total)
    }
  })
})
