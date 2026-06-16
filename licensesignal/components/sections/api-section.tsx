'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check, Copy, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SectionHeading } from '@/components/shared/section-heading'

const CURL_COMMAND = `curl -X GET "https://api.newvenuedata.com/v1/licenses" \\
  -H "Authorization: Bearer ls_live_xxxxx" \\
  -G -d "county=miami-dade" \\
  -d "event_type=new_filing" \\
  -d "license_type=SRX" \\
  -d "limit=10"`

const JSON_RESPONSE = `{
  "data": [
    {
      "id": "lic_SRX6601234",
      "licenseNumber": "SRX6601234",
      "licenseType": "SRX",
      "status": "pending",
      "businessName": "Brickell Social Club",
      "address": {
        "street": "801 Brickell Bay Dr",
        "city": "Miami",
        "county": "Miami-Dade",
        "state": "FL",
        "zip": "33131"
      },
      "filedDate": "2026-06-05",
      "eventType": "new_filing",
      "eventTimestamp": "2026-06-05T14:33:08Z"
    }
  ],
  "pagination": {
    "cursor": "cur_eyJpZCI6Im...",
    "hasMore": true,
    "total": 73,
    "limit": 10
  }
}`

const API_FEATURES = [
  'Structured JSON with typed fields — no HTML parsing',
  'Cursor-based pagination for reliable large pulls',
  'Filter by county, type, event, date range, and status',
  'Sub-second response times, 99.9% uptime SLA on Pro+',
]

function TypedText({ text, speed = 18 }: { text: string; speed?: number }) {
  const [displayed, setDisplayed] = useState('')

  useEffect(() => {
    let i = 0
    setDisplayed('')
    const interval = setInterval(() => {
      if (i >= text.length) {
        clearInterval(interval)
        return
      }
      setDisplayed(text.slice(0, i + 1))
      i++
    }, speed)
    return () => clearInterval(interval)
  }, [text, speed])

  return (
    <span>
      {displayed}
      <span className="animate-[typeCursor_0.8s_ease_infinite] border-r border-indigo-400 ml-0.5">&nbsp;</span>
    </span>
  )
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={copy}
      className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-md border border-[var(--ls-border-2)] bg-[var(--ls-border)] text-[var(--ls-fg-3)] hover:text-[var(--ls-fg)] hover:border-[var(--ls-fg-4)] transition-all"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  )
}

export function ApiSection() {
  const [inView, setInView] = useState(false)

  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Code side */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            onViewportEnter={() => setInView(true)}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-4"
          >
            {/* Request block */}
            <div className="relative rounded-lg border border-[var(--ls-border)] bg-[var(--ls-surface-2)] overflow-hidden">
              <div className="flex items-center gap-2 border-b border-[var(--ls-border)] px-4 py-2.5">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--ls-fg-4)]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--ls-fg-4)]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--ls-fg-4)]" />
                </div>
                <span className="text-xs text-[var(--ls-fg-3)]">Request</span>
              </div>
              <CopyButton text={CURL_COMMAND} />
              <pre className="overflow-x-auto p-4 font-mono text-xs leading-6 text-[var(--ls-fg-2)] min-h-[120px]">
                {inView ? <TypedText text={CURL_COMMAND} speed={16} /> : null}
              </pre>
            </div>

            {/* Response block */}
            <div className="relative rounded-lg border border-[var(--ls-border)] bg-[var(--ls-surface-2)] overflow-hidden">
              <div className="flex items-center gap-2 border-b border-[var(--ls-border)] px-4 py-2.5">
                <span className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400">
                  200 OK
                </span>
                <span className="text-xs text-[var(--ls-fg-3)]">Response</span>
              </div>
              <CopyButton text={JSON_RESPONSE} />
              <pre className="overflow-x-auto p-4 font-mono text-xs leading-6 text-[var(--ls-fg-2)] max-h-64">
                <span className="text-[#6366f1]">{'{'}</span>
                {JSON_RESPONSE.slice(1, -1)
                  .split('\n')
                  .map((line, i) => {
                    const keyMatch = line.match(/^(\s*)("[\w]+")(:)(.*)$/)
                    if (keyMatch) {
                      return (
                        <span key={i}>
                          {'\n'}
                          {keyMatch[1]}
                          <span className="text-[#818cf8]">{keyMatch[2]}</span>
                          {keyMatch[3]}
                          <span className="text-[var(--ls-fg-2)]">{keyMatch[4]}</span>
                        </span>
                      )
                    }
                    return <span key={i}>{'\n'}{line}</span>
                  })}
                <span className="text-[#6366f1]">{'}'}</span>
              </pre>
            </div>
          </motion.div>

          {/* Explanation side */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col gap-6"
          >
            <SectionHeading
              eyebrow="Developer API"
              heading="Simple. Predictable. Reliable."
              subtext="One endpoint, consistent JSON, cursor pagination. Integrate in an afternoon, not a sprint."
              align="left"
            />

            <ul className="flex flex-col gap-3">
              {API_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-[var(--ls-fg-2)]">
                  <span className="mt-1 h-4 w-4 flex-shrink-0 rounded-full border border-indigo-500/30 bg-indigo-500/15 flex items-center justify-center">
                    <Check className="h-2.5 w-2.5 text-indigo-400" />
                  </span>
                  {f}
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-3">
              <Button
                render={<Link href="/docs" />}
                nativeButton={false}
                size="sm"
                variant="outline"
                className="border-[var(--ls-border-2)] text-[var(--ls-fg-2)] hover:border-indigo-500/40 hover:text-[var(--ls-fg)]"
              >
                Read the docs
              </Button>
              <Button
                render={<Link href="/contact" />}
                nativeButton={false}
                size="sm"
                className="bg-indigo-500 hover:bg-indigo-600 text-white border-0 shadow-[0_0_15px_rgba(99,102,241,0.3)]"
              >
                Get API key <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
