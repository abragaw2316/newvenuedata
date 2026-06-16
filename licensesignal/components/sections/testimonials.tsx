'use client'

import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'
import { SectionHeading } from '@/components/shared/section-heading'

const TESTIMONIALS = [
  {
    quote:
      'We used to find out about new accounts from a sales rep\'s cold call. Now we\'re in their inbox the week they file. It\'s changed how our whole territory team operates.',
    name: 'Director of Sales',
    company: 'Regional Beverage Distributor',
    initials: 'DS',
  },
  {
    quote:
      'The webhook integration took our dev team about two hours. The ROI was visible in the first month — we captured three new restaurant accounts we would have missed.',
    name: 'VP Data Strategy',
    company: 'Hospitality Insurance MGA',
    initials: 'VD',
  },
  {
    quote:
      'We track Florida restaurant market expansion for PE due diligence. This is the cleanest, most normalized license data source we\'ve found — and we\'ve tried everything.',
    name: 'Market Intelligence Lead',
    company: 'Growth Equity Fund',
    initials: 'MI',
  },
]

export function Testimonials() {
  return (
    <section className="py-24 lg:py-32 bg-[var(--ls-surface-2)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeading
            eyebrow="Social Proof"
            heading="Teams That Move First"
            subtext="How intelligence and sales teams use New Venue Data to close deals before the competition knows the account exists."
          />
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.company}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col gap-4 rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-6"
            >
              <Quote className="h-5 w-5 text-indigo-500/60 flex-shrink-0" />
              <p className="text-sm text-[var(--ls-fg-2)] leading-relaxed flex-1 italic">"{t.quote}"</p>
              <div className="flex items-center gap-3 pt-2 border-t border-[var(--ls-border)]">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/15 border border-indigo-500/20">
                  <span className="text-xs font-semibold text-indigo-400">{t.initials}</span>
                </div>
                <div>
                  <p className="text-xs font-medium text-[var(--ls-fg)]">{t.name}</p>
                  <p className="text-xs text-[var(--ls-fg-3)]">{t.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
