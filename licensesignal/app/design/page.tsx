import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Check, Code2 } from 'lucide-react'
import { SectionHeading } from '@/components/shared/section-heading'
import { GlowCard } from '@/components/shared/glow-card'
import { TagBadge } from '@/components/shared/tag-badge'
import { GradientText } from '@/components/shared/gradient-text'

export const metadata: Metadata = {
  title: 'Design System',
  description:
    'The New Venue Data design system — color tokens, typography scale, components, spacing, and radius. A living style guide for the dark-mode product surface.',
  alternates: { canonical: 'https://newvenuedata.com/design' },
  robots: { index: false, follow: false },
}

type Swatch = {
  name: string
  hex: string
  usage: string
}

const SURFACE_TOKENS: Swatch[] = [
  { name: 'Base', hex: '#09090b', usage: 'Page background' },
  { name: 'Surface', hex: '#111113', usage: 'Cards, panels' },
  { name: 'Surface 2', hex: '#0d0d0f', usage: 'Alternating sections' },
  { name: 'Hover', hex: '#18181b', usage: 'Row / control hover' },
  { name: 'Border', hex: '#1f1f23', usage: 'Default hairline' },
  { name: 'Border Strong', hex: '#2e2e35', usage: 'Emphasis edges' },
]

const TEXT_TOKENS: Swatch[] = [
  { name: 'Text', hex: '#fafafa', usage: 'Primary copy, headings' },
  { name: 'Text Secondary', hex: '#a1a1aa', usage: 'Body, descriptions' },
  { name: 'Text Muted', hex: '#71717a', usage: 'Labels, captions' },
  { name: 'Text Faint', hex: '#3f3f46', usage: 'Disabled, dividers' },
]

const ACCENT_TOKENS: Swatch[] = [
  { name: 'Indigo 400', hex: '#818cf8', usage: 'Accent text, links' },
  { name: 'Indigo 500', hex: '#6366f1', usage: 'Primary actions, glow' },
  { name: 'Emerald', hex: '#34d399', usage: 'Positive / new' },
  { name: 'Amber', hex: '#f59e0b', usage: 'Caution / beta' },
  { name: 'Violet', hex: '#a78bfa', usage: 'Pro tier' },
  { name: 'Red', hex: '#ef4444', usage: 'Negative / errors' },
]

const TYPE_SCALE: {
  className: string
  label: string
  size: string
  usage: string
  sample: string
}[] = [
  {
    className: 'text-display-2xl',
    label: 'Display 2XL',
    size: '4.5rem / 72px',
    usage: 'Marketing hero numbers, rare impact moments',
    sample: 'Signal',
  },
  {
    className: 'text-display-xl',
    label: 'Display XL',
    size: '3.75rem / 60px',
    usage: 'Landing hero headlines',
    sample: 'Florida license intel',
  },
  {
    className: 'text-display-lg',
    label: 'Display LG',
    size: '3rem / 48px',
    usage: 'Page h1 — text-display-lg text-[var(--ls-fg)]',
    sample: 'The Design System',
  },
  {
    className: 'text-display-md',
    label: 'Display MD',
    size: '2.25rem / 36px',
    usage: 'Section h2 via SectionHeading',
    sample: 'Everything side by side',
  },
  {
    className: 'text-display-sm',
    label: 'Display SM',
    size: '1.875rem / 30px',
    usage: 'Sub-section headings, card titles',
    sample: 'Built for data teams',
  },
]

const BODY_SCALE: {
  className: string
  label: string
  size: string
  usage: string
}[] = [
  { className: 'text-lg', label: 'Body Large', size: '1.125rem / 18px', usage: 'Section subtext, lede paragraphs' },
  { className: 'text-base', label: 'Body', size: '1rem / 16px', usage: 'Default running text' },
  { className: 'text-sm', label: 'Body Small', size: '0.875rem / 14px', usage: 'Cards, tables, list items' },
  { className: 'text-xs', label: 'Caption', size: '0.75rem / 12px', usage: 'Labels, badges, meta' },
]

const SPACING: { token: string; value: string; usage: string }[] = [
  { token: 'Section padding', value: 'py-20 · py-20 lg:py-28 (hero)', usage: 'Vertical rhythm between sections' },
  { token: 'Container', value: 'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8', usage: 'Standard content width' },
  { token: 'Card padding', value: 'p-6', usage: 'GlowCard and panel interiors' },
  { token: 'Stack gap', value: 'gap-4 / gap-6 / gap-8', usage: 'Flex & grid spacing scale' },
  { token: 'Inline gap', value: 'gap-1.5 / gap-2', usage: 'Icon + label, badge contents' },
]

const RADIUS: { token: string; value: string; usage: string; cls: string }[] = [
  { token: 'rounded-md', value: '~0.5rem', usage: 'Buttons, inputs, small chips', cls: 'rounded-md' },
  { token: 'rounded-lg', value: '0.625rem', usage: 'Base radius token', cls: 'rounded-lg' },
  { token: 'rounded-xl', value: '~0.875rem', usage: 'Cards, panels, tables', cls: 'rounded-xl' },
  { token: 'rounded-full', value: '9999px', usage: 'Badges, pills, dots', cls: 'rounded-full' },
]

function SwatchCard({ swatch }: { swatch: Swatch }) {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)]">
      <div
        className="h-20 w-full border-b border-[var(--ls-border)]"
        style={{ backgroundColor: swatch.hex }}
      />
      <div className="flex flex-col gap-1 p-4">
        <span className="text-sm font-medium text-[var(--ls-fg)]">{swatch.name}</span>
        <span className="font-mono text-xs text-[#818cf8]">{swatch.hex}</span>
        <span className="text-xs text-[var(--ls-fg-3)]">{swatch.usage}</span>
      </div>
    </div>
  )
}

export default function DesignSystemPage() {
  return (
    <div>
      {/* Hero */}
      <section className="py-20 lg:py-28 gradient-hero">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-6 text-center">
          <span className="inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium tracking-widest text-indigo-400 uppercase">
            Style Guide
          </span>
          <h1 className="text-display-lg text-[var(--ls-fg)] max-w-3xl">
            The New Venue Data <GradientText>Design System</GradientText>
          </h1>
          <p className="max-w-2xl text-lg text-[var(--ls-fg-2)]">
            A living reference for the tokens, type scale, and components behind the
            product. Dark-mode only, indigo accent, built for dense data surfaces.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <TagBadge variant="live">Living document</TagBadge>
            <TagBadge variant="default">Dark mode only</TagBadge>
          </div>
        </div>
      </section>

      {/* Colors */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-10">
          <SectionHeading
            eyebrow="Color"
            heading="Color Tokens"
            subtext="Every surface and accent is drawn from this fixed palette. Use the exact hex values — do not invent new colors."
            align="left"
          />

          <div className="flex flex-col gap-4">
            <h3 className="text-display-sm text-[var(--ls-fg)]">Surfaces &amp; Borders</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {SURFACE_TOKENS.map((s) => (
                <SwatchCard key={s.hex} swatch={s} />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-display-sm text-[var(--ls-fg)]">Text</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {TEXT_TOKENS.map((s) => (
                <SwatchCard key={s.hex} swatch={s} />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-display-sm text-[var(--ls-fg)]">Accents &amp; Semantics</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {ACCENT_TOKENS.map((s) => (
                <SwatchCard key={s.hex} swatch={s} />
              ))}
            </div>
            <p className="text-sm text-[var(--ls-fg-3)]">
              Indigo is the primary accent. Emerald = positive, amber = caution,
              violet = pro, red = negative. Blue, orange, and pink are reserved for
              category variety only.
            </p>
          </div>
        </div>
      </section>

      {/* Typography */}
      <section className="py-20 bg-[var(--ls-surface-2)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-10">
          <SectionHeading
            eyebrow="Typography"
            heading="Type Scale"
            subtext="Inter for UI, JetBrains Mono for code and tabular data. Display sizes carry tight tracking for impact."
            align="left"
          />

          {/* Display scale */}
          <div className="flex flex-col divide-y divide-[var(--ls-border)] rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)]">
            {TYPE_SCALE.map((t) => (
              <div
                key={t.className}
                className="flex flex-col gap-3 p-6 md:flex-row md:items-baseline md:justify-between md:gap-8"
              >
                <span className={`${t.className} text-[var(--ls-fg)] truncate`}>{t.sample}</span>
                <div className="flex flex-col gap-1 md:items-end md:text-right md:flex-shrink-0">
                  <span className="font-mono text-xs text-[#818cf8]">{t.className}</span>
                  <span className="text-xs text-[var(--ls-fg-3)]">{t.size}</span>
                  <span className="text-xs text-[var(--ls-fg-3)] md:max-w-xs">{t.usage}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Body scale */}
          <div className="flex flex-col gap-4">
            <h3 className="text-display-sm text-[var(--ls-fg)]">Body Sizes</h3>
            <div className="flex flex-col divide-y divide-[var(--ls-border)] rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)]">
              {BODY_SCALE.map((b) => (
                <div
                  key={b.className}
                  className="flex flex-col gap-2 p-6 md:flex-row md:items-baseline md:justify-between md:gap-8"
                >
                  <p className={`${b.className} text-[var(--ls-fg-2)]`}>
                    The quick brown fox jumps over 12 lazy license filings.
                  </p>
                  <div className="flex flex-col gap-1 md:items-end md:text-right md:flex-shrink-0">
                    <span className="font-mono text-xs text-[#818cf8]">{b.className}</span>
                    <span className="text-xs text-[var(--ls-fg-3)]">{b.size}</span>
                    <span className="text-xs text-[var(--ls-fg-3)] md:max-w-xs">{b.usage}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Components */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-10">
          <SectionHeading
            eyebrow="Components"
            heading="Live Components"
            subtext="Rendered from the real shared components — what you see here is exactly what ships."
            align="left"
          />

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Badges */}
            <GlowCard className="flex flex-col gap-5">
              <div className="flex flex-col gap-1">
                <h3 className="text-base font-semibold text-[var(--ls-fg)]">TagBadge</h3>
                <p className="text-xs text-[var(--ls-fg-3)]">
                  variant: new · live · beta · pro · default
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <TagBadge variant="new">New</TagBadge>
                <TagBadge variant="live">Live</TagBadge>
                <TagBadge variant="beta">Beta</TagBadge>
                <TagBadge variant="pro">Pro</TagBadge>
                <TagBadge variant="default">Default</TagBadge>
              </div>
            </GlowCard>

            {/* Buttons as links */}
            <GlowCard className="flex flex-col gap-5">
              <div className="flex flex-col gap-1">
                <h3 className="text-base font-semibold text-[var(--ls-fg)]">CTAs &amp; Links</h3>
                <p className="text-xs text-[var(--ls-fg-3)]">
                  Plain Next Link styled with classes — never the Button component.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-md bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium px-5 py-2.5 transition-colors"
                >
                  Primary <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/docs"
                  className="inline-flex items-center justify-center rounded-md border border-[var(--ls-border-2)] bg-transparent text-[var(--ls-fg-2)] hover:border-indigo-500/40 hover:text-[var(--ls-fg)] text-sm font-medium px-5 py-2.5 transition-colors"
                >
                  Secondary
                </Link>
                <Link
                  href="/docs"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  <Code2 className="h-3.5 w-3.5" /> Text link
                </Link>
              </div>
            </GlowCard>

            {/* GlowCard demo */}
            <GlowCard highlighted className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-[var(--ls-fg)]">GlowCard</h3>
                <TagBadge variant="pro">highlighted</TagBadge>
              </div>
              <p className="text-sm text-[var(--ls-fg-2)]">
                A bordered surface on #111113 with a subtle gradient and indigo glow on
                hover. Pass <span className="font-mono text-xs text-[#818cf8]">highlighted</span> for
                an indigo edge and resting shadow.
              </p>
              <ul className="flex flex-col gap-2 border-t border-[var(--ls-border)] pt-4">
                {['Soft hover glow', 'Gradient card fill', 'Composable children'].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-[var(--ls-fg-2)]">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400" />
                    {f}
                  </li>
                ))}
              </ul>
            </GlowCard>

            {/* SectionHeading demo */}
            <div className="rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-6 gradient-card flex flex-col gap-5">
              <div className="flex flex-col gap-1">
                <h3 className="text-base font-semibold text-[var(--ls-fg)]">SectionHeading</h3>
                <p className="text-xs text-[var(--ls-fg-3)]">
                  props: eyebrow · heading · subtext · align
                </p>
              </div>
              <div className="rounded-lg border border-dashed border-[var(--ls-border-2)] p-6">
                <SectionHeading
                  eyebrow="Example"
                  heading="A Section Heading"
                  subtext="Renders an h2 at text-display-md with an optional eyebrow pill and lede."
                  align="left"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Spacing & Radius */}
      <section className="py-20 bg-[var(--ls-surface-2)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-10">
          <SectionHeading
            eyebrow="Layout"
            heading="Spacing &amp; Radius"
            subtext="Consistent rhythm and corner softness keep the dense data surface calm."
            align="left"
          />

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Spacing */}
            <div className="overflow-hidden rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)]">
              <div className="border-b border-[var(--ls-border)] px-6 py-4">
                <h3 className="text-base font-semibold text-[var(--ls-fg)]">Spacing</h3>
              </div>
              <ul className="flex flex-col divide-y divide-[var(--ls-border)]">
                {SPACING.map((s) => (
                  <li key={s.token} className="flex flex-col gap-1 px-6 py-4">
                    <span className="text-sm font-medium text-[var(--ls-fg)]">{s.token}</span>
                    <span className="font-mono text-xs text-[#818cf8]">{s.value}</span>
                    <span className="text-xs text-[var(--ls-fg-3)]">{s.usage}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Radius */}
            <div className="overflow-hidden rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)]">
              <div className="border-b border-[var(--ls-border)] px-6 py-4">
                <h3 className="text-base font-semibold text-[var(--ls-fg)]">Radius</h3>
              </div>
              <ul className="flex flex-col divide-y divide-[var(--ls-border)]">
                {RADIUS.map((r) => (
                  <li key={r.token} className="flex items-center gap-4 px-6 py-4">
                    <div
                      className={`h-12 w-12 flex-shrink-0 border border-[var(--ls-border-2)] bg-[var(--ls-hover)] ${r.cls}`}
                    />
                    <div className="flex flex-col gap-1">
                      <span className="font-mono text-xs text-[#818cf8]">{r.token}</span>
                      <span className="text-xs text-[var(--ls-fg-2)]">{r.value}</span>
                      <span className="text-xs text-[var(--ls-fg-3)]">{r.usage}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
