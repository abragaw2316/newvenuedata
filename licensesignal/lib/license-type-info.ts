export type LicenseCategory =
  | 'Liquor'
  | 'Beer & Wine'
  | 'Package'
  | 'Food Service'
  | 'Mobile'

export interface LicenseType {
  slug: string
  code: string
  name: string
  category: LicenseCategory
  summary: string
  whoFilesIt: string
  whatItSignals: string
  examples: string[]
  relatedCodes: string[]
}

export const LICENSE_TYPES: LicenseType[] = [
  {
    slug: 'srx',
    code: 'SRX',
    name: 'Special Restaurant / Food Service License',
    category: 'Liquor',
    summary:
      'The Special Restaurant (SRX) license — renamed Special Food Service (SFS) under Florida SB 1262 effective July 2023 — permits a qualifying restaurant or food-service venue to serve beer, wine, and full liquor for consumption on premises, conditioned on bona fide food service. SFS/SRX holders must derive at least 51% of gross revenue from food and non-alcoholic beverages and maintain a minimum seating capacity (120 seats and 2,000 sq ft under the 2023 revision; previously 150 seats / 2,500 sq ft). Because it is issued outside the county quota system, SRX/SFS is the most common path to a full bar for a sit-down restaurant.',
    whoFilesIt:
      'Full-service, sit-down restaurants that want to pour spirits, wine, and beer without buying a scarce quota license. Typical filers are independent restaurateurs, regional chains expanding into Florida, and hospitality groups opening a new dining concept that needs a complete bar program.',
    whatItSignals:
      'An SRX/SFS filing is one of the highest-intent signals in the dataset: a real, food-first restaurant with a full bar is being built. The 51%-food and 120-seat thresholds (lowered by SB 1262 in 2023, making SFS more accessible than SRX was) mean these are substantial, capital-intensive venues — prime net-new accounts for spirits, wine, and beer distributors, POS and reservation platforms, FF&E suppliers, and commercial insurance, all selected during the buildout window before opening day.',
    examples: [
      'A new upscale steakhouse in Brickell filing for a 4COP-SFS to run a full cocktail bar',
      'A 140-seat farm-to-table restaurant in Tampa qualifying under the new 120-seat SFS threshold',
      'A national casual-dining chain opening its first Orlando location with a full bar',
    ],
    relatedCodes: ['4cop', 'cop', 'seating', 'food-service'],
  },
  {
    slug: 'cop',
    code: 'COP',
    name: 'Consumption On Premises',
    category: 'Liquor',
    summary:
      'COP refers to the class of Florida DBPR alcoholic-beverage licenses that permit alcohol to be consumed where it is sold — bars, taverns, restaurants, breweries, and clubs. The COP series escalates with privilege: 1COP authorizes beer only, 2COP adds wine, and 3COP/4COP add liquor. The "4COP" tier (full liquor) is generally capped by the county quota system, while special-use codes such as 4COP-SRX sit outside it.',
    whoFilesIt:
      'Any business whose model depends on guests drinking on site: neighborhood bars, cocktail lounges, sports bars, nightclubs, taprooms, and restaurants with a bar component. The specific COP tier a venue files for reveals exactly which beverages it intends to serve.',
    whatItSignals:
      'A new COP venue is an immediate, high-value prospect for beverage distributors, draft-line and glassware installers, and hospitality service providers. The tier number tells a rep precisely which product lines (beer, wine, or full spirits) the new account can stock — letting distributors route the lead to the right book of business before a single competitor calls.',
    examples: [
      'A craft cocktail bar filing for a 4COP to serve a full spirits menu',
      'A neighborhood wine bar applying for a 2COP for beer and wine service',
      'A brewery taproom filing a 1COP to pour its own beer for on-site consumption',
    ],
    relatedCodes: ['4cop', 'srx', 'bev', 'seating'],
  },
  {
    slug: 'bev',
    code: 'BEV',
    name: 'Beverage License',
    category: 'Beer & Wine',
    summary:
      'BEV is the umbrella DBPR category for any license that authorizes the sale of alcoholic beverages in Florida, issued by the Division of Alcoholic Beverages and Tobacco. It spans both on-premises consumption (the COP series) and off-premises package sales (APS), and is most often used in data to describe lower-tier beer-and-wine permits as well as the beverage category as a whole.',
    whoFilesIt:
      'Businesses across the full alcohol spectrum — from restaurants and bars selling beer and wine, to convenience stores, grocers, and package retailers selling sealed product to go. In practice a BEV record frequently represents a beer-and-wine seller that does not need a full-liquor license.',
    whatItSignals:
      'Tracking the entire BEV category gives the most complete possible view of every alcohol-selling business entering a market — not just the headline full-liquor venues. For suppliers of beer and wine specifically, BEV filings surface restaurants, bottle shops, and markets that are exactly the right fit, without the noise of spirits-only prospects.',
    examples: [
      'A new gastropub filing a beer-and-wine BEV permit instead of a full-liquor license',
      'A specialty grocery store adding a beer and wine section',
      'A pizzeria applying for a 2COP beer-and-wine license to serve with dinner',
    ],
    relatedCodes: ['cop', 'aps', 'srx'],
  },
  {
    slug: 'aps',
    code: 'APS',
    name: 'Package Store (Off-Premises)',
    category: 'Package',
    summary:
      'APS is an off-premises (package store) Florida license that permits the sale of sealed alcoholic beverages for consumption away from the location — liquor stores, bottle shops, and package retailers. Alcohol may not be opened or consumed on site. Tiers mirror the COP series: 1APS authorizes beer only and 2APS authorizes beer and wine, while full-liquor package sales require a quota package license.',
    whoFilesIt:
      'Off-premises retailers: standalone liquor and package stores, bottle shops, and the package-sales departments of convenience stores, grocers, and big-box retailers. The APS tier specifies whether the retailer may stock beer only, beer and wine, or full spirits.',
    whatItSignals:
      'A new APS opening is a retail shelf-space and wholesale supply opportunity rather than a hospitality one. The tier tells a distributor precisely which product lines a new retailer can carry, making APS filings ideal leads for wholesalers, merchandisers, shelving and refrigeration vendors, and POS providers targeting off-premises retail.',
    examples: [
      'A new neighborhood liquor store filing for a full-liquor package license',
      'A craft bottle shop applying for a 2APS to sell beer and wine to go',
      'A convenience store adding a beer-only package license at a new location',
    ],
    relatedCodes: ['bev', '4cop', 'cop'],
  },
  {
    slug: '4cop',
    code: '4COP',
    name: 'Quota Liquor License',
    category: 'Liquor',
    summary:
      'A 4COP is a full-liquor consumption-on-premises license issued under Florida’s population-based quota system. Because counties may only issue a limited number — roughly one per several thousand residents — 4COP quota licenses are scarce, transferable, and frequently sold on a secondary market for tens of thousands of dollars or more. They allow a venue to serve beer, wine, and spirits without the food-service conditions attached to an SRX.',
    whoFilesIt:
      'Bars, nightclubs, lounges, and standalone drinking establishments that need full-liquor privileges but do not meet (or do not want) the 51%-food and seating requirements of a special restaurant license. Filers also include investors and operators acquiring an existing quota license through transfer.',
    whatItSignals:
      'A 4COP issuance or transfer is a top-tier signal — these businesses have made a major capital commitment, often spending five or six figures just to obtain the license. A transfer typically accompanies a sale of the business or its assets, surfacing ownership changes, distressed venues, and well-funded new operators that are premium prospects for distributors, lenders, brokers, and insurers.',
    examples: [
      'A new nightclub acquiring a quota 4COP license on the secondary market',
      'A hotel bar filing for a full-liquor quota license in a high-population county',
      'An ownership transfer moving an existing 4COP to a new restaurant group',
    ],
    relatedCodes: ['srx', 'cop', 'aps'],
  },
  {
    slug: 'food-service',
    code: 'FOOD_SERVICE',
    name: 'Food Service Establishment Permit',
    category: 'Food Service',
    summary:
      'A food service establishment permit is a license from DBPR’s Division of Hotels and Restaurants required to operate a public food-service establishment in Florida — restaurants, cafes, caterers, and similar venues that prepare and serve food to the public. It is the core operating permit nearly every restaurant must hold, independent of whether the business also sells alcohol.',
    whoFilesIt:
      'Every public food-service operator: full-service and quick-service restaurants, cafes, bakeries, caterers, ghost kitchens, and institutional food providers. Because alcohol is optional but food service is not, this permit is the broadest marker of a new restaurant entering the market.',
    whatItSignals:
      'A food service permit filing marks a brand-new restaurant before it opens — often the earliest detectable window to reach a buyer. It captures the full universe of restaurant openings, including the many concepts that never apply for a liquor license, making it essential for FF&E suppliers, food and produce distributors, POS and payments companies, payroll providers, and commercial real estate teams.',
    examples: [
      'A new fast-casual concept filing its food service permit during buildout',
      'A coffee shop and bakery applying before its grand opening',
      'A catering company registering a new commissary kitchen',
    ],
    relatedCodes: ['seating', 'mobile-food', 'srx'],
  },
  {
    slug: 'seating',
    code: 'SEATING',
    name: 'Seating-Capacity License',
    category: 'Food Service',
    summary:
      'A seating-capacity license is one whose privileges are tied to a verified minimum number of seats — most commonly the 4COP-SRX special restaurant license, which requires roughly 150 seats. DBPR inspects and records the seat count, and that number determines eligibility for full-liquor service under the special restaurant pathway and similar seat-conditioned permits.',
    whoFilesIt:
      'Larger sit-down restaurants and dining venues whose alcohol privileges depend on meeting a seat threshold. Filers are typically full-service restaurants pursuing or maintaining an SRX, where seating capacity is an audited condition of the license.',
    whatItSignals:
      'The recorded seat count is a direct proxy for venue size and revenue potential. It lets sales teams prioritize the largest, highest-revenue restaurant prospects, size beverage and food orders accurately, and segment outreach by capacity — a 220-seat restaurant is a very different account than a 150-seat one, and the seating license makes that visible up front.',
    examples: [
      'A 200-seat restaurant whose SRX is conditioned on its verified seat count',
      'A banquet hall filing with a high seating capacity to qualify for full-liquor service',
      'A multi-room restaurant updating its recorded seat count after an expansion',
    ],
    relatedCodes: ['srx', 'food-service', '4cop'],
  },
  {
    slug: 'mobile-food',
    code: 'MOBILE_FOOD',
    name: 'Mobile Food Dispensing Vehicle',
    category: 'Mobile',
    summary:
      'A mobile food dispensing vehicle (MFDV) is a DBPR-licensed mobile food unit — food trucks, trailers, and carts — authorized to prepare and serve food from a non-fixed location. MFDV operators are licensed by the Division of Hotels and Restaurants and are subject to commissary, plan-review, and inspection requirements, with the license tied to the vehicle rather than a fixed address.',
    whoFilesIt:
      'Mobile food entrepreneurs: food truck and trailer operators, mobile catering businesses, and cart vendors. Many are first-time owners or small operators launching a lower-cost concept, and some later expand into a fixed food-service establishment.',
    whatItSignals:
      'Mobile food filings reveal fast-moving, lower-cost operators that are ideal prospects for equipment, payments and POS, insurance, commissary kitchens, and small-business lending. Because the barrier to entry is low, MFDV volume is a leading indicator of grassroots food-business formation — and a watch list of operators who may graduate to a brick-and-mortar restaurant.',
    examples: [
      'A new taco truck filing for its mobile food dispensing vehicle license',
      'A mobile coffee trailer registering with a shared commissary kitchen',
      'A catering operator adding a second food truck to its fleet',
    ],
    relatedCodes: ['food-service', 'seating'],
  },
  {
    slug: 'temp-permit',
    code: 'TEMP_PERMIT',
    name: 'Temporary Alcoholic Beverage Permit',
    category: 'Liquor',
    summary:
      'A temporary alcoholic beverage permit (issued under DBPR profession code 4002) authorizes the sale of alcohol at a specific event for one, two, or three days. Permitted events include festivals, fundraisers, concerts, sporting events, and private functions at licensed or unlicensed venues. These are single-event, non-renewable permits tied to the event location and date range.',
    whoFilesIt:
      'Event organizers, nonprofits, promoters, and venue operators running a short-term event where alcohol will be sold. Common filers include charity auction organizers, music festival promoters, sports booster clubs, and pop-up event companies.',
    whatItSignals:
      'Temporary permits track every paid alcohol event in Florida, including high-volume events that carry significant liquor-liability exposure and are frequently underinsured. For liquor-liability insurers, each permit represents an account that needs coverage — often from a carrier willing to write event or short-term policies. For distributors and suppliers, permit volume is a leading indicator of event market growth.',
    examples: [
      'A charity gala obtaining a one-day permit to sell wine and beer at a museum',
      'A music festival promoter filing for a three-day permit at an outdoor venue',
      'A sports booster club getting a two-day permit for a tournament beer garden',
    ],
    relatedCodes: ['cop', 'bev'],
  },
  {
    slug: 'manufacturer',
    code: 'MANUFACTURER',
    name: 'Manufacturer / Distributor License',
    category: 'Liquor',
    summary:
      'The manufacturer and distributor category (DBPR profession code 4005) covers Florida-licensed breweries, wineries, craft distilleries, importers, exporters, and wholesale distributors of alcoholic beverages. These licenses allow production, blending, bottling, and/or wholesale distribution of beer, wine, or spirits — activities that require a separate license tier from the retail or on-premises consumption licenses.',
    whoFilesIt:
      'Craft brewery and taproom operators, boutique winery owners, craft distillery founders, wholesale beer and wine distributors, and importers/exporters of spirits. Many filers are small independent producers entering the Florida market.',
    whatItSignals:
      'A new manufacturer license marks a new producer entering the state supply chain — an early signal for hop suppliers, barrel vendors, label printers, compliance consultants, packaging companies, and specialty insurers covering production operations. For distributors, it surfaces potential new brands to carry. The TTB federal license (required before DBPR will issue) often predates the DBPR filing, creating a two-stage early-warning window.',
    examples: [
      'A craft brewery in St. Pete filing for a manufacturer license to distribute kegs wholesale',
      'A boutique distillery in Gainesville obtaining a license to produce and sell spirits on site',
      'A wine importer obtaining a Florida wholesale distribution license',
    ],
    relatedCodes: ['cop', 'bev', 'aps'],
  },
  {
    slug: 'bottle-club',
    code: 'BOTTLE_CLUB',
    name: 'Bottle Club License',
    category: 'Liquor',
    summary:
      'A bottle club license (DBPR profession code 4014) authorizes a BYOB (bring-your-own-bottle) establishment where patrons bring their own sealed alcohol and the venue provides setups — mixers, ice, glassware, and service — for a fee. Bottle clubs do not sell alcohol directly and therefore operate outside the quota system, but they are licensed and inspected by DBPR and carry significant dram-shop exposure because the venue profits from the consumption environment.',
    whoFilesIt:
      'Private club operators, nightclub owners in quota-constrained counties, and venue operators who want to offer alcohol service without holding a direct sales license. Bottle clubs are more common in counties where quota licenses are scarce or prohibitively expensive.',
    whatItSignals:
      'Bottle clubs represent a specialized, high-risk segment: they operate in the gray area between retail and hospitality, often attract late-night or high-volume drinking, and are frequently underserved by standard commercial insurance. For liquor-liability insurers, a new bottle club license is a high-priority lead — these venues need coverage but don\'t always know what product to ask for. For distributors, bottle club patrons are a source of pull-through demand.',
    examples: [
      'A private nightclub in Miami obtaining a bottle club license to operate BYOB in a quota-constrained county',
      'A social club converting to a BYOB model and filing for a bottle club license',
      'A new venue in a rural county using a bottle club license as an alternative to a scarce quota permit',
    ],
    relatedCodes: ['cop', 'bev', 'srx'],
  },
]

export function getLicenseType(slug: string): LicenseType | undefined {
  return LICENSE_TYPES.find((t) => t.slug === slug)
}
