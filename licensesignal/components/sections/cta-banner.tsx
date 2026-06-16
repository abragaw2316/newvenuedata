'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CtaBanner() {
  return (
    <section className="border-y border-[var(--ls-border)] bg-[var(--ls-surface-2)] py-20 lg:py-24 relative overflow-hidden">
      {/* Glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 40% 60% at 50% 50%, rgba(99,102,241,0.08) 0%, transparent 70%)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5 }}
        className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center gap-6"
      >
        <h2 className="text-display-md text-[var(--ls-fg)]">
          Start monitoring Florida in minutes.
        </h2>
        <p className="text-lg text-[var(--ls-fg-2)]">
          No contracts. Cancel any time. County plan from $149/month.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button
            render={<Link href="/pricing" />}
            nativeButton={false}
            size="lg"
            className="bg-indigo-500 hover:bg-indigo-600 text-white border-0 shadow-[0_0_20px_rgba(99,102,241,0.35)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all px-6"
          >
            Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            render={<Link href="/contact?type=sales" />}
            nativeButton={false}
            variant="outline"
            size="lg"
            className="border-[var(--ls-border-2)] bg-transparent text-[var(--ls-fg-2)] hover:border-[#6366f1] hover:text-[var(--ls-fg)] px-6"
          >
            Talk to Sales
          </Button>
        </div>
      </motion.div>
    </section>
  )
}
