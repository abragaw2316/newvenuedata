import type { ApiParam } from '@/lib/types'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface ParamTableProps {
  params: ApiParam[]
}

export function ParamTable({ params }: ParamTableProps) {
  return (
    <div className="rounded-lg border border-[var(--ls-border)] overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-[var(--ls-border)] hover:bg-transparent">
            <TableHead className="text-[var(--ls-fg-3)] text-xs font-medium uppercase tracking-widest">Name</TableHead>
            <TableHead className="text-[var(--ls-fg-3)] text-xs font-medium uppercase tracking-widest">Type</TableHead>
            <TableHead className="text-[var(--ls-fg-3)] text-xs font-medium uppercase tracking-widest">Required</TableHead>
            <TableHead className="text-[var(--ls-fg-3)] text-xs font-medium uppercase tracking-widest">Description</TableHead>
            <TableHead className="text-[var(--ls-fg-3)] text-xs font-medium uppercase tracking-widest">Example</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {params.map((param) => (
            <TableRow key={param.name} className="border-[var(--ls-border)] hover:bg-[var(--ls-hover)]">
              <TableCell>
                <code className="text-xs font-mono text-indigo-400">{param.name}</code>
              </TableCell>
              <TableCell>
                <code className="text-xs font-mono text-[var(--ls-fg-3)]">{param.type}</code>
              </TableCell>
              <TableCell>
                {param.required ? (
                  <span className="text-xs font-medium text-amber-400">Required</span>
                ) : (
                  <span className="text-xs text-[var(--ls-fg-3)]">Optional</span>
                )}
              </TableCell>
              <TableCell className="text-xs text-[var(--ls-fg-2)] max-w-[240px]">
                {param.description}
              </TableCell>
              <TableCell>
                <code className="text-xs font-mono text-[var(--ls-fg-3)]">{param.example}</code>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
