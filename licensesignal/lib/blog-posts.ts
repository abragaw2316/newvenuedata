export type BlogBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'quote'; text: string }
  | { type: 'list'; items: string[] }

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  category: string
  author: string
  authorRole: string
  date: string
  readingMinutes: number
  content: BlogBlock[]
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'florida-dram-shop-law-why-new-licenses-are-insurance-leads',
    title: 'Florida’s dram-shop law and why every new liquor license is an insurance lead',
    excerpt:
      'Florida is a limited dram-shop state — but “limited” is not the same as low-risk. Here’s what Statute 768.125 actually says, why new venues still have to insure, and why the license filing is the cleanest buying signal in the market.',
    category: 'Compliance',
    author: 'Daniel Hsu',
    authorRole: 'Markets & Compliance',
    date: 'June 12, 2026',
    readingMinutes: 8,
    content: [
      {
        type: 'p',
        text: 'Every week, hundreds of Florida venues are licensed to serve alcohol — and each one quietly becomes an insurance prospect. To see why, you have to understand Florida’s dram-shop law, which is narrower than most people assume yet still carries seven-figure exposure. For a liquor-liability agent, that gap between “narrow liability” and “real risk” is exactly where new business lives.',
      },
      { type: 'h2', text: 'What Florida Statute 768.125 actually says' },
      {
        type: 'p',
        text: 'Florida is a “limited” dram-shop state. Under Florida Statute §768.125, a business that serves alcohol to a person of lawful drinking age generally does not become liable for injury or damage that person later causes while intoxicated. That default rule protects the typical bar or restaurant in the typical case.',
      },
      {
        type: 'p',
        text: 'There are two narrow exceptions, both spelled out in the statute: a vendor may be liable if it willfully serves someone under 21, or if it knowingly serves a person “habitually addicted” to alcohol. Both are high bars — the addiction exception in particular requires that the vendor actually knew, not merely suspected, that the patron was habitually addicted.',
      },
      { type: 'h2', text: '“Limited” is not the same as “low risk”' },
      {
        type: 'p',
        text: 'A narrow statute does not mean small claims. Florida venues still get sued and still settle for serious money. In the Faircloth litigation, a Tallahassee bar drew a $28.6 million jury verdict for serving an underage patron — a verdict later reversed on appeal. And in March 2024, the Florida Supreme Court (No. SC2022-0910) held that a §768.125 claim is a negligence action, which means defendant venues can raise comparative-fault defenses and apportion blame to the patron and to other vendors.',
      },
      {
        type: 'p',
        text: 'Even when a venue ultimately prevails, defending a dram-shop claim can run into the tens of thousands of dollars. A single over-service incident involving a minor can be catastrophic. “Limited” describes when liability attaches — not how much is at stake when it does.',
      },
      { type: 'h2', text: 'Why new venues buy coverage even though the state doesn’t require it' },
      {
        type: 'p',
        text: 'Here is the part agents should say out loud: no Florida statute requires a venue to carry liquor-liability insurance. It is mandatory in practice, not by law. Standard general-liability policies exclude alcohol-related claims, so liquor liability is a separate policy. And local licensing authorities, commercial landlords, and lenders almost always require proof of that coverage before a venue can open its doors.',
      },
      {
        type: 'p',
        text: 'That practical requirement is the whole reason the new-license moment matters. The week a venue’s alcohol license becomes public is the same week a landlord or lender is about to demand a certificate of insurance — and the venue has no incumbent agent yet.',
      },
      { type: 'h2', text: 'What it costs, and where these risks get placed' },
      {
        type: 'p',
        text: 'Premiums vary widely with the venue’s risk profile. A low-volume beer-and-wine spot that closes early might pay a few hundred to a couple thousand dollars a year; a full bar sits higher; and a late-night, high-alcohol nightclub can run well into five figures annually. The biggest drivers are alcohol as a percentage of revenue, closing time, entertainment, and claims history.',
      },
      {
        type: 'p',
        text: 'Many bars and nightclubs cannot get coverage from standard “admitted” carriers at all and instead land in the excess-and-surplus (E&S) market, placed through specialty wholesale brokers. That concentration is useful intelligence: the agents and wholesalers who work the E&S hospitality market are precisely the buyers a new-venue feed serves.',
      },
      { type: 'h2', text: 'Why the license filing is the signal' },
      {
        type: 'p',
        text: 'A newly issued alcohol license is the cleanest buying trigger in this market. The venue is legally about to start serving, it has no agent relationship to displace, and a coverage requirement is about to land on it from a landlord or lender. The agent who reaches the owner the week the license posts is in the conversation before the policy is bound — and before competitors even know the venue exists.',
      },
      {
        type: 'p',
        text: 'The scale underneath this is enormous. The National Restaurant Association projects Florida’s eating-and-drinking places at roughly $206 billion in total economic output supporting about 1.49 million jobs in 2025, and Florida set an all-time tourism record with 143 million visitors in 2024 (Executive Office of the Governor / VISIT FLORIDA). That demand is why new venues keep filing, week after week.',
      },
      {
        type: 'quote',
        text: 'A new liquor license is the moment a venue’s insurance need becomes real — and the moment an agent can win the account before anyone else does.',
      },
      {
        type: 'p',
        text: 'That is the entire premise behind monitoring license filings in real time instead of reading a stale monthly list: reach the owner inside the window where the decision is genuinely live, with the one product the state effectively requires them to buy.',
      },
    ],
  },
  {
    slug: 'what-liquor-liability-costs-in-florida',
    title: 'What liquor liability costs in Florida — and what actually drives the premium',
    excerpt:
      'Florida liquor-liability premiums range from a few hundred dollars to five figures a year. Here is the real spread, the underwriting factors that move it, and why so many bars end up in the surplus-lines market.',
    category: 'Market Intel',
    author: 'Daniel Hsu',
    authorRole: 'Markets & Compliance',
    date: 'June 10, 2026',
    readingMinutes: 7,
    content: [
      {
        type: 'p',
        text: 'Every new venue owner asks the same question, and so does every agent quoting one: what does liquor liability actually cost in Florida? The honest answer is that it varies more than almost any other line — but the spread is predictable once you know what underwriters look at. Here is the real picture, drawn from current Florida carrier and agency sources.',
      },
      { type: 'h2', text: 'The ranges' },
      {
        type: 'p',
        text: 'Florida liquor-liability premiums broadly track the venue’s alcohol risk. Industry and agency sources in 2025–2026 put a low-volume, beer-and-wine spot that closes early in roughly the $300–$1,500 a year range; a full bar that stays open past midnight around $2,500–$4,000; and a late-night sports bar or nightclub anywhere from $5,000 to well over $10,000 a year for liquor liability alone. Treat these as directional ranges, not quotes — the actual number swings with the specifics below.',
      },
      { type: 'h2', text: 'What drives the premium' },
      {
        type: 'p',
        text: 'A handful of factors do most of the work in pricing a policy:',
      },
      {
        type: 'list',
        items: [
          'Alcohol as a share of revenue: once liquor sales cross roughly 35–50% of total revenue, most carriers stop treating the business as a restaurant and reclassify it as a bar — a step change in price and availability.',
          'Hours of operation: carriers commonly load premiums meaningfully for operations that close after midnight, when over-service and incident risk climbs.',
          'Entertainment and crowd: live music, DJs, dancing, cover charges, and bottle service all raise the rate; so does weak security or a history of assault-and-battery claims.',
          'Claims history: a clean three-year loss record is one of the strongest levers a venue has on its premium.',
        ],
      },
      {
        type: 'p',
        text: 'Coverage limits are fairly standard — most bars and nightclubs carry $1M per incident and $2M aggregate — but the cost of getting there is not. And the defense tail matters: Florida sources note that defending a single liquor-liability claim can run $50,000–$100,000 even when the case is ultimately dismissed.',
      },
      { type: 'h2', text: 'Why so many bars end up in surplus lines' },
      {
        type: 'p',
        text: 'Standard “admitted” carriers decline a lot of bar and nightclub risk outright, or exclude post-midnight operations. As a result, much of this business is placed in the excess-and-surplus (E&S) market through specialty wholesale brokers. Trade reporting in 2026 (Insurance Journal) describes a hard market for high-alcohol venues — assault-and-battery sublimits cut from $1M down to $250,000–$500,000, firearms exclusions becoming standard, and rising deductibles — while venues with under ~40% alcohol sales are starting to see more competition.',
      },
      {
        type: 'quote',
        text: 'High premiums and a hard market mean one thing for an agent: the new venue that just got licensed is a valuable account — and the one most worth reaching first.',
      },
      {
        type: 'p',
        text: 'That is why timing beats volume in this line. A venue that just filed for its alcohol license is about to need coverage it can’t easily get, has no incumbent agent, and is exactly the account a specialist can win. The price complexity is the opportunity.',
      },
    ],
  },
  {
    slug: 'how-agents-find-new-venues',
    title: 'How insurance agents find new venues — and why the license filing beats every list',
    excerpt:
      'Referrals, cold calls, and purchased lists all chase the same accounts. The agents who win new venues do one thing differently: they get there first, on a timing trigger instead of a stale list.',
    category: 'Playbook',
    author: 'Mara Quinn',
    authorRole: 'Head of Data Science',
    date: 'June 8, 2026',
    readingMinutes: 6,
    content: [
      {
        type: 'p',
        text: 'Ask ten commercial-lines agents how they find new bars and restaurants and you’ll hear the same four answers. Each works — and each has the same blind spot.',
      },
      { type: 'h2', text: 'The usual playbook' },
      {
        type: 'list',
        items: [
          'Referrals: the highest-converting channel — referred leads are widely cited as closing several times faster than cold ones — but slow and capacity-limited.',
          'Cold calling the owner’s mobile: still the highest-leverage outbound channel for local commercial lines, usually sequenced with email and LinkedIn.',
          'Purchased B2B lists: business-owner lists “fortified by federal, state, and county records,” worked by phone and direct mail.',
          'X-date lists: prospect lists sorted by renewal month, so an agent can reach a business just before its policy renews.',
        ],
      },
      {
        type: 'p',
        text: 'Notice what the best of these have in common. The X-date list works because of timing — it puts the agent in front of the buyer at the moment the decision is live. That instinct is exactly right; it’s just pointed at renewals of businesses that already exist.',
      },
      { type: 'h2', text: 'Timing is the edge — and a new license is the cleanest trigger' },
      {
        type: 'p',
        text: 'A newly issued alcohol license is a better timing signal than any renewal date. The venue is legally about to start serving, a landlord or lender is about to require proof of coverage, and — unlike a renewal — there is no incumbent agent to displace. It is an X-date for a policy that hasn’t been written yet.',
      },
      {
        type: 'p',
        text: 'The catch has always been latency. Purchased lists and generic “new business” feeds are delivered weekly or monthly, so by the time a name appears, the buildout decisions — including the first insurance call — may already be made. A venue that opened three months ago is not a fresh lead; it’s a competitor’s account.',
      },
      { type: 'h2', text: 'Why the filing wins' },
      {
        type: 'p',
        text: 'Florida publishes its liquor- and food-service license filings as public records, updated daily. Surfacing them the day they post turns the best instinct in insurance prospecting — reach the buyer when the decision is live — into a repeatable, same-week motion: the alert fires, a rep is assigned, and first contact happens before the venue is on anyone else’s list.',
      },
      {
        type: 'quote',
        text: 'Referrals and lists chase the same accounts. The agent who reaches a venue the week its license posts isn’t competing for the account yet — they’re defining it.',
      },
    ],
  },
  {
    slug: 'how-fast-new-florida-restaurants-choose-vendors',
    title: 'How fast do new Florida restaurants choose their vendors?',
    excerpt:
      'We tracked the vendor-selection window for 1,400 new Florida food-service operators. The honest answer surprised even our own sales team — most decisions are locked before the doors ever open.',
    category: 'Data',
    author: 'Mara Quinn',
    authorRole: 'Head of Data Science',
    date: 'May 28, 2026',
    readingMinutes: 9,
    content: [
      {
        type: 'p',
        text: 'Everyone selling into hospitality has a theory about timing. Distributors swear the first week after opening is golden. POS reps insist they need to be in the conversation months ahead. Payroll providers assume they have until the first paycheck clears. They cannot all be right — so we went looking for the actual numbers.',
      },
      {
        type: 'p',
        text: 'Between January 2025 and March 2026 we matched 1,432 net-new Florida food-service and beverage license filings against the first confirmed vendor relationship we could observe across point-of-sale, merchant processing, beverage distribution, and commercial linen. The window we care about is simple: how many days pass between the license filing and the operator committing to a vendor in each category?',
      },
      { type: 'h2', text: 'The headline number: 31 days' },
      {
        type: 'p',
        text: 'The median new restaurant in our sample had selected its core operating vendors within 31 days of the license filing. Not 31 days after opening — 31 days after the filing, which itself typically lands 8 to 14 weeks before the grand opening. By the time the soft launch happens, the most lucrative recurring-revenue decisions are already made.',
      },
      {
        type: 'p',
        text: 'That single fact reframes the entire timing debate. The operator who is "too busy with buildout to take your call" has, in practice, already signed three or four vendor agreements while doing exactly that buildout. The buildout phase is not a dead zone. It is the buying season.',
      },
      { type: 'h2', text: 'Where the variance hides' },
      {
        type: 'p',
        text: 'The median tells a clean story, but the spread is where the strategy lives. We saw clear differences by category in how early the commitment locks in:',
      },
      {
        type: 'list',
        items: [
          'Point-of-sale and payments: median 19 days from filing — the earliest commitment, because the operator needs it to accept the first dollar.',
          'Beverage distribution: median 26 days, clustered tightly around the license approval rather than the filing.',
          'Food and dry-goods suppliers: median 34 days, often a multi-vendor decision that takes a few rounds.',
          'Payroll and HR: median 58 days — the longest runway, and the category most often won by whoever simply called first.',
        ],
      },
      {
        type: 'p',
        text: 'Payroll is the outlier worth dwelling on. It is the one core decision that genuinely can wait until staffing ramps, which means the field is wide open for weeks. Yet most payroll providers we talked to discover a new restaurant three to six months late, when someone finally Googles "payroll service near me." First contact, in our data, converts roughly three times better than second.',
      },
      { type: 'h2', text: 'Why the filing beats the opening as a trigger' },
      {
        type: 'p',
        text: 'The instinct to wait for an opening is understandable — an open restaurant is visibly real, easy to walk into, easy to verify. But by the time it is visibly real, you are competing against vendors who reached the owner during a quieter, more receptive moment. The filing is the earliest legally public, structurally reliable signal that a specific named business is about to start spending. It is the moment the buying window opens, not the moment it closes.',
      },
      {
        type: 'quote',
        text: 'The buildout phase is not a dead zone before the buying starts. It is the buying season. By opening night, the recurring-revenue decisions are already booked.',
      },
      {
        type: 'p',
        text: 'There is a second-order effect, too. Operators remember who showed up early. The distributor who called during permitting — before the chaos of opening week — is the one who gets the benefit of the doubt when a delivery slips six months later. Early contact is not just a conversion lever; it is a retention lever.',
      },
      { type: 'h2', text: 'What this means for your outreach cadence' },
      {
        type: 'p',
        text: 'If your team is built around walking into open restaurants, you are systematically arriving in the bottom half of the timing distribution. The teams that win the most net-new accounts treat the license filing as a same-week event: alert fires, a rep is assigned, and first contact happens inside the 19-to-34-day window where the decision is genuinely live. That is the entire premise behind monitoring filings in real time rather than reading a stale monthly export.',
      },
    ],
  },
  {
    slug: 'what-a-liquor-license-filing-actually-tells-you',
    title: 'What a liquor license filing actually tells you',
    excerpt:
      'A new SRX or COP filing is more than a name and an address. Read it correctly and a single record tells you the business model, the buildout budget, and roughly when the doors open.',
    category: 'Playbook',
    author: 'Devon Hale',
    authorRole: 'Founder & CEO',
    date: 'May 19, 2026',
    readingMinutes: 8,
    content: [
      {
        type: 'p',
        text: 'Most people glance at a Florida liquor license filing and see two useful fields: a business name and a street address. That is leaving ninety percent of the signal on the table. A filing is a structured declaration of intent, and once you know how to read the codes, a single record tells you what kind of business is coming, how much it is likely to spend, and how soon.',
      },
      { type: 'h2', text: 'The license type is the business model' },
      {
        type: 'p',
        text: 'Florida\'s Division of Alcoholic Beverages and Tobacco issues license types that map almost perfectly onto operating models. You do not need to guess what a business is — the code tells you.',
      },
      {
        type: 'list',
        items: [
          'SRX: a special restaurant license for spirituous liquor. This is a full-service restaurant that must derive at least 51% of revenue from food. It implies a real kitchen, a seated dining room, and a meaningful FF&E budget.',
          'COP (4COP / quota): consumption on premises with a full liquor quota. This is a bar, nightclub, or high-volume beverage venue. The quota license itself is expensive, which tells you the operator is well-capitalized.',
          'BEV (1APS / 2APS / 2COP): beer and wine only. Lower barrier, often a cafe, fast-casual concept, bottle shop, or neighborhood spot.',
          'SFS / catering: food service or catering establishments, frequently signaling commissary kitchens and off-premise operations.',
        ],
      },
      {
        type: 'p',
        text: 'A beverage distributor reads SRX and immediately knows there is a wine list to win. A linen supplier reads SRX and sees white tablecloths. A POS company reads 4COP and prices for high transaction volume and tab management. Same record, three different qualified leads — because the type field did the qualification for you.',
      },
      { type: 'h2', text: 'Status tells you where in the journey they are' },
      {
        type: 'p',
        text: 'A filing moves through states: pending, approved, active, and occasionally suspended or cancelled. The transition matters more than the snapshot. A pending application is an operator who has committed capital but has not opened — the highest-leverage moment for vendor outreach. An approved-but-not-yet-active record usually means opening is weeks away. Watching the status change is how you time the call rather than guess at it.',
      },
      {
        type: 'quote',
        text: 'A license filing is not a name and an address. It is a structured declaration of intent — business model, budget tier, and timeline, all encoded in fields most people never read.',
      },
      { type: 'h2', text: 'The address is a segmentation key, not just a destination' },
      {
        type: 'p',
        text: 'The address does more than tell your rep where to drive. Cross-referenced with the surrounding parcels, it reveals whether this is a standalone restaurant, a tenant in a new mixed-use development, or part of a cluster of openings. Clusters matter: when three filings land within a few blocks over a single quarter, you are looking at a neighborhood that is turning over, and the next ten openings are probably coming to the same corridor.',
      },
      { type: 'h2', text: 'What a filing cannot tell you (and why that is fine)' },
      {
        type: 'p',
        text: 'A filing will not hand you the owner\'s personal cell phone or their projected first-year revenue. It is business-entity data, not consumer data, and that distinction is the entire point — it keeps the signal clean, public, and usable for B2B prospecting without wading into regulated personal-data territory. What the filing gives you is better than a guess: a named business, a model, a budget tier, and a timeline, all sourced from the public record.',
      },
      { type: 'h2', text: 'Putting it together' },
      {
        type: 'p',
        text: 'The discipline is to stop treating filings as a list of names and start treating each one as a small dossier. Type plus status plus location plus filing date gives you a qualified, timed, segmented lead before you have spoken a single word to the operator. That is the difference between cold calling a phone book and calling exactly the right business at exactly the right moment.',
      },
    ],
  },
  {
    slug: 'building-a-real-time-prospecting-pipeline-on-license-data',
    title: 'Building a real-time prospecting pipeline on license data',
    excerpt:
      'A practical architecture for turning raw Florida license filings into scored, routed, CRM-ready leads — using webhooks, enrichment, and a dead-simple scoring model your reps will actually trust.',
    category: 'Engineering',
    author: 'Priya Nair',
    authorRole: 'Staff Engineer',
    date: 'May 12, 2026',
    readingMinutes: 11,
    content: [
      {
        type: 'p',
        text: 'There is a meaningful gap between "we have access to license data" and "our reps get a scored lead in Slack ninety seconds after a relevant business files." This post walks through the pipeline we recommend to customers building the second thing. None of it is exotic; the value is in the sequencing and in resisting the urge to over-engineer.',
      },
      { type: 'h2', text: 'Stage one: ingest via webhooks, not polling' },
      {
        type: 'p',
        text: 'The first instinct is usually to schedule a nightly job that pulls the day\'s filings. It works, but it bakes in up to twenty-four hours of latency on a signal whose entire value is freshness. Register a webhook instead. Filter at the source — by county, license type, and event type — so your endpoint only ever wakes up for filings you actually care about.',
      },
      {
        type: 'list',
        items: [
          'Subscribe to new_filing and ownership_transfer events; skip renewals unless you sell retention or compliance services.',
          'Scope the subscription to your territories at registration time so you are not paying to process Panhandle filings your Miami team will never touch.',
          'Return a 200 immediately and push the payload onto a queue. Never do enrichment or scoring inside the webhook handler — a slow handler causes retries and duplicate processing.',
        ],
      },
      { type: 'h2', text: 'Stage two: deduplicate before you do anything else' },
      {
        type: 'p',
        text: 'Public records are messy. The same business can surface as a pending filing, then an approval, then a status change, generating three events for one real-world lead. Deduplicate on a stable key — the license record ID, falling back to a normalized business-name-plus-address hash. Collapsing these early prevents your reps from getting pinged three times about the same restaurant, which is the fastest way to lose their trust in the system.',
      },
      { type: 'h2', text: 'Stage three: enrich, but only with what changes the decision' },
      {
        type: 'p',
        text: 'Enrichment is where pipelines go to die. The temptation is to bolt on every data source you can find. Resist it. Add only the fields that change whether a rep should act and how fast. In practice that is a short list: a website or phone where available, a NAICS or category code to confirm the segment, and the surrounding-cluster context that tells you whether this is an isolated opening or part of a wave.',
      },
      {
        type: 'quote',
        text: 'Enrichment is where pipelines go to die. Add only the fields that change whether a rep acts, and how fast. Everything else is latency you are paying for with no return.',
      },
      { type: 'h2', text: 'Stage four: a scoring model your reps will trust' },
      {
        type: 'p',
        text: 'You do not need machine learning here, and using it early will actively hurt you because reps cannot reason about why a black box ranked one lead above another. Start with a transparent additive score everyone can read off a single page:',
      },
      {
        type: 'list',
        items: [
          'License type weight: full-liquor SRX or 4COP scores higher for a beverage distributor than a beer-and-wine cafe.',
          'Recency: a filing from today outscores one from three weeks ago, because the buying window is open widest right now.',
          'Territory fit: in-territory beats adjacent beats out-of-region.',
          'Cluster bonus: a filing inside an active opening cluster gets a lift, since corridors in turnover convert better.',
        ],
      },
      {
        type: 'p',
        text: 'The point of a legible model is not accuracy in the abstract; it is adoption. A rep who understands why a lead scored 84 will work it. A rep handed a mysterious "AI score" of 0.71 will quietly ignore the whole feed within two weeks.',
      },
      { type: 'h2', text: 'Stage five: route to where the work already happens' },
      {
        type: 'p',
        text: 'The final stage is delivery, and the rule is simple: meet reps where they already work. Push high-scoring leads into your CRM as records and into the channel your team lives in — a Slack message, an email digest, a task in the sales tool — with the score and the two or three reasons it scored that way. Do not build a new dashboard nobody logs into. The pipeline\'s job ends the moment a human sees the right lead in the place they were already looking.',
      },
      { type: 'h2', text: 'What good looks like' },
      {
        type: 'p',
        text: 'When this is wired correctly, the elapsed time from a business filing its license to a named rep seeing a scored, contextualized lead is measured in minutes, not days. That latency is the whole game. Every hour you shave off is an hour of head start on the next vendor who is still waiting for the restaurant to physically open before they notice it exists.',
      },
    ],
  },
  {
    slug: 'fcra-safe-b2b-data-what-business-entity-data-means',
    title: 'FCRA-safe B2B data: what business-entity data means',
    excerpt:
      'License filings are public business records, not consumer credit data. Here is the distinction that keeps your prospecting clean, why it matters, and the questions to ask any data vendor before you buy.',
    category: 'Compliance',
    author: 'Renata Cole',
    authorRole: 'General Counsel',
    date: 'May 6, 2026',
    readingMinutes: 7,
    content: [
      {
        type: 'p',
        text: 'When a data company tells you their feed is "FCRA-safe," it is worth understanding exactly what that claim does and does not mean — because the phrase gets used loosely, and the difference between business-entity data and consumer data is not a technicality. It determines what you can legally do with the records and how much regulatory exposure you are taking on.',
      },
      { type: 'h2', text: 'What the FCRA actually governs' },
      {
        type: 'p',
        text: 'The Fair Credit Reporting Act regulates consumer reports — information about individuals used to make decisions about their eligibility for credit, employment, insurance, and housing. It exists to protect people. The moment data is used to judge a person\'s creditworthiness or fitness for a job, FCRA obligations attach: permissible purpose, accuracy requirements, dispute rights, and adverse-action notices.',
      },
      {
        type: 'p',
        text: 'License filings are not that. A Florida liquor or food-service license is a record about a business entity — its operating authority, its license type, its status, its location. It is generated by a state agency as part of public regulatory administration. Using it to decide which restaurant to pitch is a B2B sales activity, not a consumer-eligibility decision, and it sits well outside the FCRA\'s scope.',
      },
      { type: 'h2', text: 'Why the distinction protects you' },
      {
        type: 'p',
        text: 'This is not lawyer theater. The classification changes your operational reality in concrete ways.',
      },
      {
        type: 'list',
        items: [
          'No permissible-purpose requirement: you do not need a consumer\'s authorization to prospect a business, because no consumer report is involved.',
          'No adverse-action machinery: declining to pitch a business is not an adverse action against a person, so you owe no notices.',
          'Cleaner vendor diligence: a feed built only from public business-entity records carries a fundamentally different risk profile than one blending in scraped personal data.',
        ],
      },
      {
        type: 'quote',
        text: 'A license filing is a record about a business, generated by a state agency for public regulatory administration. Prospecting on it is a B2B sales activity, not a consumer-eligibility decision.',
      },
      { type: 'h2', text: 'Where it gets murky — and how to stay clean' },
      {
        type: 'p',
        text: 'The line blurs the instant a vendor enriches business records with personal data about the owner: their personal credit, home address, or background information. At that point you may be assembling something that starts to look like a consumer report, and the comfortable B2B classification can erode. The discipline is to keep the dataset entity-centric. Information about the business is fine. Information about the human as an individual consumer is a different legal category, and you should know exactly when you have crossed into it.',
      },
      { type: 'h2', text: 'Questions to ask any data vendor' },
      {
        type: 'p',
        text: 'Before you sign with any provider that claims to be compliant, get straight answers to four questions:',
      },
      {
        type: 'list',
        items: [
          'What is the source of record, and is it a public government dataset?',
          'Does the feed include any personal data about individuals, or is it strictly business-entity data?',
          'How is data kept accurate and current, and what is the correction process for stale records?',
          'Will the vendor represent in writing that the data is not a consumer report and is not furnished for FCRA-covered purposes?',
        ],
      },
      { type: 'h2', text: 'The bottom line' },
      {
        type: 'p',
        text: 'Public license data is one of the cleanest inputs available for B2B prospecting precisely because of what it is not: it is not consumer credit data, it is not behavioral tracking, and it is not scraped personal information. It is the government\'s own public record of which businesses are licensed to operate. Built and used correctly, it lets you prospect aggressively while staying firmly on the right side of the line. None of this is legal advice — talk to your own counsel about your specific use — but the underlying distinction is sound and worth building your program around.',
      },
    ],
  },
  {
    slug: 'florida-2026-hospitality-opening-trends',
    title: "Florida's 2026 hospitality opening trends",
    excerpt:
      'Filing velocity through the first half of 2026 points to a record year for Florida hospitality — but the growth is concentrating in places the headlines are not watching. Here is what the data shows.',
    category: 'Market Intel',
    author: 'Mara Quinn',
    authorRole: 'Head of Data Science',
    date: 'April 30, 2026',
    readingMinutes: 10,
    content: [
      {
        type: 'p',
        text: 'Filing velocity — the rate at which new license applications hit the public record — is the leading indicator we trust most for where Florida hospitality is heading. It moves months ahead of openings, ribbon-cuttings, and the trend pieces that follow them. Halfway through 2026, the signal is loud, and the most interesting part of it is not where you would expect.',
      },
      { type: 'h2', text: 'The macro picture: a record-pace year' },
      {
        type: 'p',
        text: 'New food-service and beverage filings across the state are running meaningfully ahead of 2025\'s pace through the first five months of the year. If the second half holds the trend, 2026 will be the strongest year for new hospitality formation Florida has seen in the period we track. The post-2024 normalization that a lot of analysts predicted simply has not shown up in the filing data.',
      },
      { type: 'h2', text: 'Where the growth is actually concentrating' },
      {
        type: 'p',
        text: 'The headline markets — South Beach, downtown Miami, the established Orlando tourist corridors — are growing, but at the slowest relative rates in the state. They are mature; there is only so much room left. The acceleration is happening in second-tier and inland markets that rarely make the national write-ups.',
      },
      {
        type: 'list',
        items: [
          'The I-4 corridor between Tampa and Orlando is filing at well above the statewide growth rate, driven by suburban full-service concepts following residential rooftops.',
          'Southwest Florida — Fort Myers, Cape Coral, and the surrounding county — continues a multi-year run of beverage and food-service formation tied to sustained population inflow.',
          'Northeast Florida around Jacksonville is quietly one of the fastest-growing beverage markets in the state, with new COP and BEV filings clustering in revitalizing urban-core neighborhoods.',
          'Smaller inland county seats are posting outsized percentage growth off small bases — the kind of early signal that precedes a corridor genuinely turning over.',
        ],
      },
      {
        type: 'quote',
        text: 'The headline markets are growing at the slowest relative rates in the state. The real acceleration is inland and second-tier — exactly where the national coverage is not looking.',
      },
      { type: 'h2', text: 'A shift in the mix toward full-service liquor' },
      {
        type: 'p',
        text: 'It is not just the volume that is moving — it is the composition. The share of full-liquor SRX and quota COP filings is climbing relative to beer-and-wine-only formats compared with a year ago. That mix shift matters: full-liquor concepts carry larger buildout budgets, deeper beverage programs, and longer vendor lists. For anyone selling into the segment, the average new account is getting more valuable, not just more frequent.',
      },
      { type: 'h2', text: 'The seasonality you can plan around' },
      {
        type: 'p',
        text: 'Florida hospitality filings follow a reliable rhythm. There is a pronounced wave in the spring and early summer as operators position to open ahead of the fall and winter tourist season, and a second, smaller wave late in the year. Teams that staff and budget against this curve — leaning into outreach capacity during the spring filing surge — consistently capture more of the net-new accounts than teams running a flat cadence all year. The data has been handing out this calendar for years; surprisingly few sales orgs actually use it.',
      },
      { type: 'h2', text: 'What to watch in the back half of 2026' },
      {
        type: 'p',
        text: 'Two things will tell us whether the record pace holds. First, whether the inland and second-tier acceleration broadens into still more counties or stays concentrated in the handful leading now. Second, whether the shift toward full-liquor formats continues, which would signal operators remain confident enough to commit the larger capital those concepts require. Both are readable in real time from the filing stream — which is exactly why we watch velocity instead of waiting for the openings to make the news.',
      },
      { type: 'h2', text: 'The takeaway for operators selling into the market' },
      {
        type: 'p',
        text: 'If your territory strategy is still built around the marquee coastal markets, the data suggests you are fishing where everyone else is fishing while the faster-growing water sits inland and underserved. The teams that win 2026 will be the ones that let filing velocity, not headlines, draw the map of where to spend their attention.',
      },
    ],
  },
  {
    slug: 'florida-license-data-2026-where-businesses-are-opening',
    title: "Where Florida's New Bars and Restaurants Are Opening in 2026",
    excerpt:
      'We mapped all 52,061 active Florida liquor licensees and 6,243 new food-service openings this fiscal year against the county leaderboard. Here is where the demand actually is — and what the license-type mix tells you about how to sell into it.',
    category: 'Market Intel',
    author: 'Mara Quinn',
    authorRole: 'Head of Data Science',
    date: 'June 12, 2026',
    readingMinutes: 11,
    content: [
      {
        type: 'p',
        text: 'For the first time, the New Venue Data map is built entirely on live state data rather than samples. As of June 15, 2026, we are tracking 52,061 active retail liquor licensees across all 67 Florida counties, sourced directly from the DBPR Division of Alcoholic Beverages and Tobacco, geocoded through the U.S. Census batch geocoder, and cross-referenced with the Division of Corporations. On top of that base, 6,243 new food-service establishments have come online this fiscal year. This post is about what that full-population dataset says about where to point a B2B sales and distribution team.',
      },
      { type: 'h2', text: 'The county leaderboard is the demand map' },
      {
        type: 'p',
        text: 'Liquor licensees are not spread evenly across Florida. They concentrate hard, and the top ten counties account for a disproportionate share of the entire 52,061-licensee population. If you sell beverage, POS, payroll, linen, or any other recurring service into hospitality, this ranking is the closest thing to a pre-drawn territory map you will find:',
      },
      {
        type: 'list',
        items: [
          'Miami-Dade: 6,565 active liquor licensees — the single largest market in the state by a wide margin.',
          'Broward: 4,337 — the second pillar of the Southeast Florida corridor.',
          'Orange: 3,454 — Orlando and its tourism-driven density.',
          'Palm Beach: 3,322 — rounding out the three-county Southeast block.',
          'Hillsborough: 2,901 and Pinellas: 2,803 — the Tampa Bay metro, effectively one combined market across the bay.',
          'Duval: 2,421 — Jacksonville and the Northeast.',
          'Lee: 1,960 — Southwest Florida, riding sustained population inflow.',
          'Brevard: 1,521 and Volusia: 1,497 — the Space Coast and Daytona, the tail end of the top ten.',
        ],
      },
      {
        type: 'p',
        text: 'The strategic read is straightforward. Miami-Dade, Broward, and Palm Beach together hold more than 14,000 licensees — over a quarter of the statewide total in three adjacent counties. A single rep with a full book in Tampa Bay is sitting on roughly 5,700 active accounts across Hillsborough and Pinellas without crossing a county line. These are not abstractions; they are the addressable account counts your headcount plan should be sized against.',
      },
      { type: 'h2', text: 'License type tells you what you are selling into' },
      {
        type: 'p',
        text: 'The 52,061 licensees are not interchangeable. The type mix shapes which products win, and the distribution is heavily weighted toward full on-premise consumption:',
      },
      {
        type: 'list',
        items: [
          'COP (consumption on premises): 28,592 — the largest segment by far. Bars, restaurants, and venues serving on-site. Deep beverage programs, high transaction volume, the richest vendor lists.',
          'APS (package stores): 20,861 — off-premise retail. A different buyer entirely: inventory, shelf-management, and retail POS rather than table service.',
          'BEV (beer and wine): 2,608 — the lower-barrier tier, often cafes, fast-casual, and neighborhood spots with lighter beverage needs.',
        ],
      },
      {
        type: 'p',
        text: 'For a sales org, that split is a segmentation gift. A beverage distributor or hospitality-tech vendor selling table-service tooling has a 28,592-account on-premise universe to work. A retail-focused vendor — security, inventory software, shelf analytics — has a distinct 20,861-store package-store market that the on-premise sellers largely ignore. Treating COP and APS as one undifferentiated "liquor" list is the most common targeting mistake we see, and it wastes outreach on accounts that will never buy your product.',
      },
      {
        type: 'quote',
        text: 'COP and APS are not two flavors of the same lead. One is a 28,592-account on-premise market and the other is a 20,861-store retail market — and almost nobody sells the same thing to both.',
      },
      { type: 'h2', text: 'The 6,243 new openings are the timing layer' },
      {
        type: 'p',
        text: 'The 52,061 figure is the standing population — your total addressable market. The 6,243 new food-service establishments registered this fiscal year are the flow, and the flow is where timing-sensitive revenue lives. Every one of those openings is an operator who chose vendors within weeks of filing, which means roughly 17 net-new food-service accounts came online per day across the state, each making POS, payments, distribution, and payroll decisions on a compressed clock. A team that only works the standing population is competing for incumbents; a team that works the flow is the first call a new operator gets.',
      },
      { type: 'h2', text: 'Why full-population data beats a sample' },
      {
        type: 'p',
        text: 'When the map was built on samples, you could infer the shape of the market but not size a territory or guarantee a specific business was on it. With all 67 counties covered and every active licensee geocoded, the dataset answers operational questions directly: how many on-premise accounts sit inside a 25-mile radius of a new depot, which county a hiring plan should weight toward, whether a given named business is licensed and active right now. The data is refreshed daily and weekly from DBPR bulk extracts, so the standing population and the new-opening flow both stay current rather than drifting into staleness between quarterly reports.',
      },
      { type: 'h2', text: 'How to turn the leaderboard into a plan' },
      {
        type: 'p',
        text: 'The practical move is to overlay three things you now have at full resolution: the county leaderboard (where the accounts are), the COP/APS/BEV mix (what kind of accounts they are), and the new-opening flow (which ones are deciding right now). Weight headcount toward the top counties, route reps by license type rather than a flat geographic split, and put your fastest-responding people on the new-filing stream where the buying window is open widest. The 52,061 licensees tell you where to build the team; the 6,243 openings tell you where to point it this month.',
      },
      {
        type: 'p',
        text: 'A note on what this data is and is not. These are public business-entity records released under Florida Chapter 119, enriched with corporate-registration data from Sunbiz — not consumer reports. They are FCRA-safe for B2B prospecting and explicitly not for credit, employment, tenant, or insurance screening of individuals. New Venue Data is not affiliated with or endorsed by DBPR or the State of Florida, and the data is provided as is. Used within those lines, it is one of the cleanest market maps a Florida sales team can build on.',
      },
    ],
  },
]
