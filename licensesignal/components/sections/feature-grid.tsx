'use client'

import { motion } from 'framer-motion'
import { Beer, UtensilsCrossed, Webhook, Archive, MapPin, RefreshCw } from 'lucide-react'
import { SectionHeading } from '@/components/shared/section-heading'

const FEATURES = [
  {
    icon: Beer,
    title: 'Florida Liquor License Monitoring',
    description:
      'New applications, transfers, ownership changes, and status updates across all liquor license types (SRX, COP, BEV, and more).',
  },
  {
    icon: UtensilsCrossed,
    title: 'Food Service License Monitoring',
    description:
      'New establishment filings, seating approvals, mobile food vehicles, and food-service establishment changes statewide.',
  },
  {
    icon: Webhook,
    title: 'Webhook Delivery — on the roadmap',
    description:
      'Real-time HTTP push to your endpoint is planned, not yet live. Today you get new records via the weekly list, CSV/Excel export, or the REST API.',
  },
  {
    icon: Archive,
    title: 'Searchable Dataset & Export',
    description:
      'The full current Florida dataset, searchable and exportable to CSV/Excel. Filing history is included on paid plans (30–90 days; full archive on Statewide).',
  },
  {
    icon: MapPin,
    title: 'Geographic Filtering',
    description:
      'Pinpoint your market by county, city, or ZIP code. Starter plans include 1 county. Pro and Enterprise cover all 67 Florida counties.',
  },
  {
    icon: RefreshCw,
    title: 'Daily Source Refresh',
    description:
      'Every record refreshed from FL DBPR within 24 hours of publication. Status changes, renewals, and cancellations are all tracked.',
  },
]

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.08 } },
}

const fadeUpItem = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut' as const },
}

export function FeatureGrid() {
  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeading
            eyebrow="What's Included"
            heading="Everything Your Team Needs to Move First"
            subtext="One data feed. Every signal you need to win the account before a competitor makes the call."
          />
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-80px' }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--ls-border)] rounded-xl overflow-hidden"
        >
          {FEATURES.map((feature) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                variants={fadeUpItem}
                className="bg-[var(--ls-bg)] p-6 lg:p-8 flex flex-col gap-3 hover:bg-[var(--ls-surface)] transition-colors"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/15">
                  <Icon className="h-4 w-4 text-indigo-400" />
                </div>
                <h3 className="text-sm font-semibold text-[var(--ls-fg)] leading-snug">{feature.title}</h3>
                <p className="text-sm text-[var(--ls-fg-3)] leading-relaxed">{feature.description}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
