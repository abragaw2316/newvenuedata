import Link from 'next/link'
import { Zap } from 'lucide-react'
import { DataDisclaimer } from '@/components/shared/data-disclaimer'

const FOOTER_LINKS = {
  Product: [
    { href: '/docs', label: 'API Reference' },
    { href: '/docs/webhooks', label: 'Webhooks' },
    { href: '/webhook-events', label: 'Webhook Events' },
    { href: '/integrations', label: 'Integrations' },
    { href: '/signals', label: 'Business Signals' },
    { href: '/data-coverage', label: 'Data Coverage' },
    { href: '/sample', label: 'Live Sample' },
    { href: '/coverage', label: 'County Coverage' },
    { href: '/license-types', label: 'License Types' },
    { href: '/analytics', label: 'Analytics' },
    { href: '/search', label: 'Search' },
    { href: '/alerts', label: 'Alerts' },
    { href: '/dashboard', label: 'Dashboard' },
  ],
  Solutions: [
    { href: '/use-cases', label: 'Use Cases' },
    { href: '/for/distributors', label: 'For Distributors' },
    { href: '/for/pos', label: 'For POS & Tech' },
    { href: '/for/payroll', label: 'For Payroll & HR' },
    { href: '/for/suppliers', label: 'For Suppliers' },
    { href: '/alternatives', label: 'Alternatives' },
    { href: '/expansion/texas', label: 'Texas (soon)' },
    { href: '/expansion/georgia', label: 'Georgia (soon)' },
  ],
  Developers: [
    { href: '/docs', label: 'Documentation' },
    { href: '/docs/sdks', label: 'SDKs' },
    { href: '/methodology', label: 'Methodology' },
    { href: '/reports/florida-2026', label: '2026 Market Report' },
    { href: '/help', label: 'Help Center' },
    { href: '/learn', label: 'Learning Center' },
    { href: '/changelog', label: 'Changelog' },
    { href: '/roadmap', label: 'Roadmap' },
    { href: '/glossary', label: 'Glossary' },
    { href: '/blog', label: 'Blog' },
    { href: '/feed.xml', label: 'RSS Feed' },
    { href: '/design', label: 'Design System' },
    { href: '/status', label: 'Status' },
  ],
  Company: [
    { href: '/about', label: 'About' },
    { href: '/customers', label: 'Customers' },
    { href: '/compare', label: 'Compare' },
    { href: '/webinars', label: 'Webinars' },
    { href: '/podcast', label: 'Podcast' },
    { href: '/security', label: 'Security' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/contact', label: 'Contact' },
  ],
  Legal: [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
    { href: '/data-policy', label: 'Data Policy' },
    { href: '/accessibility', label: 'Accessibility' },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-[var(--ls-border)] bg-[var(--ls-bg)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/20 border border-indigo-500/30">
                <Zap className="h-4 w-4 text-indigo-400" />
              </div>
              <span className="text-sm font-semibold tracking-tight text-[var(--ls-fg)]">
                License<span className="text-indigo-400">Signal</span>
              </span>
            </Link>
            <p className="text-xs text-[var(--ls-fg-3)] leading-relaxed max-w-[180px]">
              Real-time Florida license intelligence for teams that move first.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--ls-fg-3)]">
                {section}
              </p>
              <ul className="flex flex-col gap-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--ls-fg-2)] hover:text-[var(--ls-fg)] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Data provenance / compliance disclaimer */}
        <div className="mt-12 border-t border-[var(--ls-border)] pt-8">
          <DataDisclaimer />
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[var(--ls-border)] pt-8">
          <p className="text-xs text-[var(--ls-fg-3)]">
            © {new Date().getFullYear()} New Venue Data. All rights reserved.
          </p>
          <p className="text-xs text-[var(--ls-fg-3)]">
            Know when businesses are opening before everyone else.
          </p>
        </div>
      </div>
    </footer>
  )
}
