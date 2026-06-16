import type { Metadata } from 'next'
import { DocsSidebar } from '@/components/layout/docs-sidebar'
import { OnThisPage } from '@/components/docs/on-this-page'
import { DocsSearchTrigger } from '@/components/docs/docs-search-trigger'

export const metadata: Metadata = {
  title: 'Documentation',
  description: 'New Venue Data API documentation. Learn how to integrate real-time Florida license data.',
}

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex gap-0">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0 border-r border-[var(--ls-border)] min-h-[calc(100vh-4rem)] sticky top-16 self-start max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="px-4 pt-6">
            <DocsSearchTrigger />
          </div>
          <DocsSidebar />
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0 px-0 lg:px-8 py-10 max-w-3xl">
          <article>{children}</article>
        </main>

        {/* On this page (right rail) */}
        <aside className="hidden xl:block w-56 flex-shrink-0 sticky top-16 self-start max-h-[calc(100vh-4rem)] overflow-y-auto py-10">
          <OnThisPage />
        </aside>
      </div>
    </div>
  )
}
