import type { Metadata } from 'next'
import { LegalPage, type LegalSection } from '@/components/legal/legal-page'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How New Venue Data collects, uses, and protects information.',
  alternates: { canonical: 'https://newvenuedata.com/privacy' },
  robots: { index: true, follow: true },
}

const SECTIONS: LegalSection[] = [
  {
    heading: 'Overview',
    blocks: [
      {
        p: 'New Venue Data ("New Venue Data," "we," "us") provides business-intelligence data derived from Florida public records. This Privacy Policy explains how we handle information collected through our website, API, and related services (collectively, the "Services").',
      },
      {
        p: 'Our core product describes business entities — not individual consumers. The license data we distribute is sourced from public records published by the Florida Department of Business and Professional Regulation (DBPR) and other government bodies.',
      },
    ],
  },
  {
    heading: 'Information We Collect',
    blocks: [
      { p: 'We collect the following categories of information:' },
      {
        list: [
          'Account information you provide — name, business email, company name, and role — when you request access, contact us, or create an account.',
          'Usage data — API request metadata, log data, IP address, browser type, and pages visited — collected automatically to operate and secure the Services.',
          'Communications — the contents of messages you send us via forms or email.',
          'Public records data — business-entity license records that constitute our product. This is not personal data about you as a website visitor.',
        ],
      },
    ],
  },
  {
    heading: 'How We Use Information',
    blocks: [
      { p: 'We use the information we collect to:' },
      {
        list: [
          'Provide, maintain, and improve the Services and respond to your requests.',
          'Authenticate API access, enforce rate limits, and prevent abuse.',
          'Send service communications, billing notices, and — where permitted — product updates.',
          'Analyze aggregate usage to improve performance and reliability.',
          'Comply with legal obligations and enforce our Terms of Service.',
        ],
      },
    ],
  },
  {
    heading: 'Legal Basis & FCRA Notice',
    blocks: [
      {
        p: 'New Venue Data is not a consumer reporting agency under the Fair Credit Reporting Act (FCRA). Our data describes business entities and may not be used for FCRA-governed purposes such as employment screening, tenant screening, or individual credit decisions. By using the Services you agree to use the data only for permitted business-to-business purposes.',
      },
    ],
  },
  {
    heading: 'Sharing & Disclosure',
    blocks: [
      { p: 'We do not sell your personal account information. We may share information with:' },
      {
        list: [
          'Service providers (cloud hosting, payment processing, analytics) bound by confidentiality obligations.',
          'Legal and regulatory authorities when required by law or to protect our rights.',
          'A successor entity in connection with a merger, acquisition, or sale of assets.',
        ],
      },
    ],
  },
  {
    heading: 'Data Retention & Security',
    blocks: [
      {
        p: 'We retain account and usage information for as long as your account is active and as needed to provide the Services and meet our legal obligations; you may ask us to delete your account information at any time. We protect information using industry-standard safeguards: encryption in transit (HTTPS/TLS), storage with reputable cloud providers that encrypt data at rest, and passwords kept only as salted cryptographic hashes — never in plain text. No method of transmission or storage is completely secure, and we cannot guarantee absolute security.',
      },
    ],
  },
  {
    heading: 'Your Privacy Rights',
    blocks: [
      { p: 'Depending on where you live, you may have some or all of the following rights regarding your personal information:' },
      {
        list: [
          'Access — request a copy of the personal information we hold about you.',
          'Correct — ask us to fix inaccurate information.',
          'Delete — ask us to delete your account information.',
          'Opt out — unsubscribe from marketing emails, and opt out of any "sale" or "sharing" of personal information (we do not sell your personal account information).',
          'Portability — request a copy of your information in a portable format.',
        ],
      },
      {
        p: 'To exercise any of these rights, email austin@newvenuedata.com. We will respond within the timeframe required by applicable law — including the California Consumer Privacy Act (CCPA/CPRA); the Virginia, Colorado, Connecticut, Texas, and other state privacy laws; and the EU/UK GDPR where they apply. We will not discriminate against you for exercising your rights, and if we deny a request you may have the right to appeal.',
      },
    ],
  },
  {
    heading: 'Children’s Privacy',
    blocks: [
      {
        p: 'New Venue Data is a business-to-business service intended for users who are at least 18 years old. The Services are not directed to children, and we do not knowingly collect personal information from anyone under 13 years of age (or under the minimum age required in your jurisdiction). Consistent with the Children’s Online Privacy Protection Act (COPPA), if we learn that we have collected personal information from a child under 13, we will delete it promptly. If you believe a child has provided us with personal information, contact austin@newvenuedata.com and we will remove it.',
      },
    ],
  },
  {
    heading: 'Marketing Communications',
    blocks: [
      {
        p: 'Where permitted by law, we may send business-related emails about our Services. Every marketing email includes a way to opt out, and we honor opt-out requests promptly, as required by the CAN-SPAM Act; our messages identify us and include a valid postal mailing address. You can unsubscribe using the link in any such email or by emailing austin@newvenuedata.com. We will still send essential service and transactional messages (for example, billing notices or security alerts) related to your account.',
      },
    ],
  },
  {
    heading: 'Cookies & Analytics',
    blocks: [
      {
        p: 'We use essential cookies to operate the site and may use privacy-respecting analytics to understand aggregate usage. You can control cookies through your browser settings. Where required, we will request your consent before setting non-essential cookies.',
      },
    ],
  },
  {
    heading: 'Changes to This Policy',
    blocks: [
      {
        p: 'We may update this Privacy Policy from time to time. Material changes will be posted on this page with an updated "Last updated" date. Your continued use of the Services after changes take effect constitutes acceptance of the revised policy.',
      },
    ],
  },
]

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      lastUpdated="June 18, 2026"
      intro="Your trust matters. This policy describes what information we collect, how we use it, and the choices you have."
      sections={SECTIONS}
    />
  )
}
