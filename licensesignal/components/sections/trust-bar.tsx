const LOGOS = [
  'Southern Glazer\'s',
  'Republic National',
  'Breakthru Beverage',
  'Performance Food Group',
  'Sysco',
  'US Foods',
]

export function TrustBar() {
  return (
    <section className="border-y border-[var(--ls-border)] bg-[var(--ls-surface-2)] py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6">
          <p className="text-xs font-medium uppercase tracking-widest text-[var(--ls-fg-3)]">
            Used by distribution, intelligence, and supplier teams
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-12">
            {LOGOS.map((name) => (
              <span
                key={name}
                className="text-sm font-semibold text-[var(--ls-fg-4)] tracking-tight select-none"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
