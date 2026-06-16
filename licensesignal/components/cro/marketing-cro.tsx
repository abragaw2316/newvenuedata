'use client'

import { usePathname } from 'next/navigation'
import { ExitIntentModal } from '@/components/cro/exit-intent-modal'
import { StickyCta } from '@/components/cro/sticky-cta'
import { SocialProofToast } from '@/components/cro/social-proof-toast'

// Routes where conversion overlays would be intrusive (app/docs/preview surfaces).
const SUPPRESSED = ['/dashboard', '/docs', '/analytics', '/search', '/alerts', '/email-preview', '/design']

export function MarketingCro() {
  const pathname = usePathname()
  if (SUPPRESSED.some((p) => pathname === p || pathname.startsWith(p + '/'))) {
    return null
  }
  return (
    <>
      <SocialProofToast />
      <StickyCta />
      <ExitIntentModal />
    </>
  )
}
