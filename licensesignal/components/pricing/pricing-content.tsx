'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check, Minus, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { SectionHeading } from '@/components/shared/section-heading'
import { TagBadge } from '@/components/shared/tag-badge'
import { RoiCalculator } from '@/components/shared/roi-calculator'
import { PRICING_PLANS, PRICING_FEATURES } from '@/lib/mock-data'

const FAQ = [
  {
    q: 'Can I cancel at any time?',
    a: 'Yes. Monthly plans can be cancelled anytime. Annual plans can be cancelled with a prorated refund for unused months.',
  },
  {
    q: 'Do you cover counties outside Florida?',
    a: "Florida is our focus today. Texas license data is already ingested and Georgia is next — ask us about early access if you cover those markets.",
  },
  {
    q: 'What counts as a "trigger event"?',
    a: 'A trigger event is any license record change: a new filing, a status update, an ownership transfer, a renewal, or a cancellation. Each event fires one webhook delivery.',
  },
  {
    q: 'Is this FCRA compliant?',
    a: 'Yes. We sell data about business entities only — not individual consumers. We are not a consumer reporting agency (CRA) and our data cannot be used for FCRA-governed purposes such as employment screening, tenant screening, or credit decisions.',
  },
  {
    q: 'Is there a free trial?',
    a: 'Yes. Every plan starts with a 2-week free trial — you get two weekly lists before you pay, no credit card required to start.',
  },
  {
    q: 'What is the founding-member offer?',
    a: 'The first 10 Florida agents who sign on lock in $99/mo for life (instead of $149–$299), in exchange for a short testimonial once the leads pay off. Month-to-month, cancel anytime — the rate is yours for as long as you stay subscribed.',
  },
  {
    q: 'How long does integration take?',
    a: 'Our API is simple REST with cursor pagination. Most developers complete a working integration in 1–4 hours. We have SDKs and an OpenAPI spec to speed things up further.',
  },
]

function FeatureCell({ value }: { value: string | boolean }) {
  if (value === true)
    return <Check className="h-4 w-4 text-emerald-400 mx-auto" />
  if (value === false)
    return <Minus className="h-4 w-4 text-[var(--ls-fg-4)] mx-auto" />
  return <span className="text-xs text-[var(--ls-fg-2)]">{value}</span>
}

export function PricingContent() {
  const [annual, setAnnual] = useState(false)

  return (
    <div>
      {/* Hero */}
      <section className="py-20 lg:py-28 gradient-hero">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-8">
          <SectionHeading
            eyebrow="Pricing"
            heading="Fresh Florida Leads, Priced by Coverage"
            subtext="Month-to-month, cancel anytime. One new liquor-liability policy you write pays for the year — the rest is upside."
          />

          {/* Founding-member banner */}
          <div className="flex items-center gap-2 rounded-full border border-indigo-600/30 bg-indigo-500/10 px-4 py-1.5 text-sm text-indigo-700 dark:text-indigo-300">
            <span className="font-semibold">Founding offer:</span>
            <span>first 10 Florida agents lock in <strong>$99/mo for life</strong> — ask us for a spot.</span>
          </div>

          {/* Toggle */}
          <div className="flex items-center gap-3">
            <span className={`text-sm ${!annual ? 'text-[var(--ls-fg)]' : 'text-[var(--ls-fg-3)]'}`}>Monthly</span>
            <Switch
              checked={annual}
              onCheckedChange={setAnnual}
              className="data-[state=checked]:bg-indigo-500"
            />
            <span className={`text-sm ${annual ? 'text-[var(--ls-fg)]' : 'text-[var(--ls-fg-3)]'}`}>
              Annual
              <span className="ml-1.5 inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-400">
                Save 2 months
              </span>
            </span>
          </div>

          {/* Pricing cards */}
          <div className="grid md:grid-cols-3 gap-6 w-full max-w-5xl">
            {PRICING_PLANS.map((plan) => (
              <motion.div
                key={plan.id}
                animate={plan.highlighted ? { scale: [1, 1.005, 1] } : {}}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className={`relative rounded-xl border p-6 flex flex-col gap-5 ${
                  plan.highlighted
                    ? 'border-indigo-500/40 bg-[var(--ls-surface)] '
                    : 'border-[var(--ls-border)] bg-[var(--ls-surface)]'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <TagBadge variant="pro">Most Popular</TagBadge>
                  </div>
                )}

                <div>
                  <h3 className="text-base font-semibold text-[var(--ls-fg)]">{plan.name}</h3>
                  <p className="text-xs text-[var(--ls-fg-3)] mt-1">{plan.description}</p>
                </div>

                <div className="flex items-end gap-1">
                  {plan.price ? (
                    <>
                      <span className="text-4xl font-bold text-[var(--ls-fg)] tabular-nums">
                        ${annual ? plan.annualPrice : plan.price}
                      </span>
                      <span className="text-sm text-[var(--ls-fg-3)] mb-1">/mo</span>
                    </>
                  ) : (
                    <span className="text-2xl font-semibold text-[var(--ls-fg)]">Custom</span>
                  )}
                </div>

                {annual && plan.price && (
                  <p className="text-xs text-[var(--ls-fg-3)] -mt-3">
                    <span className="line-through">${plan.price}/mo</span> · billed annually
                  </p>
                )}

                <Button
                  render={
                    plan.paymentLink ? (
                      <a href={plan.paymentLink} target="_blank" rel="noopener noreferrer" />
                    ) : (
                      <Link href={plan.id === 'enterprise' ? '/contact?type=sales' : '/contact'} />
                    )
                  }
                  nativeButton={false}
                  className={
                    plan.highlighted
                      ? 'bg-indigo-500 hover:bg-indigo-600 text-white border-0  w-full'
                      : 'bg-transparent border border-[var(--ls-border-2)] text-[var(--ls-fg-2)] hover:border-indigo-500/40 hover:text-[var(--ls-fg)] w-full'
                  }
                >
                  {plan.cta} {plan.highlighted && <ArrowRight className="ml-1.5 h-3.5 w-3.5" />}
                </Button>

                <ul className="flex flex-col gap-2 border-t border-[var(--ls-border)] pt-4">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-[var(--ls-fg-2)]">
                      <Check className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI calculator */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
          <SectionHeading
            eyebrow="Return on Investment"
            heading="What's One New Account Worth?"
            subtext="Drag the sliders to estimate the pipeline a single territory can generate from new license filings."
          />
          <RoiCalculator />
        </div>
      </section>

      {/* Feature matrix */}
      <section className="py-20 bg-[var(--ls-surface-2)]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
          <SectionHeading
            eyebrow="Compare Plans"
            heading="Everything Side by Side"
          />
          <div className="rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] overflow-hidden overflow-x-auto">
            <table className="w-full text-sm min-w-[560px]">
              <thead>
                <tr className="border-b border-[var(--ls-border)]">
                  <th className="px-5 py-3 text-left text-xs font-medium text-[var(--ls-fg-3)]">Feature</th>
                  {PRICING_PLANS.map((p) => (
                    <th key={p.id} className="px-5 py-3 text-center text-xs font-medium text-[var(--ls-fg)]">
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PRICING_FEATURES.map((f, i) => (
                  <tr
                    key={f.name}
                    className={`border-b border-[var(--ls-border)] last:border-0 ${i % 2 === 1 ? 'bg-[var(--ls-surface-2)]' : ''}`}
                  >
                    <td className="px-5 py-3 text-xs text-[var(--ls-fg-2)]">{f.name}</td>
                    <td className="px-5 py-3 text-center"><FeatureCell value={f.starter} /></td>
                    <td className="px-5 py-3 text-center"><FeatureCell value={f.pro} /></td>
                    <td className="px-5 py-3 text-center"><FeatureCell value={f.enterprise} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
          <SectionHeading eyebrow="FAQ" heading="Common Questions" />
          <Accordion className="flex flex-col gap-2">
            {FAQ.map((item, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] px-5 data-[state=open]:border-indigo-500/20"
              >
                <AccordionTrigger className="text-sm font-medium text-[var(--ls-fg)] hover:no-underline py-4">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-[var(--ls-fg-2)] leading-relaxed pb-4">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  )
}
