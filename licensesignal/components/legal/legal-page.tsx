import Link from 'next/link'

export interface LegalBlock {
  /** A paragraph of text. */
  p?: string
  /** A bulleted list. */
  list?: string[]
}

export interface LegalSection {
  heading: string
  blocks: LegalBlock[]
}

interface LegalPageProps {
  title: string
  lastUpdated: string
  intro: string
  sections: LegalSection[]
}

export function LegalPage({ title, lastUpdated, intro, sections }: LegalPageProps) {
  return (
    <div>
      {/* Header */}
      <section className="gradient-hero py-16 lg:py-20 border-b border-[var(--ls-border)]">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-medium uppercase tracking-widest text-indigo-400">Legal</p>
          <h1 className="mt-3 text-display-md text-[var(--ls-fg)]">{title}</h1>
          <p className="mt-3 text-sm text-[var(--ls-fg-3)]">Last updated: {lastUpdated}</p>
          <p className="mt-5 text-base text-[var(--ls-fg-2)] leading-relaxed">{intro}</p>
        </div>
      </section>

      {/* Body */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 flex flex-col gap-10">
          {sections.map((section, i) => (
            <div key={section.heading} className="flex flex-col gap-3">
              <h2 className="text-lg font-semibold text-[var(--ls-fg)]">
                <span className="text-[var(--ls-fg-4)] tabular-nums mr-2">{i + 1}.</span>
                {section.heading}
              </h2>
              {section.blocks.map((block, j) => {
                if (block.list) {
                  return (
                    <ul key={j} className="flex flex-col gap-2 pl-1">
                      {block.list.map((item, k) => (
                        <li key={k} className="flex items-start gap-2 text-sm text-[var(--ls-fg-2)] leading-relaxed">
                          <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-indigo-400" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )
                }
                return (
                  <p key={j} className="text-sm text-[var(--ls-fg-2)] leading-relaxed">
                    {block.p}
                  </p>
                )
              })}
            </div>
          ))}

          <div className="rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-6 mt-2">
            <p className="text-sm text-[var(--ls-fg-2)] leading-relaxed">
              Questions about this policy? Contact us at{' '}
              <a
                href="mailto:legal@newvenuedata.com"
                className="text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                legal@newvenuedata.com
              </a>{' '}
              or visit our{' '}
              <Link href="/contact" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                contact page
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
