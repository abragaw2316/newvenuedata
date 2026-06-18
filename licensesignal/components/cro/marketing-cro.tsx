'use client'

import { usePathname } from 'next/navigation'
import { ExitIntentModal } from '@/components/cro/exit-intent-modal'
import { StickyCta } from '@/components/cro/sticky-cta'

// Routes where conversion overlays would be intrusive (app/docs/preview surfaces).
const SUPPRESSED = ['/dashboard', '/docs', '/analytics', '/search', '/alerts', '/email-preview', '/design']

export function MarketingCro() {
  const pathname = usePathname()
  if (SUPPRESSED.some((p) => pathname === p || pathname.startsWith(p + '/'))) {
    return null
  }
  // NOTE: SocialProofToast was removed — it surfaced fabricated activity
  // ("a distributor just requested API access"), which is dishonest. Don't
  // reintroduce invented social proof; only show real, permissioned activity.
  return (
    <>
      <StickyCta />
      <ExitIntentModal />
    </>
  )
}
