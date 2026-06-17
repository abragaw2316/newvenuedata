// Honest credibility strip: the real, official public-record sources the feed is
// built on — NOT customer logos. (Previously listed Fortune-500 distributors as
// implied users, which was fabricated.)
const SOURCES = [
  'FL DBPR — Alcoholic Beverages & Tobacco',
  'FL DBPR — Hotels & Restaurants',
  'FDACS Retail Food',
  'Texas TABC',
]

export function TrustBar() {
  return (
    <section className="border-y border-[var(--ls-border)] bg-[var(--ls-surface-2)] py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-5">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--ls-fg-3)]">
            Built on official public records · refreshed daily
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {SOURCES.map((name) => (
              <span key={name} className="text-sm font-medium text-[var(--ls-fg-3)] tracking-tight">
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
