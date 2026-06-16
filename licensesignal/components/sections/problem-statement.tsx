'use client'

import { motion } from 'framer-motion'
import { X, Check, ArrowRight } from 'lucide-react'
import { SectionHeading } from '@/components/shared/section-heading'

const TIMELINE_STEPS = [
  { label: 'License Filed', active: true },
  { label: 'Buildout Begins', active: false },
  { label: 'Vendor Selection', active: false },
  { label: 'Grand Opening', active: false },
]

export function ProblemStatement() {
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
            eyebrow="The Problem"
            heading="Most Sales Teams Learn About New Businesses Too Late"
            subtext="By the time a cold call rep finds out a new restaurant opened, their vendor relationships are already locked in."
          />
        </motion.div>

        {/* Comparison cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Without */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="rounded-xl border border-[var(--ls-border-2)] bg-[var(--ls-surface)] p-6 lg:p-8"
          >
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500/15 border border-red-500/20">
                <X className="h-3 w-3 text-red-400" />
              </div>
              <span className="text-sm font-semibold text-[var(--ls-fg-2)]">Without New Venue Data</span>
            </div>
            <p className="text-[var(--ls-fg-3)] leading-relaxed">
              "You find out a new restaurant opened when a cold call rep tries to sell them a POS
              system — and they already have a distributor, a payroll provider, and a linen
              contract signed."
            </p>
            <div className="mt-6 rounded-lg bg-red-500/5 border border-red-500/10 p-4">
              <p className="text-sm text-red-400 font-medium">You're 90+ days late.</p>
              <p className="text-xs text-[var(--ls-fg-3)] mt-1">Vendor decisions are made in weeks 1–8 of buildout.</p>
            </div>
          </motion.div>

          {/* With */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-xl border border-indigo-500/20 bg-[var(--ls-surface)] p-6 lg:p-8 shadow-[0_0_30px_rgba(99,102,241,0.08)]"
          >
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/20">
                <Check className="h-3 w-3 text-emerald-400" />
              </div>
              <span className="text-sm font-semibold text-[var(--ls-fg-2)]">With New Venue Data</span>
            </div>
            <p className="text-[var(--ls-fg-3)] leading-relaxed">
              "You get an API event the moment they file their liquor license — before they've
              spoken to a single vendor. Your rep is first in the door, every time."
            </p>
            <div className="mt-6 rounded-lg bg-emerald-500/5 border border-emerald-500/10 p-4">
              <p className="text-sm text-emerald-400 font-medium">You're Day 1.</p>
              <p className="text-xs text-[var(--ls-fg-3)] mt-1">Reach them before buildout begins — when every vendor slot is open.</p>
            </div>
          </motion.div>
        </div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col items-center gap-6"
        >
          <p className="text-xs font-medium uppercase tracking-widest text-[var(--ls-fg-3)]">
            The business opening timeline
          </p>
          <div className="relative flex w-full max-w-2xl items-center justify-between">
            {/* Line */}
            <div className="absolute left-0 right-0 top-4 h-px bg-[var(--ls-border)]" />
            {TIMELINE_STEPS.map((step, i) => (
              <div key={step.label} className="relative flex flex-col items-center gap-3 z-10">
                <div
                  className={`h-8 w-8 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                    step.active
                      ? 'border-indigo-500 bg-indigo-500/20 text-indigo-400 shadow-[0_0_12px_rgba(99,102,241,0.4)]'
                      : 'border-[var(--ls-border-2)] bg-[var(--ls-surface)] text-[var(--ls-fg-3)]'
                  }`}
                >
                  {i + 1}
                </div>
                <span className={`text-xs font-medium text-center max-w-[80px] leading-tight ${step.active ? 'text-indigo-400' : 'text-[var(--ls-fg-3)]'}`}>
                  {step.label}
                </span>
                {step.active && (
                  <span className="absolute -bottom-8 whitespace-nowrap text-[10px] font-medium text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-2 py-0.5">
                    ← New Venue Data triggers here
                  </span>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
