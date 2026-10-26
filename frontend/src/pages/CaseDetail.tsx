import {
  ArrowLeft,
  ArrowRightLeft,
  ArrowUpRight,
  Building2,
  Check,
  CheckCircle2,
  CircleDot,
  Clock3,
  Copy,
  Download,
  FileText,
  GitMerge,
  Inbox,
  Lock,
  Mail,
  MessageSquare,
  Scale,
  Send,
  ShieldAlert,
  Sparkles,
  UserRound,
  Users,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useData } from '@/data/DataProvider'
import type { CaseStatus, TimelineType } from '@/data/types'
import { useRole } from '@/context/RoleContext'
import { slaLabel, slaState } from '@/lib/presentation'
import { cn, daysSince, formatDate, formatDateTime, relativeTime } from '@/lib/utils'
import { Avatar } from '@/components/ui/Avatar'
import { BureauBadge, ConfidentialityBadge, SeverityBadge, StatusPill } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { Modal } from '@/components/ui/Modal'
import { Panel, PanelHeader } from '@/components/ui/Panel'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Tabs } from '@/components/ui/Tabs'
import { useToast } from '@/components/ui/Toast'
import { FilterSelect } from '@/components/ui/FilterSelect'

const timelineIcons: Record<TimelineType, LucideIcon> = {
  intake: Inbox,
  triage: Sparkles,
  assignment: Users,
  notice: Send,
  response: Mail,
  hearing: Scale,
  action: Zap,
  transfer: ArrowRightLeft,
  closure: CheckCircle2,
  note: MessageSquare,
}

const timelineTones: Record<TimelineType, string> = {
  intake: 'border-blue/15 bg-blue-soft text-blue',
  triage: 'border-violet/15 bg-violet-soft text-violet',
  assignment: 'border-line bg-paper text-ink-soft',
  notice: 'border-saffron/20 bg-saffron-soft text-saffron',
  response: 'border-teal/15 bg-teal-soft text-teal',
  hearing: 'border-amber/15 bg-amber-soft text-amber',
  action: 'border-saffron/20 bg-saffron-soft text-saffron',
  transfer: 'border-line bg-paper text-muted',
  closure: 'border-teal/15 bg-teal-soft text-teal',
  note: 'border-line bg-paper text-ink-soft',
}

const steps = ['Intake', 'Triage', 'Investigation', 'Decision', 'Closure']

function stepIndex(status: CaseStatus): number {
  if (status === 'New') return 0
  if (status === 'Triaged') return 1
  if (status === 'Disposed') return 4
  if (status === 'Transferred') return 3
  return 2
}

export function CaseDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { persona, role, canViewSealed, setRole } = useRole()
  const { getCase, getInstitution, getOpenCasesForInstitution, overlaps, recordCaseAction } =
    useData()
  const record = getCase(id ?? '')
  const [tab, setTab] = useState('timeline')
  const [actionOpen, setActionOpen] = useState(false)
  const [actionText, setActionText] = useState('')
  const [actionStatus, setActionStatus] = useState<CaseStatus>('Under process')
  const [actionVisibility, setActionVisibility] = useState<'Internal' | 'Public'>('Internal')
  const [overlapState, setOverlapState] = useState<'idle' | 'loading' | 'done'>('idle')

  const institution = record ? getInstitution(record.institutionId) : undefined
  const linkedCases = record
    ? record.linkedCaseIds.map((linkedId) => getCase(linkedId)).filter(Boolean)
    : []

  if (!record) {
    return (
      <Panel>
        <EmptyState
          icon={FileText}
          title="Case not found"
          description="This case is not part of the demo registry. Return to the case list to pick another record."
          action={<Button onClick={() => navigate('/cases')}>Back to cases</Button>}
        />
      </Panel>
    )
  }

  const restricted = record.confidentiality === 'Sealed' && !canViewSealed
  const timelineEvents = [...record.timeline].sort(
    (a, b) => new Date(b.at).getTime() - new Date(a.at).getTime(),
  )
  const state = slaState(record)
  const elapsed = daysSince(record.receivedAt)
  const slaProgress = Math.min(100, Math.round((elapsed / record.slaDays) * 100))
  const currentStep = stepIndex(record.status)
  const openCases = institution ? getOpenCasesForInstitution(institution.id) : []

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(record.caseNo)
      toast({ title: 'Case ID copied', description: record.caseNo, tone: 'success' })
    } catch {
      toast({ title: 'Copy not available', description: record.caseNo, tone: 'info' })
    }
  }

  const handleAction = async () => {
    if (!actionText.trim()) return
    try {
      await recordCaseAction(record.id, {
        text: actionText.trim(),
        status: actionStatus,
        visibility: actionVisibility,
        actor: persona.name,
      })
      setActionOpen(false)
      setActionText('')
      toast({
        title: 'Action recorded',
        description: `Case ${record.caseNo} updated to “${actionStatus}”.`,
        tone: 'success',
      })
    } catch (caught) {
      toast({
        title: 'Action could not be saved',
        description: caught instanceof Error ? caught.message : 'Please try again.',
        tone: 'danger',
      })
    }
  }

  const handleOverlapCheck = () => {
    setOverlapState('loading')
    window.setTimeout(() => {
      setOverlapState('done')
      toast({
        title: 'Overlap check complete',
        description: '2 potential overlaps and 1 duplicate candidate found for this institution.',
        tone: 'warning',
      })
    }, 1100)
  }

  if (restricted) {
    return (
      <div>
        <Link
          to="/cases"
          className="mb-3 inline-flex items-center gap-1.5 text-[10.5px] font-bold text-muted transition hover:text-ink"
        >
          <ArrowLeft className="h-3 w-3" />
          Case registry
        </Link>
        <Panel className="overflow-hidden">
          <div className="relative px-6 py-12 text-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(180,35,24,.08),transparent_55%)]" />
            <div className="relative mx-auto max-w-lg">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-danger/20 bg-danger-soft text-danger">
                <Lock className="h-6 w-6" />
              </span>
              <p className="kicker mt-4">Sealed case · access restricted</p>
              <h1 className="mt-2 text-[28px] leading-tight tracking-[-0.03em] text-ink">
                This inquiry is protected.
              </h1>
              <p className="mt-2 text-[12px] leading-relaxed text-muted">
                You are viewing as <span className="font-bold text-ink">{role}</span>. Sealed cases are limited to the
                assigned cell and senior management. Case content, identities and documents are not exposed in this view.
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                <Button
                  variant="primary"
                  leadingIcon={<UserRound className="h-3.5 w-3.5" />}
                  onClick={() => {
                    setRole('Cell Officer')
                    toast({
                      title: 'Viewing as Cell Officer',
                      description: 'Sealed case access is now available for this demo.',
                      tone: 'info',
                    })
                  }}
                >
                  Switch to Cell Officer
                </Button>
                <Button
                  variant="secondary"
                  onClick={() =>
                    toast({
                      title: 'Access request sent',
                      description: 'The inquiry committee would receive a justification request in production.',
                      tone: 'info',
                    })
                  }
                >
                  Request access
                </Button>
              </div>
              <p className="mt-4 text-[9px] text-muted/70">
                Every view of a sealed case is itself audited. This is a synthetic demo record.
              </p>
            </div>
          </div>
        </Panel>
      </div>
    )
  }

  return (
    <div>
      <Link
        to="/cases"
        className="mb-3 inline-flex items-center gap-1.5 text-[10.5px] font-bold text-muted transition hover:text-ink"
      >
        <ArrowLeft className="h-3 w-3" />
        Case registry
      </Link>

      <Panel className="mb-4 px-5 py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="group inline-flex items-center gap-1.5 rounded-md border border-line bg-paper px-2 py-1 font-mono text-[9.5px] text-ink-soft transition hover:border-line-strong"
                title="Copy case ID"
              >
                {record.caseNo}
                <Copy className="h-2.5 w-2.5 text-muted transition group-hover:text-ink" />
              </button>
              <StatusPill status={record.status} size="sm" />
              <SeverityBadge severity={record.severity} />
              <ConfidentialityBadge level={record.confidentiality} />
              <BureauBadge bureau={record.bureau} />
            </div>
            <h1 className="mt-2.5 max-w-3xl text-balance text-[25px] leading-[1.1] tracking-[-0.03em] text-ink sm:text-[30px]">
              {record.title}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[10.5px] text-muted">
              {institution ? (
                <Link
                  to={`/institutions/${institution.id}`}
                  className="inline-flex items-center gap-1 font-semibold text-ink-soft transition hover:text-saffron"
                >
                  <Building2 className="h-3 w-3" />
                  {institution.name}
                  <ArrowUpRight className="h-2.5 w-2.5" />
                </Link>
              ) : null}
              <span className="text-line-strong">·</span>
              <span className="font-mono text-[9px]">{institution?.permanentId}</span>
              <span className="text-line-strong">·</span>
              <span>Received {formatDate(record.receivedAt)}</span>
              <span className="text-line-strong">·</span>
              <span className="inline-flex items-center gap-1">
                <Clock3 className="h-3 w-3" />
                {slaLabel(record)}
              </span>
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              leadingIcon={<Zap className="h-3.5 w-3.5" />}
              onClick={() => {
                setActionStatus(record.status)
                setActionOpen(true)
              }}
            >
              Record action
            </Button>
            <Button
              variant="secondary"
              size="sm"
              leadingIcon={<ShieldAlert className="h-3.5 w-3.5" />}
              onClick={() =>
                toast({
                  title: 'Escalation recorded',
                  description: 'Case escalated to the bureau head for review. SLA clock continues.',
                  tone: 'danger',
                })
              }
            >
              Escalate
            </Button>
          </div>
        </div>
      </Panel>

      {overlapState === 'done' ? (
        <div className="mb-4 flex flex-col gap-2 rounded-xl border border-saffron/25 bg-saffron-soft/60 px-4 py-3 sm:flex-row sm:items-center">
          <GitMerge className="h-4 w-4 shrink-0 text-saffron" />
          <div className="min-w-0 flex-1">
            <p className="text-[11.5px] font-bold text-ink">Potential overlapping cases — coordination required</p>
            <p className="mt-0.5 text-[10.5px] text-ink-soft/75">
              This case links to 2 open cases in other bureaus. A consolidated institution response is recommended.
            </p>
          </div>
          <Link
            to="/overlaps"
            className="inline-flex shrink-0 items-center gap-1 text-[10px] font-bold text-saffron hover:text-ink"
          >
            Review matches
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-8">
          <Panel>
            <PanelHeader
              eyebrow="Complaint summary"
              title="What is alleged"
              description={record.summary}
              action={<BureauBadge bureau={record.bureau} compact />}
            />
            <div className="mx-5 mb-4 mt-3 flex flex-wrap gap-1.5">
              {record.tags.map((tag) => (
                <span key={tag} className="rounded-md border border-line bg-paper px-2 py-1 text-[9px] font-semibold text-muted">
                  #{tag}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-px border-t border-line bg-line sm:grid-cols-4">
              {[
                { label: 'Source', value: record.source },
                { label: 'Category', value: record.category },
                { label: 'Sub-category', value: record.subcategory },
                { label: 'Case age', value: `${elapsed} days` },
              ].map((fact) => (
                <div key={fact.label} className="bg-surface px-4 py-3">
                  <p className="text-[8.5px] font-bold uppercase tracking-[0.12em] text-muted">{fact.label}</p>
                  <p className="mt-1 text-[10.5px] font-semibold text-ink">{fact.value}</p>
                </div>
              ))}
            </div>
          </Panel>

          <Panel>
            <div className="px-5 pt-4">
              <Tabs
                tabs={[
                  { id: 'timeline', label: 'Timeline', count: record.timeline.length },
                  { id: 'documents', label: 'Documents', count: record.documents.length },
                  { id: 'linked', label: 'Linked cases', count: linkedCases.length },
                ]}
                value={tab}
                onChange={setTab}
              />
            </div>

            {tab === 'timeline' ? (
              <div className="px-5 pb-5 pt-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-[9.5px] text-muted">Newest activity first · immutable audit record</p>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-2 py-1 text-[8.5px] font-bold text-muted">
                    <Lock className="h-2.5 w-2.5" />
                    Tamper-evident
                  </span>
                </div>
                <div className="space-y-0">
                  {timelineEvents.map((event, index) => {
                    const Icon = timelineIcons[event.type]
                    const isLast = index === timelineEvents.length - 1
                    return (
                      <div key={event.id} className="relative flex gap-3 pb-5">
                        {!isLast ? (
                          <span className="absolute left-[15px] top-8 h-[calc(100%-1.5rem)] w-px bg-line" />
                        ) : null}
                        <span
                          className={cn(
                            'relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full border',
                            timelineTones[event.type],
                          )}
                        >
                          <Icon className="h-3.5 w-3.5" />
                        </span>
                        <div className="min-w-0 flex-1 pt-0.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-[11.5px] font-bold text-ink">{event.title}</p>
                            {event.visibility !== 'Internal' ? (
                              <span className="rounded border border-line bg-paper px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.08em] text-muted">
                                {event.visibility}
                              </span>
                            ) : null}
                          </div>
                          <p className="mt-1 text-[11px] leading-relaxed text-muted">{event.description}</p>
                          <p className="mt-1.5 text-[9px] text-muted/75">
                            {event.actor} · {formatDateTime(event.at)} · {relativeTime(event.at)}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <button
                  type="button"
                  onClick={() => {
                setActionStatus(record.status)
                setActionOpen(true)
              }}
                  className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-line-strong bg-paper/40 py-2.5 text-[10.5px] font-bold text-muted transition hover:border-saffron/40 hover:text-saffron"
                >
                  <Zap className="h-3 w-3" />
                  Record the next action
                </button>
              </div>
            ) : null}

            {tab === 'documents' ? (
              <div className="divide-y divide-line/70 px-5 pb-4 pt-2">
                {record.documents.map((document) => (
                  <div key={document.id} className="flex items-center gap-3 py-3">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-line bg-paper text-muted">
                      {document.sealed ? <Lock className="h-3.5 w-3.5" /> : <FileText className="h-3.5 w-3.5" />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[11px] font-semibold text-ink">{document.name}</p>
                      <p className="mt-0.5 text-[9px] text-muted">
                        {document.kind} · {document.size} · {document.uploadedBy} · {formatDate(document.uploadedAt)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        toast({
                          title: document.sealed ? 'Sealed document' : 'Document download',
                          description: document.sealed
                            ? 'Access is limited to the inquiry committee.'
                            : 'Download is stubbed in the prototype.',
                          tone: document.sealed ? 'warning' : 'info',
                        })
                      }
                      className="grid h-7 w-7 place-items-center rounded-md text-muted transition hover:bg-paper-deep hover:text-ink"
                      aria-label={`Download ${document.name}`}
                    >
                      <Download className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : null}

            {tab === 'linked' ? (
              <div className="space-y-2.5 px-5 pb-5 pt-3">
                {linkedCases.length === 0 ? (
                  <p className="py-6 text-center text-[11.5px] text-muted">No linked cases recorded.</p>
                ) : (
                  linkedCases.map((linked) => {
                    if (!linked) return null
                    const match = overlaps.find(
                      (overlap) =>
                        (overlap.caseAId === record.id && overlap.caseBId === linked.id) ||
                        (overlap.caseBId === record.id && overlap.caseAId === linked.id),
                    )
                    return (
                      <Link
                        key={linked.id}
                        to={`/cases/${linked.id}`}
                        className="group flex items-center gap-3 rounded-xl border border-line bg-paper/40 p-3 transition hover:border-saffron/30 hover:bg-surface"
                      >
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-saffron/20 bg-saffron-soft text-saffron">
                          <GitMerge className="h-3.5 w-3.5" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[11px] font-bold text-ink transition group-hover:text-saffron">
                            {linked.title}
                          </p>
                          <p className="mt-0.5 text-[9px] text-muted">
                            {linked.caseNo} · {linked.bureau}
                          </p>
                        </div>
                        {match ? (
                          <span className="rounded-full border border-saffron/20 bg-saffron-soft px-2 py-1 text-[9px] font-bold text-saffron">
                            {match.score}% match
                          </span>
                        ) : null}
                        <StatusPill status={linked.status} size="sm" />
                      </Link>
                    )
                  })
                )}
              </div>
            ) : null}
          </Panel>
        </div>

        <div className="space-y-4 lg:col-span-4">
          <Panel>
            <PanelHeader
              eyebrow="Case control"
              title="Ownership & clock"
              action={<Clock3 className="h-4 w-4 text-muted" />}
            />
            <div className="px-5 pb-5 pt-3">
              <div className="flex items-center gap-3 rounded-lg border border-line bg-paper/50 p-3">
                <Avatar name={record.officer === 'Unassigned' ? 'Unassigned' : record.officer} size="md" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11.5px] font-bold text-ink">
                    {record.officer === 'Unassigned' ? 'Awaiting assignment' : record.officer}
                  </p>
                  <p className="mt-0.5 text-[9.5px] text-muted">{record.bureau}</p>
                </div>
                <BureauBadge bureau={record.bureau} compact />
              </div>

              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-muted">SLA clock</p>
                  <span
                    className={cn(
                      'text-[10px] font-bold',
                      state === 'overdue' ? 'text-danger' : state === 'due-soon' ? 'text-saffron' : 'text-teal',
                    )}
                  >
                    {slaLabel(record)}
                  </span>
                </div>
                <ProgressBar
                  value={state === 'closed' ? 100 : slaProgress}
                  tone={state === 'overdue' ? 'danger' : state === 'due-soon' ? 'saffron' : state === 'closed' ? 'teal' : 'blue'}
                  height={6}
                />
                <div className="mt-1.5 flex justify-between text-[8.5px] text-muted">
                  <span>Day {Math.min(elapsed, record.slaDays)}</span>
                  <span>Due {formatDate(record.dueAt)}</span>
                </div>
              </div>

              <div className="mt-4 rounded-lg border border-line bg-surface p-3">
                <p className="text-[8.5px] font-bold uppercase tracking-[0.12em] text-muted">Next action</p>
                <p className="mt-1 text-[11px] font-semibold leading-snug text-ink">{record.nextAction}</p>
                <p className="mt-1 text-[9px] text-muted">Target {formatDate(record.nextActionDue)}</p>
              </div>

              <div className="mt-4">
                <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.12em] text-muted">Case progression</p>
                <div className="flex items-center justify-between">
                  {steps.map((step, index) => {
                    const complete = index < currentStep
                    const active = index === currentStep
                    return (
                      <div key={step} className="flex flex-1 flex-col items-center">
                        <span
                          className={cn(
                            'grid h-6 w-6 place-items-center rounded-full border text-[8px] font-bold',
                            complete
                              ? 'border-teal/20 bg-teal-soft text-teal'
                              : active
                                ? 'border-saffron/30 bg-saffron-soft text-saffron'
                                : 'border-line bg-paper text-muted/60',
                          )}
                        >
                          {complete ? <Check className="h-3 w-3" /> : index + 1}
                        </span>
                        <span
                          className={cn(
                            'mt-1 text-center text-[7.5px] font-bold',
                            active ? 'text-ink' : 'text-muted/70',
                          )}
                        >
                          {step}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              <Button
                variant="secondary"
                size="sm"
                className="mt-4 w-full"
                leadingIcon={<GitMerge className="h-3.5 w-3.5" />}
                onClick={handleOverlapCheck}
                disabled={overlapState === 'loading'}
              >
                {overlapState === 'loading' ? 'Checking overlaps…' : 'Run overlap check'}
              </Button>
            </div>
          </Panel>

          <Panel>
            <PanelHeader
              eyebrow="Institution"
              title={institution?.shortName ?? 'Institution'}
              description={`${openCases.length} open cases across ${new Set(openCases.map((entry) => entry.bureau)).size} bureaus`}
              action={
                institution ? (
                  <Link
                    to={`/institutions/${institution.id}`}
                    className="grid h-7 w-7 place-items-center rounded-md text-muted transition hover:bg-paper-deep hover:text-ink"
                    aria-label="Open institution profile"
                  >
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                ) : null
              }
            />
            <div className="px-5 pb-4 pt-2">
              <p className="font-mono text-[9.5px] text-muted">{institution?.permanentId}</p>
              <div className="mt-3 space-y-2">
                {openCases.slice(0, 3).map((entry) => {
                  const masked = entry.confidentiality === 'Sealed' && !canViewSealed
                  return (
                    <Link
                      key={entry.id}
                      to={`/cases/${entry.id}`}
                      className="flex items-center gap-2 rounded-md px-1 py-0.5 transition hover:bg-paper/70"
                    >
                      <CircleDot className="h-2.5 w-2.5 shrink-0 text-muted" />
                      <span className="min-w-0 flex-1 truncate text-[9.5px] text-ink-soft">
                        {masked ? 'Sealed inquiry · restricted' : entry.title}
                      </span>
                      {masked ? (
                        <span className="inline-flex items-center gap-1 rounded border border-danger/15 bg-danger-soft px-1.5 py-0.5 text-[8px] font-bold text-danger">
                          <Lock className="h-2 w-2" />
                          Sealed
                        </span>
                      ) : (
                        <BureauBadge bureau={entry.bureau} compact className="px-1.5 py-0.5 text-[8px]" />
                      )}
                    </Link>
                  )
                })}
              </div>
              <div className="mt-3 flex items-center gap-1.5 rounded-md border border-teal/15 bg-teal-soft px-2 py-1.5 text-[8.5px] font-semibold text-teal">
                <CheckCircle2 className="h-3 w-3" />
                Identity verified against AICTE master
              </div>
            </div>
          </Panel>

          <Panel>
            <PanelHeader
              eyebrow="Audit"
              title="Traceability"
              action={<Lock className="h-4 w-4 text-muted" />}
            />
            <div className="px-5 pb-4 pt-2">
              <div className="space-y-2 text-[9px]">
                <div className="flex justify-between gap-3">
                  <span className="text-muted">Last updated</span>
                  <span className="font-semibold text-ink-soft">{relativeTime(record.lastActionAt)}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-muted">Actions recorded</span>
                  <span className="font-semibold text-ink-soft">{record.timeline.length}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-muted">Visibility</span>
                  <span className="font-semibold text-ink-soft">{record.confidentiality}</span>
                </div>
              </div>
              <div className="mt-3 rounded-md border border-line bg-paper/60 p-2">
                <p className="text-[7.5px] font-bold uppercase tracking-[0.12em] text-muted">Latest event hash</p>
                <p className="mt-1 break-all font-mono text-[8px] leading-relaxed text-ink-soft">
                  a91f4c7e2b8d…e3c6f09a71b2
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  toast({
                    title: 'Audit trail',
                    description: 'Production would open the full append-only event log with hash verification.',
                    tone: 'info',
                  })
                }
                className="mt-2.5 inline-flex items-center gap-1 text-[9.5px] font-bold text-saffron transition hover:text-ink"
              >
                View full audit trail
                <ArrowUpRight className="h-3 w-3" />
              </button>
            </div>
          </Panel>
        </div>
      </div>

      <Modal
        open={actionOpen}
        onClose={() => setActionOpen(false)}
        title="Record an action"
        description={`${record.caseNo} · ${record.title}`}
        footer={
          <>
            <Button variant="ghost" onClick={() => setActionOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAction} disabled={!actionText.trim()}>
              Save action
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
              Action note
            </label>
            <textarea
              value={actionText}
              onChange={(event) => setActionText(event.target.value)}
              rows={4}
              placeholder="What was done, what was found, and what happens next?"
              className="w-full resize-none rounded-lg border border-line-strong bg-surface px-3 py-2.5 text-[12px] leading-relaxed text-ink outline-none transition placeholder:text-muted/70 focus:border-saffron/60 focus:ring-2 focus:ring-saffron/15"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
                Update status
              </label>
              <FilterSelect
                label="Status"
                value={actionStatus}
                onChange={(event) => setActionStatus(event.target.value as CaseStatus)}
                options={[
                  'Under process',
                  'Action initiated',
                  'Awaiting institution',
                  'Under scrutiny',
                  'Escalated',
                  'Disposed',
                ].map((status) => ({ value: status, label: status }))}
                className="w-full [&>select]:w-full"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
                Visibility
              </label>
              <FilterSelect
                label="Visibility"
                value={actionVisibility}
                onChange={(event) => setActionVisibility(event.target.value as 'Internal' | 'Public')}
                options={[
                  { value: 'Internal', label: 'Internal only' },
                  { value: 'Public', label: 'Visible to complainant' },
                ]}
                className="w-full [&>select]:w-full"
              />
            </div>
          </div>
          <div className="rounded-lg border border-line bg-paper/60 p-3 text-[10px] leading-relaxed text-muted">
            This action will be appended to the case timeline with your name, role and timestamp. The audit record cannot
            be edited or deleted.
          </div>
        </div>
      </Modal>
    </div>
  )
}
