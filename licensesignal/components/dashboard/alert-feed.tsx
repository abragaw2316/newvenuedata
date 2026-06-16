'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell } from 'lucide-react'
import { MOCK_LICENSES } from '@/lib/mock-data'
import { getEventBadgeColor } from '@/lib/utils'

interface Alert {
  id: string
  businessName: string
  licenseType: string
  county: string
  eventType: string
  ago: string
}

function toAlert(record: (typeof MOCK_LICENSES)[0], ago: string): Alert {
  return {
    id: record.id + ago,
    businessName: record.businessName,
    licenseType: record.licenseType,
    county: record.address.county,
    eventType: record.eventType,
    ago,
  }
}

const INITIAL_ALERTS = MOCK_LICENSES.slice(0, 5).map((r, i) =>
  toAlert(r, `${(i + 1) * 4}m ago`)
)

export function AlertFeed() {
  const [alerts, setAlerts] = useState<Alert[]>(INITIAL_ALERTS)
  const alertsRef = useState(8)[0]

  useEffect(() => {
    let idx = 5
    const interval = setInterval(() => {
      const record = MOCK_LICENSES[idx % MOCK_LICENSES.length]
      const newAlert = toAlert(record, 'just now')
      setAlerts((prev) => [newAlert, ...prev.slice(0, 9)])
      idx++
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-[var(--ls-fg-3)]" />
          <span className="text-sm font-medium text-[var(--ls-fg-2)]">Live Alerts</span>
        </div>
        <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulseGlow" />
      </div>

      <div className="flex flex-col gap-2">
        <AnimatePresence initial={false}>
          {alerts.map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="rounded-lg border border-[var(--ls-border)] bg-[var(--ls-surface)] p-3 flex flex-col gap-1"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs font-medium text-[var(--ls-fg)] leading-tight truncate">
                  {alert.businessName}
                </p>
                <span className="text-[10px] text-[var(--ls-fg-3)] whitespace-nowrap">{alert.ago}</span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="inline-flex items-center rounded-full border border-indigo-500/20 bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-medium text-indigo-400">
                  {alert.licenseType}
                </span>
                <span className="text-[10px] text-[var(--ls-fg-3)]">{alert.county}</span>
                <span className={`inline-flex items-center rounded-full border px-1.5 py-0.5 text-[10px] font-medium ${getEventBadgeColor(alert.eventType as any)}`}>
                  {alert.eventType.replace('_', ' ')}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
