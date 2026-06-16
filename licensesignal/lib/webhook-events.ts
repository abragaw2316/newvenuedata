export interface WebhookEvent {
  type: string
  title: string
  description: string
  examplePayload: Record<string, unknown>
}

export const WEBHOOK_EVENTS: WebhookEvent[] = [
  {
    type: 'license.new_filing',
    title: 'New Filing',
    description:
      'Fires the moment a brand-new license application or initial filing is detected in the Florida DBPR source. Use this to catch businesses entering the market before they open — ideal for sales prospecting and territory planning.',
    examplePayload: {
      id: 'evt_8f2a1c9d4b',
      type: 'license.new_filing',
      created: '2026-06-14T13:42:07Z',
      data: {
        license: {
          id: 'lic_3a91f0c2',
          licenseNumber: 'BEV-2026-004821',
          licenseType: 'Quota Beverage (4COP)',
          status: 'pending',
          businessName: 'Coral Gables Wine Bar',
          legalName: 'CGWB Hospitality LLC',
          dbaName: 'The Cellar Room',
          address: {
            street: '2200 Ponce De Leon Blvd',
            city: 'Coral Gables',
            county: 'Miami-Dade',
            state: 'FL',
            zip: '33134',
            lat: 25.7489,
            lng: -80.2589,
          },
          filedDate: '2026-06-14',
          effectiveDate: null,
          sourceUrl: 'https://www.myfloridalicense.com/check/BEV-2026-004821',
        },
      },
    },
  },
  {
    type: 'license.status_change',
    title: 'Status Change',
    description:
      'Fires whenever a license transitions between states — for example pending to active, active to suspended, or active to expired. Includes both the previous and new status so you can react to the exact transition.',
    examplePayload: {
      id: 'evt_b71e44a902',
      type: 'license.status_change',
      created: '2026-06-14T09:15:33Z',
      data: {
        previousStatus: 'pending',
        newStatus: 'active',
        license: {
          id: 'lic_3a91f0c2',
          licenseNumber: 'BEV-2026-004821',
          licenseType: 'Quota Beverage (4COP)',
          status: 'active',
          businessName: 'Coral Gables Wine Bar',
          legalName: 'CGWB Hospitality LLC',
          dbaName: 'The Cellar Room',
          address: {
            street: '2200 Ponce De Leon Blvd',
            city: 'Coral Gables',
            county: 'Miami-Dade',
            state: 'FL',
            zip: '33134',
            lat: 25.7489,
            lng: -80.2589,
          },
          filedDate: '2026-06-14',
          effectiveDate: '2026-06-21',
          sourceUrl: 'https://www.myfloridalicense.com/check/BEV-2026-004821',
        },
      },
    },
  },
  {
    type: 'license.ownership_transfer',
    title: 'Ownership Transfer',
    description:
      'Fires when a license is transferred to a new owner or legal entity. Captures both the prior and incoming entity, making it easy to track acquisitions, ownership changes, and consolidation in a market.',
    examplePayload: {
      id: 'evt_c93d52f117',
      type: 'license.ownership_transfer',
      created: '2026-06-13T17:28:52Z',
      data: {
        previousLegalName: 'Sunshine Spirits Group Inc',
        newLegalName: 'Atlantic Hospitality Partners LLC',
        license: {
          id: 'lic_7d20b8e4',
          licenseNumber: 'BEV-2019-001207',
          licenseType: 'Quota Beverage (4COP)',
          status: 'active',
          businessName: 'Harborside Tavern',
          legalName: 'Atlantic Hospitality Partners LLC',
          dbaName: 'Harborside Tavern',
          address: {
            street: '410 SE 2nd St',
            city: 'Fort Lauderdale',
            county: 'Broward',
            state: 'FL',
            zip: '33301',
            lat: 26.1209,
            lng: -80.1387,
          },
          filedDate: '2019-03-04',
          effectiveDate: '2026-06-13',
          sourceUrl: 'https://www.myfloridalicense.com/check/BEV-2019-001207',
        },
      },
    },
  },
  {
    type: 'license.renewal',
    title: 'Renewal',
    description:
      'Fires when an existing license is renewed for a new term. Use this to confirm a business is staying active and to track renewal cycles across your territory.',
    examplePayload: {
      id: 'evt_d12f8a3e60',
      type: 'license.renewal',
      created: '2026-06-12T11:04:19Z',
      data: {
        previousEffectiveDate: '2025-07-01',
        newEffectiveDate: '2026-07-01',
        license: {
          id: 'lic_5c18a9f3',
          licenseNumber: 'SFS-2021-009934',
          licenseType: 'Food Service Establishment',
          status: 'active',
          businessName: 'Pelican Grill & Raw Bar',
          legalName: 'Pelican Coastal Dining LLC',
          dbaName: 'Pelican Grill',
          address: {
            street: '88 Beach Dr NE',
            city: 'St. Petersburg',
            county: 'Pinellas',
            state: 'FL',
            zip: '33701',
            lat: 27.7745,
            lng: -82.6321,
          },
          filedDate: '2021-05-18',
          effectiveDate: '2026-07-01',
          sourceUrl: 'https://www.myfloridalicense.com/check/SFS-2021-009934',
        },
      },
    },
  },
  {
    type: 'license.cancellation',
    title: 'Cancellation',
    description:
      'Fires when a license is cancelled, revoked, or voluntarily surrendered. A strong signal that a location has closed or is exiting the market — useful for churn detection and competitive monitoring.',
    examplePayload: {
      id: 'evt_e6701b8c5a',
      type: 'license.cancellation',
      created: '2026-06-11T08:47:00Z',
      data: {
        reason: 'voluntary_surrender',
        license: {
          id: 'lic_9b44c1d7',
          licenseNumber: 'BEV-2017-003318',
          licenseType: 'Special Restaurant (SRX)',
          status: 'cancelled',
          businessName: 'Midtown Cantina',
          legalName: 'Midtown Cantina Holdings LLC',
          dbaName: 'Midtown Cantina',
          address: {
            street: '3401 N Miami Ave',
            city: 'Miami',
            county: 'Miami-Dade',
            state: 'FL',
            zip: '33127',
            lat: 25.8108,
            lng: -80.1949,
          },
          filedDate: '2017-09-12',
          effectiveDate: '2026-06-11',
          sourceUrl: 'https://www.myfloridalicense.com/check/BEV-2017-003318',
        },
      },
    },
  },
  {
    type: 'license.address_change',
    title: 'Address Change',
    description:
      'Fires when the registered address on a license is updated, capturing both the old and new locations. Use this to detect relocations and keep your CRM and territory data in sync.',
    examplePayload: {
      id: 'evt_f4825d9013',
      type: 'license.address_change',
      created: '2026-06-10T15:33:41Z',
      data: {
        previousAddress: {
          street: '120 W Adams St',
          city: 'Jacksonville',
          county: 'Duval',
          state: 'FL',
          zip: '32202',
          lat: 30.3294,
          lng: -81.6618,
        },
        license: {
          id: 'lic_2e77f6a1',
          licenseNumber: 'SFS-2023-006650',
          licenseType: 'Food Service Establishment',
          status: 'active',
          businessName: 'Riverside Provisions',
          legalName: 'Riverside Provisions LLC',
          dbaName: 'Riverside Provisions',
          address: {
            street: '2105 Park St',
            city: 'Jacksonville',
            county: 'Duval',
            state: 'FL',
            zip: '32204',
            lat: 30.3142,
            lng: -81.6889,
          },
          filedDate: '2023-02-27',
          effectiveDate: '2026-06-10',
          sourceUrl: 'https://www.myfloridalicense.com/check/SFS-2023-006650',
        },
      },
    },
  },
]
