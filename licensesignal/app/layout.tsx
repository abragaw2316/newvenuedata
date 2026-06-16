import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { CookieConsent } from '@/components/shared/cookie-consent'
import { ScrollProgress } from '@/components/shared/scroll-progress'
import { CommandPalette } from '@/components/shared/command-palette'
import { MarketingCro } from '@/components/cro/marketing-cro'

// Applied before paint so there is no theme flash. Defaults to LIGHT; switches to
// dark only when the visitor has explicitly chosen it (persisted in localStorage).
// Keeps the `light`/`dark` classes mutually exclusive (dark also drives Tailwind's
// dark: variant via @custom-variant in globals.css).
const themeScript = `(function(){try{var t=localStorage.getItem('ls-theme');var d=document.documentElement;if(t==='dark'){d.classList.add('dark');d.classList.remove('light')}else{d.classList.add('light');d.classList.remove('dark')}}catch(e){}})();`

export const viewport: Viewport = {
  themeColor: '#fafafb',
  colorScheme: 'light',
}

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://newvenuedata.com'),
  title: {
    default: 'New Venue Data — Real-Time Florida License Intelligence',
    template: '%s | New Venue Data',
  },
  description:
    'Monitor Florida liquor and food-service license filings in real time. Get API access to new business opening signals before your competitors.',
  keywords: [
    'Florida liquor license API',
    'food service license data',
    'business opening intelligence',
    'DBPR license monitoring',
    'beverage distributor leads',
    'restaurant license feed',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://newvenuedata.com',
    siteName: 'New Venue Data',
    title: 'New Venue Data — Know When Businesses Are Opening',
    description:
      'Real-time Florida liquor and food-service license intelligence via API, webhooks, and data exports.',
    images: [{ url: '/og?title=Know+When+Businesses+Are+Opening+Before+Everyone+Else', width: 1200, height: 630, alt: 'New Venue Data' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'New Venue Data — Real-Time Florida License Intelligence',
    description:
      'Monitor Florida license filings the moment they happen. API + webhooks + data exports.',
    images: ['/og?title=Know+When+Businesses+Are+Opening+Before+Everyone+Else'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`light ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--ls-bg)] text-[var(--ls-fg)]">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-indigo-500 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
        >
          Skip to content
        </a>
        <ScrollProgress />
        <Navbar />
        <main id="main-content" className="flex-1">{children}</main>
        <Footer />
        <CommandPalette />
        <MarketingCro />
        <CookieConsent />
      </body>
    </html>
  )
}
