import { cn } from '@/lib/utils'
import type { ApiEndpoint } from '@/lib/types'
import { ParamTable } from './param-table'

const METHOD_COLORS: Record<string, string> = {
  GET: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  POST: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  PUT: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  DELETE: 'bg-red-500/15 text-red-400 border-red-500/20',
  PATCH: 'bg-violet-500/15 text-violet-400 border-violet-500/20',
}

interface EndpointCardProps {
  endpoint: ApiEndpoint
}

export function EndpointCard({ endpoint }: EndpointCardProps) {
  return (
    <div className="rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-[var(--ls-border)] px-4 py-3">
        <span
          className={cn(
            'inline-flex items-center rounded border px-2 py-0.5 text-xs font-bold font-mono',
            METHOD_COLORS[endpoint.method]
          )}
        >
          {endpoint.method}
        </span>
        <code className="text-sm font-mono text-[var(--ls-fg)]">{endpoint.path}</code>
      </div>

      <div className="p-4 flex flex-col gap-4">
        <p className="text-sm text-[var(--ls-fg-2)]">{endpoint.description}</p>
        {endpoint.params.length > 0 && <ParamTable params={endpoint.params} />}
      </div>
    </div>
  )
}
