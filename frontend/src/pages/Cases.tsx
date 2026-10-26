import { Download, FolderKanban, Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useData } from '@/data/DataProvider'
import { bureauTones } from '@/lib/presentation'
import { cn, DEMO_NOW, formatNumber } from '@/lib/utils'
import { CaseTable } from '@/components/cases/CaseTable'
import { Button } from '@/components/ui/Button'
import { FilterSelect } from '@/components/ui/FilterSelect'
import { PageHeader } from '@/components/ui/PageHeader'
import { Panel } from '@/components/ui/Panel'
import { SearchInput } from '@/components/ui/SearchInput'
import { Tabs } from '@/components/ui/Tabs'
import { useToast } from '@/components/ui/Toast'

const statusGroups = ['All', 'Open', 'Overdue', 'Disposed', 'Unassigned'] as const

export function Cases() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { cases } = useData()
  const [query, setQuery] = useState('')
  const [statusGroup, setStatusGroup] = useState<(typeof statusGroups)[number]>('All')
  const [bureau, setBureau] = useState('All bureaus')
  const [severity, setSeverity] = useState('All severities')

  const openCases = cases.filter(
    (record) => record.status !== 'Disposed' && record.status !== 'Transferred',
  )
  const overdueCases = openCases.filter((record) => new Date(record.dueAt).getTime() < DEMO_NOW)
  const unassigned = openCases.filter((record) => record.officer === 'Unassigned')
  const disposed = cases.filter((record) => record.status === 'Disposed')

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return cases.filter((record) => {
      const matchesQuery =
        !normalized ||
        record.title.toLowerCase().includes(normalized) ||
        record.caseNo.toLowerCase().includes(normalized) ||
        record.category.toLowerCase().includes(normalized) ||
        record.tags.some((tag) => tag.toLowerCase().includes(normalized))
      const isOpen = record.status !== 'Disposed' && record.status !== 'Transferred'
      const matchesGroup =
        statusGroup === 'All' ||
        (statusGroup === 'Open' && isOpen) ||
        (statusGroup === 'Overdue' &&
          isOpen &&
          new Date(record.dueAt).getTime() < DEMO_NOW) ||
        (statusGroup === 'Disposed' && record.status === 'Disposed') ||
        (statusGroup === 'Unassigned' && isOpen && record.officer === 'Unassigned')
      const matchesBureau = bureau === 'All bureaus' || record.bureau === bureau
      const matchesSeverity = severity === 'All severities' || record.severity === severity
      return matchesQuery && matchesGroup && matchesBureau && matchesSeverity
    })
  }, [bureau, cases, query, severity, statusGroup])

  const bureaus = ['All bureaus', ...Array.from(new Set(cases.map((record) => record.bureau)))]
  const severities = ['All severities', 'Low', 'Medium', 'High', 'Critical']

  return (
    <div>
      <PageHeader
        eyebrow="Case registry"
        title="Every complaint, one accountable file."
        description="A unified registry across PGRC, the Regulation Bureau, cells and regional offices — with SLA clocks, ownership and a complete action history."
        actions={
          <>
            <Button
              variant="secondary"
              leadingIcon={<Download className="h-3.5 w-3.5" />}
              onClick={() =>
                toast({
                  title: 'Case register export queued',
                  description: 'The production build would export a filtered Excel register.',
                  tone: 'info',
                })
              }
            >
              Export register
            </Button>
            <Button
              variant="primary"
              leadingIcon={<Plus className="h-3.5 w-3.5" />}
              onClick={() => navigate('/triage')}
            >
              New complaint
            </Button>
          </>
        }
      />

      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Open cases', value: openCases.length, note: 'Across demo dataset' },
          { label: 'Overdue', value: overdueCases.length, note: 'Past prescribed clock' },
          { label: 'Unassigned', value: unassigned.length, note: 'Awaiting triage' },
          { label: 'Disposed', value: disposed.length, note: 'Closed with order' },
        ].map((stat) => (
          <div key={stat.label} className="panel px-4 py-3.5">
            <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-muted">{stat.label}</p>
            <p className="mt-1 font-display text-[26px] leading-none text-ink">{stat.value}</p>
            <p className="mt-1 text-[9px] text-muted">{stat.note}</p>
          </div>
        ))}
      </div>

      <Panel>
        <div className="flex flex-col gap-3 border-b border-line px-4 py-3.5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <Tabs
              tabs={statusGroups.map((group) => ({
                id: group,
                label: group,
                count:
                  group === 'All'
                    ? cases.length
                    : group === 'Open'
                      ? openCases.length
                      : group === 'Overdue'
                        ? overdueCases.length
                        : group === 'Disposed'
                          ? disposed.length
                          : unassigned.length,
              }))}
              value={statusGroup}
              onChange={(value) => setStatusGroup(value as (typeof statusGroups)[number])}
              variant="pill"
            />
            <div className="flex flex-1 flex-wrap items-center gap-2 lg:justify-end">
              <SearchInput
                value={query}
                onChange={setQuery}
                placeholder="Search case, title, tag…"
                className="w-full sm:w-[250px]"
              />
              <FilterSelect
                label="Bureau"
                value={bureau}
                onChange={(event) => setBureau(event.target.value)}
                options={bureaus.map((entry) => ({ value: entry, label: entry }))}
              />
              <FilterSelect
                label="Severity"
                value={severity}
                onChange={(event) => setSeverity(event.target.value)}
                options={severities.map((entry) => ({ value: entry, label: entry }))}
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-1 text-[9px] font-bold uppercase tracking-[0.12em] text-muted">Bureau mix</span>
            {Array.from(new Set(cases.map((record) => record.bureau))).map((entry) => {
              const tone = bureauTones[entry]
              const count = cases.filter((record) => record.bureau === entry).length
              return (
                <span
                  key={entry}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[9px] font-bold',
                    tone.bg,
                    tone.text,
                    tone.border,
                  )}
                >
                  <span className={cn('h-1.5 w-1.5 rounded-sm', tone.dot)} />
                  {entry}
                  <span className="opacity-60">{count}</span>
                </span>
              )
            })}
          </div>
        </div>

        <CaseTable records={filtered} />
      </Panel>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-[9px] text-muted">
        <FolderKanban className="h-3 w-3" />
        <span>{formatNumber(1284)} active cases in the full system · {cases.length} in the demo registry</span>
        <span className="text-line-strong">·</span>
        <span>SLA clocks are illustrative and configurable</span>
      </div>
    </div>
  )
}
