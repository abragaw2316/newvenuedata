'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { Menu, ChevronDown } from 'lucide-react'
import { LogoMark } from '@/components/shared/logo-mark'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import { cn } from '@/lib/utils'

type NavLink = { href: string; label: string; desc?: string }

const PRODUCT: NavLink[] = [
  { href: '/signals', label: 'Business Signals', desc: 'Registrations, permits, licenses — one feed' },
  { href: '/data-coverage', label: 'Data Coverage', desc: 'Counties, types, and refresh cadence' },
  { href: '/sample', label: 'Live Sample', desc: 'See real Florida records now' },
  { href: '/integrations', label: 'Integrations', desc: 'CRM, warehouse, Slack, and more' },
  { href: '/dashboard', label: 'Dashboard', desc: 'Live monitoring preview' },
  { href: '/analytics', label: 'Analytics', desc: 'Maps, trends, and reports' },
  { href: '/search', label: 'Search', desc: 'Find any filing fast' },
  { href: '/alerts', label: 'Alerts', desc: 'Rules and notifications' },
  { href: '/security', label: 'Security', desc: 'Encryption and compliance' },
]

const SOLUTIONS: NavLink[] = [
  { href: '/use-cases', label: 'Use Cases', desc: 'Every vertical we serve' },
  { href: '/for/distributors', label: 'For Distributors', desc: 'Every license is a new account' },
  { href: '/for/pos', label: 'For POS & Restaurant Tech', desc: 'Reach openings before launch' },
  { href: '/for/payroll', label: 'For Payroll & HR', desc: 'New restaurants = new accounts' },
  { href: '/for/suppliers', label: 'For Suppliers', desc: 'Win the first 60 days' },
]

const DEVELOPERS: NavLink[] = [
  { href: '/docs', label: 'Documentation', desc: 'REST API, examples & guides' },
  { href: '/webhook-events', label: 'Webhook Events', desc: 'Full event catalog' },
  { href: '/help', label: 'Help Center', desc: 'Guides and answers' },
  { href: '/learn', label: 'Learning Center', desc: 'Guides, tutorials, videos' },
  { href: '/methodology', label: 'Methodology', desc: 'How we source the data' },
  { href: '/reports/florida-2026', label: '2026 Market Report', desc: 'The data, interpreted' },
  { href: '/changelog', label: 'Changelog', desc: 'Product updates' },
  { href: '/roadmap', label: 'Roadmap', desc: 'What we are building next' },
  { href: '/glossary', label: 'Glossary', desc: 'License terms explained' },
  { href: '/status', label: 'Status', desc: 'System uptime' },
]

const DIRECT: NavLink[] = [
  { href: '/pricing', label: 'Pricing' },
]

function NavDropdown({ label, items }: { label: string; items: NavLink[] }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex items-center gap-1 rounded-md px-3 py-2 text-sm text-[var(--ls-fg-2)] transition-colors hover:text-[var(--ls-fg)]"
      >
        {label}
        <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 w-72 pt-2">
          <div className="rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-2 shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex flex-col gap-0.5 rounded-lg px-3 py-2 transition-colors hover:bg-[var(--ls-hover)]"
              >
                <span className="text-sm font-medium text-[var(--ls-fg)]">{item.label}</span>
                {item.desc && <span className="text-xs text-[var(--ls-fg-3)]">{item.desc}</span>}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const MOBILE_GROUPS: { title: string; items: NavLink[] }[] = [
  { title: 'Product', items: PRODUCT },
  { title: 'Solutions', items: SOLUTIONS },
  { title: 'Developers', items: DEVELOPERS },
  { title: 'Company', items: DIRECT },
]

export function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-300',
        scrolled
          ? 'border-b border-[var(--ls-border)] bg-[color-mix(in_srgb,var(--ls-bg)_80%,transparent)] backdrop-blur-md'
          : 'bg-transparent'
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center">
            <LogoMark className="h-[18px] w-[18px] text-[var(--ls-fg)]" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-[var(--ls-fg)]">
            New Venue <span className="text-indigo-400">Data</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          <NavDropdown label="Product" items={PRODUCT} />
          <NavDropdown label="Solutions" items={SOLUTIONS} />
          <NavDropdown label="Developers" items={DEVELOPERS} />
          {DIRECT.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'rounded-md px-3 py-2 text-sm transition-colors',
                pathname === link.href || pathname.startsWith(link.href + '/')
                  ? 'text-[var(--ls-fg)]'
                  : 'text-[var(--ls-fg-2)] hover:text-[var(--ls-fg)]'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/login"
            className="text-sm text-[var(--ls-fg-2)] hover:text-[var(--ls-fg)] transition-colors"
          >
            Sign In
          </Link>
          <Button
            render={<Link href="/signup" />}
            nativeButton={false}
            size="sm"
            className="bg-indigo-500 hover:bg-indigo-600 text-white border-0 transition-all"
          >
            Get API Key
          </Button>
        </div>

        {/* Mobile menu */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md text-[var(--ls-fg-2)] hover:text-[var(--ls-fg)] hover:bg-[var(--ls-hover)] transition-colors"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-80 overflow-y-auto border-[var(--ls-border)] bg-[var(--ls-bg)] text-[var(--ls-fg)]"
          >
            <div className="flex flex-col gap-6 pt-8">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2"
              >
                <div className="flex h-7 w-7 items-center justify-center">
                  <LogoMark className="h-[18px] w-[18px] text-[var(--ls-fg)]" />
                </div>
                <span className="text-sm font-semibold tracking-tight">
                  New Venue <span className="text-indigo-400">Data</span>
                </span>
              </Link>
              <nav className="flex flex-col gap-5">
                {MOBILE_GROUPS.map((group) => (
                  <div key={group.title} className="flex flex-col gap-1">
                    <p className="px-3 text-[10px] font-semibold uppercase tracking-widest text-[var(--ls-fg-3)]">
                      {group.title}
                    </p>
                    {group.items.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          'rounded-md px-3 py-2 text-sm transition-colors',
                          pathname === link.href
                            ? 'bg-indigo-500/10 text-indigo-400'
                            : 'text-[var(--ls-fg-2)] hover:text-[var(--ls-fg)] hover:bg-[var(--ls-hover)]'
                        )}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                ))}
              </nav>
              <div className="flex flex-col gap-2 border-t border-[var(--ls-border)] pt-4">
                <div className="flex items-center justify-between px-3 py-1">
                  <span className="text-sm text-[var(--ls-fg-2)]">Theme</span>
                  <ThemeToggle />
                </div>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-md px-3 py-2.5 text-sm text-[var(--ls-fg-2)] hover:text-[var(--ls-fg)] transition-colors"
                >
                  Sign In
                </Link>
                <Button
                  render={<Link href="/signup" onClick={() => setMobileOpen(false)} />}
                  nativeButton={false}
                  className="w-full bg-indigo-500 hover:bg-indigo-600 text-white border-0"
                >
                  Get API Key
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
