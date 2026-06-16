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
        p: 'New Venue Data, Inc. ("New Venue Data," "we," "us") provides business-intelligence data derived from Florida public records. This Privacy Policy explains how we handle information collected through our website, API, and related services (collectively, the "Services").',
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
        p: 'We retain account and usage information for as long as your account is active and as needed to comply with our legal obligations. We protect information using encryption in transit (TLS 1.3) and at rest (AES-256), least-privilege access controls, and audit logging. No method of transmission or storage is completely secure, and we cannot guarantee absolute security.',
      },
    ],
  },
  {
    heading: 'Your Rights',
    blocks: [
      {
        p: 'Depending on your jurisdiction, you may have rights to access, correct, delete, or restrict the processing of your personal information. To exercise these rights, email austin@newvenuedata.com. We will respond within the timeframes required by applicable law (including GDPR and CCPA where they apply).',
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
      lastUpdated="June 14, 2026"
      intro="Your trust matters. This policy describes what information we collect, how we use it, and the choices you have."
      sections={SECTIONS}
    />
  )
}
