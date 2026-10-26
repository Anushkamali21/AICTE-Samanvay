import {
  ArrowUpRight,
  Check,
  ChevronDown,
  Copy,
  GitMerge,
  Link2,
  Lock,
  Scale,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Overlap, OverlapStatus } from '@/data/types'
import { useRole } from '@/context/RoleContext'
import { useData } from '@/data/DataProvider'
import { bureauTones } from '@/lib/presentation'
import { cn, formatDate, relativeTime } from '@/lib/utils'
import { MatchScore } from '@/components/overlaps/MatchScore'
import { SeverityBadge, StatusPill } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageHeader } from '@/components/ui/PageHeader'
import { Panel, PanelHeader } from '@/components/ui/Panel'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Tabs } from '@/components/ui/Tabs'
import { useToast } from '@/components/ui/Toast'

type TabValue = 'pending' | 'confirmed' | 'dismissed' | 'all'

const kindTone: Record<Overlap['kind'], string> = {
  'Cross-bureau overlap': 'border-saffron/25 bg-saffron-soft text-saffron',
  'Duplicate complaint': 'border-danger/20 bg-danger-soft text-danger',
  'Related case': 'border-violet/20 bg-violet-soft text-violet',
}

function CaseMini({ caseId }: { caseId: string }) {
  const { canViewSealed } = useRole()
  const { getCase, getInstitution } = useData()
  const record = getCase(caseId)
  if (!record) return null
  const institution = getInstitution(record.institutionId)
  const masked = record.confidentiality === 'Sealed' && !canViewSealed
  const tone = bureauTones[record.bureau]
  return (
    <Link
      to={`/cases/${record.id}`}
      className="group block rounded-lg border border-line bg-paper/40 p-3 transition hover:border-line-strong hover:bg-surface"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[8.5px] text-muted">{record.caseNo}</span>
        <StatusPill status={record.status} size="sm" />
      </div>
      <p className="mt-1.5 line-clamp-2 text-[11px] font-bold leading-snug text-ink transition group-hover:text-saffron">
        {masked ? 'Sealed inquiry · access restricted' : record.title}
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        {masked ? (
          <span className="inline-flex items-center gap-1 rounded border border-danger/15 bg-danger-soft px-1.5 py-0.5 text-[8.5px] font-bold text-danger">
            <Lock className="h-2.5 w-2.5" />
            Restricted cell
          </span>
        ) : (
          <>
            <span className={cn('inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[8.5px] font-bold', tone.bg, tone.text, tone.border)}>
              <span className={cn('h-1 w-1 rounded-sm', tone.dot)} />
              {record.bureau}
            </span>
            <SeverityBadge severity={record.severity} withLabel={false} className="px-1.5 py-0.5" />
          </>
        )}
      </div>
      <p className="mt-2 text-[8.5px] text-muted">
        {masked ? 'Protected officer' : record.officer} · {institution?.shortName} · {relativeTime(record.lastActionAt)}
      </p>
    </Link>
  )
}

export function Overlaps() {
  const { toast } = useToast()
  const { canViewSealed } = useRole()
  const {
    overlaps: items,
    getCase,
    getInstitution,
    decideOverlap,
  } = useData()
  const [tab, setTab] = useState<TabValue>('pending')
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ 'ov-1': true })

  const counts = useMemo(
    () => ({
      pending: items.filter((item) => item.status === 'pending').length,
      confirmed: items.filter((item) => item.status === 'confirmed').length,
      dismissed: items.filter((item) => item.status === 'dismissed').length,
      all: items.length,
    }),
    [items],
  )

  const filtered = useMemo(
    () => (tab === 'all' ? items : items.filter((item) => item.status === tab)),
    [items, tab],
  )

  const decide = async (id: string, status: OverlapStatus, label: string) => {
    try {
      await decideOverlap(id, status)
      toast({
        title: label,
        description:
          status === 'confirmed'
            ? 'A coordination task has been created and the decision is in the audit log.'
            : 'The suggestion was dismissed with a reason. The cases remain independent.',
        tone: status === 'confirmed' ? 'success' : 'info',
      })
    } catch (caught) {
      toast({
        title: 'Decision could not be saved',
        description: caught instanceof Error ? caught.message : 'Please try again.',
        tone: 'danger',
      })
    }
  }

  const pendingCount = counts.pending
  const confirmedTotal = 23 + counts.confirmed
  const dismissedTotal = 4 + counts.dismissed

  return (
    <div>
      <PageHeader
        eyebrow="Coordination engine"
        title="The same institution should not surprise us."
        description="A precision-first matching layer that surfaces the same institution across bureaus — without auto-merging, auto-penalising or exposing sealed identities."
        actions={
          <Button
            variant="secondary"
            leadingIcon={<ScanSearch className="h-3.5 w-3.5" />}
            onClick={() =>
              toast({
                title: 'Batch overlap scan started',
                description: 'Scanning 1,284 open cases against institution aliases and multilingual embeddings.',
                tone: 'info',
              })
            }
          >
            Run batch scan
          </Button>
        }
      />

      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: 'Pending review', value: pendingCount, note: 'Human decision required', tone: 'text-saffron' },
          { label: 'Confirmed this month', value: confirmedTotal, note: 'Coordination tasks created', tone: 'text-teal' },
          { label: 'Dismissed', value: dismissedTotal, note: 'Kept independent', tone: 'text-muted' },
          { label: 'Auto-merged', value: 0, note: 'Never without an officer', tone: 'text-ink' },
        ].map((stat) => (
          <div key={stat.label} className="panel px-4 py-3.5">
            <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-muted">{stat.label}</p>
            <p className={cn('mt-1 font-display text-[27px] leading-none', stat.tone)}>{stat.value}</p>
            <p className="mt-1 text-[9px] text-muted">{stat.note}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        <div className="space-y-3 lg:col-span-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <Tabs
              tabs={[
                { id: 'pending', label: 'Pending review', count: counts.pending },
                { id: 'confirmed', label: 'Confirmed', count: counts.confirmed },
                { id: 'dismissed', label: 'Dismissed', count: counts.dismissed },
                { id: 'all', label: 'All', count: counts.all },
              ]}
              value={tab}
              onChange={(value) => setTab(value as TabValue)}
              variant="pill"
            />
            <p className="text-[9px] text-muted">Sorted by match score · newest first</p>
          </div>

          {filtered.length === 0 ? (
            <Panel>
              <EmptyState
                icon={GitMerge}
                title="No overlaps in this view"
                description="Switch tabs to see confirmed or dismissed decisions. New suggestions appear here as complaints are triaged."
                action={<Button onClick={() => setTab('pending')}>Back to pending</Button>}
              />
            </Panel>
          ) : (
            filtered.map((overlap) => {
              const institution = getInstitution(overlap.institutionId)
              const caseA = getCase(overlap.caseAId)
              const caseB = getCase(overlap.caseBId)
              if (!institution || !caseA || !caseB) return null
              const isPending = overlap.status === 'pending'
              const sealedInvolved = [caseA, caseB].some(
                (entry) => entry.confidentiality === 'Sealed',
              )
              const displayReasons =
                sealedInvolved && !canViewSealed
                  ? overlap.reasons.map((reason) =>
                      reason
                        .replace(/sealed anti-ragging inquiry/gi, 'sealed inquiry')
                        .replace(/ragging/gi, 'restricted'),
                    )
                  : overlap.reasons
              const breakdown = [
                { label: 'Institution identity', value: 100 },
                { label: 'Semantic similarity', value: Math.min(98, overlap.score + 12) },
                { label: 'Category match', value: overlap.kind === 'Cross-bureau overlap' ? 72 : 100 },
                { label: 'Temporal proximity', value: Math.max(55, overlap.score - 8) },
                { label: 'Cross-bureau signal', value: overlap.kind === 'Cross-bureau overlap' ? 100 : 40 },
              ]
              const isExpanded = Boolean(expanded[overlap.id])
              return (
                <Panel
                  key={overlap.id}
                  className={cn(
                    'overflow-hidden transition',
                    isPending ? 'border-saffron/25' : overlap.status === 'confirmed' ? 'border-teal/20' : 'opacity-80',
                  )}
                >
                  <div className="flex flex-col gap-3 border-b border-line bg-paper/35 px-4 py-3.5 sm:flex-row sm:items-center">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span className={cn('grid h-9 w-9 shrink-0 place-items-center rounded-lg border', kindTone[overlap.kind])}>
                        {overlap.kind === 'Duplicate complaint' ? <Copy className="h-4 w-4" /> : <GitMerge className="h-4 w-4" />}
                      </span>
                      <div className="min-w-0">
                        <Link
                          to={`/institutions/${institution.id}`}
                          className="truncate text-[12px] font-bold text-ink transition hover:text-saffron"
                        >
                          {institution.name}
                        </Link>
                        <p className="mt-0.5 text-[9px] text-muted">
                          <span className="font-mono">{institution.permanentId}</span> · detected {relativeTime(overlap.detectedAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
                      <span className={cn('rounded-md border px-2 py-1 text-[8.5px] font-bold uppercase tracking-[0.08em]', kindTone[overlap.kind])}>
                        {overlap.kind}
                      </span>
                      {!isPending ? (
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[8.5px] font-bold uppercase tracking-[0.08em]',
                            overlap.status === 'confirmed'
                              ? 'border-teal/20 bg-teal-soft text-teal'
                              : 'border-line bg-paper text-muted',
                          )}
                        >
                          {overlap.status === 'confirmed' ? <Check className="h-2.5 w-2.5" /> : <X className="h-2.5 w-2.5" />}
                          {overlap.status}
                        </span>
                      ) : null}
                      <MatchScore score={overlap.score} size={52} />
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="grid gap-2.5 sm:grid-cols-2">
                      <CaseMini caseId={caseA.id} />
                      <CaseMini caseId={caseB.id} />
                    </div>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {displayReasons.slice(0, 3).map((reason) => (
                        <span key={reason} className="inline-flex items-center gap-1 rounded-md border border-line bg-surface px-2 py-1 text-[9px] font-semibold text-ink-soft">
                          <Check className="h-2.5 w-2.5 text-teal" />
                          {reason}
                        </span>
                      ))}
                      {displayReasons.length > 3 ? (
                        <button
                          type="button"
                          onClick={() => setExpanded((current) => ({ ...current, [overlap.id]: !isExpanded }))}
                          className="inline-flex items-center gap-1 rounded-md border border-line bg-paper px-2 py-1 text-[9px] font-bold text-muted transition hover:text-ink"
                        >
                          +{displayReasons.length - 3} more
                          <ChevronDown className={cn('h-2.5 w-2.5 transition', isExpanded && 'rotate-180')} />
                        </button>
                      ) : null}
                    </div>

                    {isExpanded ? (
                      <div className="mt-3 rounded-lg border border-line bg-paper/40 p-3">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-muted">Why this was flagged</p>
                          <span className="text-[8.5px] text-muted">Illustrative weights</span>
                        </div>
                        <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
                          {breakdown.map((factor) => (
                            <div key={factor.label}>
                              <div className="mb-1 flex items-center justify-between">
                                <span className="text-[9px] font-semibold text-ink-soft">{factor.label}</span>
                                <span className="font-mono text-[8.5px] font-bold text-ink">{factor.value}</span>
                              </div>
                              <ProgressBar
                                value={factor.value}
                                tone={factor.value >= 90 ? 'teal' : factor.value >= 70 ? 'saffron' : 'amber'}
                                height={3}
                              />
                            </div>
                          ))}
                        </div>
                        <p className="mt-2 text-[9px] leading-relaxed text-muted">
                          {displayReasons.join(' · ')}. The score is advisory; an officer confirmed or dismissed every
                          link in this queue.
                        </p>
                      </div>
                    ) : null}

                    <div className="mt-3 rounded-lg border border-line bg-surface px-3 py-2.5">
                      <p className="text-[8.5px] font-bold uppercase tracking-[0.12em] text-muted">Recommended action</p>
                      <p className="mt-1 text-[10.5px] leading-relaxed text-ink-soft">{overlap.recommendation}</p>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {isPending ? (
                        <>
                          <Button
                            variant="primary"
                            size="sm"
                            leadingIcon={overlap.kind === 'Duplicate complaint' ? <Copy className="h-3 w-3" /> : <Link2 className="h-3 w-3" />}
                            onClick={() =>
                              decide(
                                overlap.id,
                                'confirmed',
                                overlap.kind === 'Duplicate complaint' ? 'Duplicate linked' : 'Coordination task created',
                              )
                            }
                          >
                            {overlap.kind === 'Duplicate complaint' ? 'Merge as duplicate' : 'Confirm link'}
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            leadingIcon={<Scale className="h-3 w-3" />}
                            onClick={() =>
                              toast({
                                title: 'Coordination note opened',
                                description: 'A shared note would be visible to both case owners in production.',
                                tone: 'info',
                              })
                            }
                          >
                            Add joint note
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            leadingIcon={<X className="h-3 w-3" />}
                            onClick={() => decide(overlap.id, 'dismissed', 'Suggestion dismissed')}
                          >
                            Dismiss
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          leadingIcon={<ArrowUpRight className="h-3 w-3" />}
                          onClick={() => toast({ title: 'Decision log', description: 'Full decision history is available in the audit panel.', tone: 'info' })}
                        >
                          View decision record
                        </Button>
                      )}
                      <span className="ml-auto text-[8.5px] text-muted">
                        {isPending ? 'No automatic action taken' : `Decided ${formatDate(overlap.detectedAt)}`}
                      </span>
                    </div>
                  </div>
                </Panel>
              )
            })
          )}
        </div>

        <div className="space-y-4 lg:col-span-4">
          <Panel>
            <PanelHeader
              eyebrow="Explainability"
              title="How a match is built"
              description="Two layers, one human decision."
              action={<Sparkles className="h-4 w-4 text-saffron" />}
            />
            <div className="space-y-3 px-5 pb-5 pt-3">
              {[
                {
                  icon: Lock,
                  title: '1 · Resolve the institution',
                  body: 'Exact AICTE Permanent ID first, then verified aliases, then fuzzy name/address matching.',
                },
                {
                  icon: ScanSearch,
                  title: '2 · Compare the case',
                  body: 'Multilingual embeddings, category, entities, dates and cross-bureau signals.',
                },
                {
                  icon: ShieldCheck,
                  title: '3 · Ask an officer',
                  body: 'Suggestions are reviewed. Nothing is merged, escalated or penalised automatically.',
                },
              ].map((step) => (
                <div key={step.title} className="flex gap-2.5">
                  <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-line bg-paper text-ink-soft">
                    <step.icon className="h-3.5 w-3.5" />
                  </span>
                  <div>
                    <p className="text-[10.5px] font-bold text-ink">{step.title}</p>
                    <p className="mt-0.5 text-[9.5px] leading-relaxed text-muted">{step.body}</p>
                  </div>
                </div>
              ))}
              <div className="rounded-lg border border-line bg-paper/50 p-2.5">
                <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-muted">Score sketch</p>
                <p className="mt-1 font-mono text-[8.5px] leading-relaxed text-ink-soft">
                  0.30 identity + 0.25 semantic
                  <br />
                  + 0.15 category + 0.10 entities
                  <br />
                  + 0.10 recency + 0.10 cross-bureau
                </p>
              </div>
            </div>
          </Panel>

          <Panel>
            <PanelHeader
              eyebrow="Guardrails"
              title="Coordination rules"
              action={<Scale className="h-4 w-4 text-muted" />}
            />
            <div className="space-y-2.5 px-5 pb-5 pt-3">
              {[
                'Same Permanent ID + both open + different bureau → always review.',
                'A duplicate is not a merge until an officer confirms the parent case.',
                'Sealed cases share aggregate signals only, never identities or statements.',
                'Every link, merge, dismissal and view is written to the audit trail.',
              ].map((rule, index) => (
                <div key={rule} className="flex gap-2.5">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full border border-line bg-paper text-[8px] font-bold text-muted">
                    {index + 1}
                  </span>
                  <p className="text-[9.5px] leading-relaxed text-ink-soft">{rule}</p>
                </div>
              ))}
            </div>
          </Panel>

          <Panel>
            <PanelHeader
              eyebrow="Recent decisions"
              title="Who decided what"
              action={<span className="text-[9px] font-semibold text-muted">Last 30 days</span>}
            />
            <div className="divide-y divide-line/70 px-5 pb-3 pt-1">
              {[
                { name: 'Ananya Menon', action: 'Confirmed duplicate', caseNo: 'AICTE/2026/00412', time: '2h ago', tone: 'text-teal' },
                { name: 'Vikram Rao', action: 'Created coordination task', caseNo: 'AICTE/2026/00587', time: '5h ago', tone: 'text-saffron' },
                { name: 'Meera Krishnan', action: 'Dismissed suggestion', caseNo: 'AICTE/2026/00603', time: '1d ago', tone: 'text-muted' },
              ].map((entry) => (
                <div key={`${entry.name}-${entry.caseNo}`} className="py-2.5">
                  <p className="text-[10px] font-semibold text-ink">
                    {entry.name} · <span className={entry.tone}>{entry.action}</span>
                  </p>
                  <p className="mt-0.5 font-mono text-[8.5px] text-muted">{entry.caseNo} · {entry.time}</p>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  )
}
