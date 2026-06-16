'use client'

import { motion } from 'framer-motion'
import { Zap, Code2, Database } from 'lucide-react'
import { SectionHeading } from '@/components/shared/section-heading'
import { GlowCard } from '@/components/shared/glow-card'

const PRODUCTS = [
  {
    icon: Zap,
    title: 'Real-Time Trigger Feed',
    description:
      'Receive a structured event the moment a new license record appears. Filter by county, license type, or event type. Hook it into your CRM, outbound queue, or data warehouse.',
    features: ['Sub-24h from source', 'Webhook push delivery', 'HMAC-signed payloads'],
  },
  {
    icon: Code2,
    title: 'Developer API',
    description:
      'REST API with cursor pagination, comprehensive filtering, and sub-second response times. Fully documented with SDKs and a sandbox environment.',
    features: ['JSON REST API', 'Cursor pagination', 'OpenAPI schema'],
  },
  {
    icon: Database,
    title: 'Enterprise Data Exports',
    description:
      'Bulk JSON and CSV delivery on a daily or real-time schedule. Full 2-year historical archive available for enrichment, modeling, and market intelligence.',
    features: ['Daily CSV/JSON drops', '2-year archive', 'S3 or SFTP delivery'],
  },
]

export function ProductOverview() {
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
            eyebrow="The Product"
            heading="Three Ways to Access the Data"
            subtext="Whether you need a real-time push, a pull API, or a bulk export — we have the delivery method your stack needs."
          />
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {PRODUCTS.map((product, i) => {
            const Icon = product.icon
            return (
              <motion.div
                key={product.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <GlowCard className="h-full flex flex-col gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/15 border border-indigo-500/20">
                    <Icon className="h-5 w-5 text-indigo-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--ls-fg)]">{product.title}</h3>
                  <p className="text-sm text-[var(--ls-fg-2)] leading-relaxed flex-1">{product.description}</p>
                  <ul className="flex flex-col gap-1.5">
                    {product.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-xs text-[var(--ls-fg-3)]">
                        <span className="h-1 w-1 rounded-full bg-indigo-400" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </GlowCard>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
