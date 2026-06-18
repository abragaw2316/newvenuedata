import type { Metadata } from 'next'
import { LegalPage, type LegalSection } from '@/components/legal/legal-page'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'The terms governing your use of New Venue Data.',
  alternates: { canonical: 'https://newvenuedata.com/terms' },
  robots: { index: true, follow: true },
}

const SECTIONS: LegalSection[] = [
  {
    heading: 'Agreement to Terms',
    blocks: [
      {
        p: 'These Terms of Service ("Terms") govern your access to and use of the New Venue Data website, API, and data services (the "Services") provided by New Venue Data. By accessing or using the Services, you agree to be bound by these Terms. You must be at least 18 years old to use the Services, and you represent that you are. If you are using the Services on behalf of an organization, you represent that you have authority to bind that organization.',
      },
    ],
  },
  {
    heading: 'The Services',
    blocks: [
      {
        p: 'New Venue Data provides structured access to business-entity license records derived from Florida public records, delivered via API, webhooks, and data exports. We may modify, enhance, or discontinue features of the Services at any time. We strive for high availability but do not guarantee uninterrupted access except as set out in a separate written service-level agreement.',
      },
    ],
  },
  {
    heading: 'Accounts & API Keys',
    blocks: [
      {
        p: 'You are responsible for maintaining the confidentiality of your API keys and account credentials, and for all activity that occurs under them. Notify us immediately at austin@newvenuedata.com if you suspect unauthorized use. We may suspend or revoke keys that we reasonably believe are compromised or used in violation of these Terms.',
      },
    ],
  },
  {
    heading: 'Acceptable Use',
    blocks: [
      { p: 'You agree not to:' },
      {
        list: [
          'Use the data for any purpose governed by the Fair Credit Reporting Act (FCRA), including employment, tenant, or individual credit screening.',
          'Resell, sublicense, or redistribute raw data except as expressly permitted in a written agreement.',
          'Exceed your plan rate limits, circumvent access controls, or attempt to disrupt the Services.',
          'Use the Services to violate any applicable law or the rights of any third party.',
          'Reverse engineer, scrape, or attempt to extract the underlying dataset in bulk outside the documented API and export mechanisms.',
        ],
      },
    ],
  },
  {
    heading: 'Plans, Billing & Trials',
    blocks: [
      {
        p: 'Paid plans are billed in advance on a monthly or annual basis. Trials, where offered, convert to paid plans unless cancelled before the trial ends. Monthly plans may be cancelled at any time and remain active through the end of the billing period. Annual plans may be cancelled with a prorated refund for unused full months. Fees are non-refundable except as expressly stated.',
      },
    ],
  },
  {
    heading: 'Intellectual Property',
    blocks: [
      {
        p: 'The underlying public records are not owned by New Venue Data. However, our normalization, enrichment, structuring, software, documentation, and brand are our intellectual property. Subject to these Terms, we grant you a limited, non-exclusive, non-transferable license to access and use the Services and the delivered data for your internal business purposes.',
      },
    ],
  },
  {
    heading: 'Disclaimers',
    blocks: [
      {
        p: 'The Services and data are provided "as is" and "as available." While we work to ensure accuracy, public records can contain errors, omissions, and delays. We disclaim all warranties, express or implied, including merchantability, fitness for a particular purpose, and non-infringement. You are responsible for verifying data before relying on it for any decision.',
      },
    ],
  },
  {
    heading: 'Limitation of Liability',
    blocks: [
      {
        p: 'To the maximum extent permitted by law, New Venue Data will not be liable for any indirect, incidental, special, consequential, or punitive damages, or for lost profits or revenues. Our total liability for any claim arising out of the Services will not exceed the amounts you paid us in the twelve months preceding the claim.',
      },
    ],
  },
  {
    heading: 'Termination',
    blocks: [
      {
        p: 'You may stop using the Services at any time. We may suspend or terminate your access for violation of these Terms or for any conduct that we reasonably believe harms the Services or other users. Upon termination, your right to access the Services and data ceases.',
      },
    ],
  },
  {
    heading: 'Governing Law & Changes',
    blocks: [
      {
        p: 'These Terms are governed by the laws of the State of Florida, without regard to conflict-of-laws principles. We may update these Terms from time to time; material changes will be posted here with a revised "Last updated" date. Continued use after changes take effect constitutes acceptance.',
      },
    ],
  },
]

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      lastUpdated="June 18, 2026"
      intro="These terms set out the rules for using New Venue Data. Please read them carefully."
      sections={SECTIONS}
    />
  )
}
