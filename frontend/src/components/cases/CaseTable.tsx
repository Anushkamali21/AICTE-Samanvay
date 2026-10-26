import { ArrowUpRight, Lock } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { CaseRecord } from '@/data/types'
import { useRole } from '@/context/RoleContext'
import { useData } from '@/data/DataProvider'
import { slaLabel, slaState } from '@/lib/presentation'
import { cn, daysSince, relativeTime } from '@/lib/utils'
import { Avatar } from '@/components/ui/Avatar'
import { BureauBadge, SeverityBadge, StatusPill } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'

export function CaseTable({
  records,
  showInstitution = true,
  compact = false,
  className,
}: {
  records: CaseRecord[]
  showInstitution?: boolean
  compact?: boolean
  className?: string
}) {
  const { canViewSealed } = useRole()
  const { getInstitution } = useData()

  return (
    <div className={className}>
      <div className="hidden overflow-x-auto scroll-area md:block">
        <table className="w-full min-w-[980px] border-collapse text-left">
          <thead>
            <tr className="border-b border-line bg-paper/50">
              <th className="px-5 py-2.5 text-[9px] font-bold uppercase tracking-[0.14em] text-muted">Case</th>
              {showInstitution ? (
                <th className="px-4 py-2.5 text-[9px] font-bold uppercase tracking-[0.14em] text-muted">Institution</th>
              ) : null}
              <th className="px-4 py-2.5 text-[9px] font-bold uppercase tracking-[0.14em] text-muted">Category</th>
              <th className="px-4 py-2.5 text-[9px] font-bold uppercase tracking-[0.14em] text-muted">Owner</th>
              <th className="px-4 py-2.5 text-[9px] font-bold uppercase tracking-[0.14em] text-muted">Status</th>
              <th className="px-4 py-2.5 text-[9px] font-bold uppercase tracking-[0.14em] text-muted">SLA</th>
              <th className="px-4 py-2.5 text-[9px] font-bold uppercase tracking-[0.14em] text-muted">Officer</th>
              <th className="w-10 px-3 py-2.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line/70">
            {records.map((record) => {
              const institution = getInstitution(record.institutionId)
              const masked = record.confidentiality === 'Sealed' && !canViewSealed
              const state = slaState(record)
              const elapsed = daysSince(record.receivedAt)
              const progress = Math.min(100, Math.round((elapsed / record.slaDays) * 100))
              return (
                <tr key={record.id} className="group transition-colors hover:bg-paper/60">
                  <td className="max-w-[300px] px-5 py-3">
                    <Link to={`/cases/${record.id}`} className="block min-w-0">
                      <p className="flex items-center gap-1.5 truncate text-[12px] font-bold leading-snug text-ink transition group-hover:text-saffron">
                        {masked ? <Lock className="h-3 w-3 shrink-0 text-danger" /> : null}
                        {masked ? 'Sealed inquiry · access restricted' : record.title}
                      </p>
                      <p className="mt-0.5 font-mono text-[9.5px] tracking-tight text-muted">{record.caseNo}</p>
                    </Link>
                  </td>
                  {showInstitution ? (
                    <td className="max-w-[200px] px-4 py-3">
                      {institution ? (
                        <Link
                          to={`/institutions/${institution.id}`}
                          className="block min-w-0 transition hover:text-saffron"
                        >
                          <p className="truncate text-[11.5px] font-semibold text-ink-soft">{institution.shortName}</p>
                          <p className="mt-0.5 text-[9.5px] text-muted">
                            {institution.city}, {institution.state}
                          </p>
                        </Link>
                      ) : (
                        <span className="text-[11px] text-muted">—</span>
                      )}
                    </td>
                  ) : null}
                  <td className="px-4 py-3">
                    <p className="max-w-[150px] truncate text-[11px] font-medium text-ink-soft">
                      {masked ? 'Protected case' : record.category}
                    </p>
                    <div className="mt-1 flex items-center gap-1.5">
                      {masked ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-danger/15 bg-danger-soft px-1.5 py-0.5 text-[9px] font-semibold text-danger">
                          <Lock className="h-2.5 w-2.5" />
                          Sealed
                        </span>
                      ) : (
                        <>
                          <SeverityBadge severity={record.severity} withLabel={false} className="px-1.5 py-0.5" />
                          <span className="text-[9.5px] text-muted">{record.severity}</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {masked ? (
                      <span className="inline-flex items-center gap-1 rounded-md border border-danger/15 bg-danger-soft px-2 py-1 text-[9px] font-bold text-danger">
                        <Lock className="h-2.5 w-2.5" />
                        Restricted
                      </span>
                    ) : (
                      <BureauBadge bureau={record.bureau} compact />
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill status={record.status} size="sm" />
                  </td>
                  <td className="w-[138px] px-4 py-3">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={cn(
                          'text-[9.5px] font-bold',
                          state === 'overdue'
                            ? 'text-danger'
                            : state === 'due-soon'
                              ? 'text-saffron'
                              : state === 'closed'
                                ? 'text-teal'
                                : 'text-muted',
                        )}
                      >
                        {slaLabel(record)}
                      </span>
                      <span className="text-[8.5px] text-muted/70">Day {Math.min(elapsed, record.slaDays)}/{record.slaDays}</span>
                    </div>
                    <ProgressBar
                      value={state === 'closed' ? 100 : progress}
                      tone={state === 'overdue' ? 'danger' : state === 'due-soon' ? 'saffron' : state === 'closed' ? 'teal' : 'blue'}
                      height={4}
                      className="mt-1.5"
                    />
                  </td>
                  <td className="px-4 py-3">
                    {masked ? (
                      <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-muted">
                        <Lock className="h-2.5 w-2.5" />
                        Restricted
                      </span>
                    ) : record.officer === 'Unassigned' ? (
                      <span className="text-[10.5px] font-semibold text-saffron">Unassigned</span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Avatar name={record.officer} size="sm" />
                        <div className="min-w-0">
                          <p className="max-w-[90px] truncate text-[10.5px] font-semibold text-ink-soft">{record.officer}</p>
                          <p className="text-[8.5px] text-muted">{relativeTime(record.lastActionAt)}</p>
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-3">
                    <Link
                      to={`/cases/${record.id}`}
                      className="grid h-7 w-7 place-items-center rounded-md text-muted opacity-0 transition group-hover:opacity-100 hover:bg-paper-deep hover:text-ink"
                      aria-label={`Open ${record.caseNo}`}
                    >
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {compact ? null : (
          <div className="flex items-center justify-between border-t border-line px-5 py-2.5 text-[9.5px] text-muted">
            <span>Showing {records.length} cases · sorted by latest activity</span>
            <span className="hidden items-center gap-1.5 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-teal" />
              Live data
            </span>
          </div>
        )}
        {records.length === 0 ? (
          <div className="px-5 py-10 text-center text-[12px] text-muted">No cases match these filters.</div>
        ) : null}
        <p className="border-t border-line px-5 py-2 text-[9px] text-muted/60">
          Last activity shown as relative time · dates are synthetic
        </p>
      </div>

      <div className="divide-y divide-line/70 md:hidden">
        {records.map((record) => {
          const institution = getInstitution(record.institutionId)
          const masked = record.confidentiality === 'Sealed' && !canViewSealed
          const state = slaState(record)
          const elapsed = daysSince(record.receivedAt)
          const progress = Math.min(100, Math.round((elapsed / record.slaDays) * 100))
          return (
            <Link
              key={record.id}
              to={`/cases/${record.id}`}
              className="block px-4 py-3.5 transition active:bg-paper"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="flex items-center gap-1.5 text-[12px] font-bold leading-snug text-ink">
                    {masked ? <Lock className="h-3 w-3 shrink-0 text-danger" /> : null}
                    {masked ? 'Sealed inquiry · access restricted' : record.title}
                  </p>
                  <p className="mt-1 font-mono text-[9px] text-muted">
                    {record.caseNo}
                    {institution ? ` · ${institution.shortName}` : ''}
                  </p>
                </div>
                <StatusPill status={record.status} size="sm" />
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                {masked ? (
                  <span className="inline-flex items-center gap-1 rounded-md border border-danger/15 bg-danger-soft px-2 py-1 text-[9px] font-bold text-danger">
                    <Lock className="h-2.5 w-2.5" />
                    Restricted
                  </span>
                ) : (
                  <BureauBadge bureau={record.bureau} compact />
                )}
                {masked ? null : <SeverityBadge severity={record.severity} withLabel={false} className="px-1.5 py-0.5" />}
                <span className="text-[9px] text-muted">{masked ? 'Protected case' : record.category}</span>
              </div>
              <div className="mt-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={cn(
                      'text-[9px] font-bold',
                      state === 'overdue'
                        ? 'text-danger'
                        : state === 'due-soon'
                          ? 'text-saffron'
                          : state === 'closed'
                            ? 'text-teal'
                            : 'text-muted',
                    )}
                  >
                    {slaLabel(record)} · Day {Math.min(elapsed, record.slaDays)}/{record.slaDays}
                  </span>
                  <span className="text-[9px] text-muted">{masked ? 'Restricted officer' : record.officer}</span>
                </div>
                <ProgressBar
                  value={state === 'closed' ? 100 : progress}
                  tone={state === 'overdue' ? 'danger' : state === 'due-soon' ? 'saffron' : state === 'closed' ? 'teal' : 'blue'}
                  height={3}
                  className="mt-1.5"
                />
              </div>
            </Link>
          )
        })}
        {records.length === 0 ? (
          <div className="px-4 py-8 text-center text-[12px] text-muted">No cases match these filters.</div>
        ) : null}
        <div className="flex items-center justify-between px-4 py-2.5 text-[9px] text-muted">
          <span>{records.length} cases · latest activity</span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-teal" />
            Live
          </span>
        </div>
      </div>
    </div>
  )
}
