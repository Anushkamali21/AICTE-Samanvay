import {
  ArrowLeft,
  ArrowUpRight,
  BadgeCheck,
  Building2,
  CalendarDays,
  CheckCircle2,
  Download,
  ExternalLink,
  FileText,
  GitMerge,
  Lock,
  MapPin,
  Plus,
  ShieldCheck,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useData } from '@/data/DataProvider'
import { riskTone } from '@/lib/presentation'
import { cn, DEMO_NOW, formatDate } from '@/lib/utils'
import { CaseGraph } from '@/components/institutions/CaseGraph'
import { CaseTable } from '@/components/cases/CaseTable'
import { BureauBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { Panel, PanelHeader } from '@/components/ui/Panel'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { RiskRing } from '@/components/ui/RiskRing'
import { Tabs } from '@/components/ui/Tabs'
import { useToast } from '@/components/ui/Toast'

const riskFactors = [
  { label: 'Repeat complaints', value: 34, tone: 'saffron' as const },
  { label: 'Severity mix', value: 28, tone: 'danger' as const },
  { label: 'SLA breaches', value: 22, tone: 'amber' as const },
  { label: 'Compliance flags', value: 16, tone: 'violet' as const },
]

export function InstitutionDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { getInstitution, getCasesForInstitution, getOpenCasesForInstitution } = useData()
  const institution = getInstitution(id ?? '')
  const [tab, setTab] = useState('overview')

  const records = useMemo(
    () => (institution ? getCasesForInstitution(institution.id) : []),
    [getCasesForInstitution, institution],
  )
  const openRecords = useMemo(
    () => (institution ? getOpenCasesForInstitution(institution.id) : []),
    [getOpenCasesForInstitution, institution],
  )

  if (!institution) {
    return (
      <Panel>
        <EmptyState
          icon={Building2}
          title="Institution not found"
          description="This institution is not part of the demo dataset. Try the institution directory."
          action={<Button onClick={() => navigate('/institutions')}>Back to institutions</Button>}
        />
      </Panel>
    )
  }

  const tone = riskTone(institution.riskScore)
  const overdue = records.filter((record) => {
    if (record.status === 'Disposed' || record.status === 'Transferred') return false
    return new Date(record.dueAt).getTime() < DEMO_NOW
  }).length
  const bureauCount = new Set(openRecords.map((record) => record.bureau)).size
  const documents = records.flatMap((record) =>
    record.documents.map((document) => ({ ...document, caseNo: record.caseNo, caseId: record.id })),
  )

  return (
    <div>
      <Link
        to="/institutions"
        className="mb-3 inline-flex items-center gap-1.5 text-[10.5px] font-bold text-muted transition hover:text-ink"
      >
        <ArrowLeft className="h-3 w-3" />
        Institution directory
      </Link>

      <Panel className="mb-4 overflow-hidden">
        <div className="relative px-5 pb-5 pt-5">
          <div className="absolute right-0 top-0 h-36 w-64 bg-[radial-gradient(ellipse_at_top_right,rgba(226,135,47,.12),transparent_65%)]" />
          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-line bg-paper text-ink-soft shadow-sm">
                <Building2 className="h-6 w-6" strokeWidth={1.6} />
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-balance text-[25px] leading-tight tracking-[-0.03em] text-ink sm:text-[30px]">
                    {institution.name}
                  </h1>
                  <span className="inline-flex items-center gap-1 rounded-full border border-teal/15 bg-teal-soft px-2 py-1 text-[9px] font-bold text-teal">
                    <BadgeCheck className="h-3 w-3" />
                    {institution.approvalStatus}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[10.5px] text-muted">
                  <span className="font-mono text-[10px] text-ink-soft">{institution.permanentId}</span>
                  <span className="text-line-strong">·</span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {institution.city}, {institution.state}
                  </span>
                  <span className="text-line-strong">·</span>
                  <span>{institution.type}</span>
                  <span className="text-line-strong">·</span>
                  <span className="inline-flex items-center gap-1">
                    <CalendarDays className="h-3 w-3" />
                    Approved till {institution.approvedTill}
                  </span>
                  <span className="text-line-strong">·</span>
                  <a
                    href={`https://${institution.website}`}
                    className="inline-flex items-center gap-1 font-semibold text-blue transition hover:text-saffron"
                    onClick={(event) => {
                      event.preventDefault()
                      toast({
                        title: 'External link',
                        description: `Production would open https://${institution.website}. Demo links are stubbed.`,
                        tone: 'info',
                      })
                    }}
                  >
                    {institution.website}
                    <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  <span className="rounded-md border border-line bg-paper px-2 py-1 text-[9px] font-semibold text-ink-soft">
                    Alias: {institution.shortName}
                  </span>
                  <span className="rounded-md border border-line bg-paper px-2 py-1 text-[9px] font-semibold text-ink-soft">
                    Alias: {institution.name.replace(' Institute of Technology', ' Inst. of Tech.')}
                  </span>
                  <span className="rounded-md border border-teal/15 bg-teal-soft px-2 py-1 text-[9px] font-semibold text-teal">
                    Identity verified
                  </span>
                </div>
              </div>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-3 lg:flex-col lg:items-end">
              <div className="flex items-center gap-3 rounded-xl border border-line bg-paper/60 px-3 py-2">
                <RiskRing score={institution.riskScore} size={78} stroke={7} />
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-muted">Institution risk</p>
                  <p className={cn('mt-0.5 text-[11px] font-bold', tone.text)}>
                    {institution.riskScore >= 75 ? 'High attention' : institution.riskScore >= 60 ? 'Elevated' : 'Monitor'}
                  </p>
                  <p className="mt-0.5 text-[9px] text-muted">Based on open cases</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  leadingIcon={<GitMerge className="h-3.5 w-3.5" />}
                  onClick={() =>
                    toast({
                      title: 'Coordination check complete',
                      description: '2 cross-bureau overlaps and 1 duplicate candidate found.',
                      tone: 'warning',
                    })
                  }
                >
                  Check overlaps
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  leadingIcon={<Plus className="h-3.5 w-3.5" />}
                  onClick={() => navigate('/triage')}
                >
                  Open case
                </Button>
              </div>
            </div>
          </div>

          {bureauCount > 1 ? (
            <div className="relative mt-4 flex flex-col gap-2 rounded-lg border border-saffron/25 bg-saffron-soft/65 px-3.5 py-2.5 sm:flex-row sm:items-center">
              <GitMerge className="h-4 w-4 shrink-0 text-saffron" />
              <p className="text-[11px] font-semibold text-ink-soft">
                <span className="font-bold text-ink">{openRecords.length} open cases across {bureauCount} bureaus/cells.</span>{' '}
                Coordination is recommended before the next institution notice is issued.
              </p>
              <Link
                to="/overlaps"
                className="ml-auto inline-flex shrink-0 items-center gap-1 text-[10px] font-bold text-saffron hover:text-ink"
              >
                Review queue
                <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
          ) : null}
        </div>

        <div className="grid grid-cols-2 divide-x divide-line border-t border-line sm:grid-cols-4">
          {[
            { label: 'Open cases', value: openRecords.length, note: 'Across all owners' },
            { label: 'Total complaints', value: records.length, note: 'Lifetime in demo' },
            { label: 'Overdue', value: overdue, note: 'Beyond prescribed clock' },
            { label: 'Bureaus involved', value: bureauCount, note: 'Coordination surface' },
          ].map((stat, index) => (
            <div key={stat.label} className={cn('px-5 py-3.5', index > 0 && 'border-l-0 sm:border-l')}>
              <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-muted">{stat.label}</p>
              <p className="mt-1 font-display text-[24px] leading-none text-ink">{stat.value}</p>
              <p className="mt-1 text-[9px] text-muted">{stat.note}</p>
            </div>
          ))}
        </div>
      </Panel>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs
          tabs={[
            { id: 'overview', label: 'Overview' },
            { id: 'cases', label: 'Cases', count: records.length },
            { id: 'programmes', label: 'Programmes', count: institution.programmes.length },
            { id: 'documents', label: 'Documents', count: documents.length },
          ]}
          value={tab}
          onChange={setTab}
          className="w-full sm:w-auto"
        />
        <p className="text-[9px] text-muted">Last inspection {institution.lastInspection}</p>
      </div>

      {tab === 'overview' ? (
        <div className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-12">
            <Panel className="lg:col-span-7">
              <PanelHeader
                eyebrow="Case family"
                title="How this institution's cases connect"
                description="Open cases are grouped around the institution. Amber edges indicate a confirmed or suggested link."
                action={<BureauBadge bureau="PGRC" compact />}
              />
              <CaseGraph institution={institution} records={openRecords.length ? openRecords : records} className="px-3 pb-3" />
            </Panel>

            <div className="space-y-4 lg:col-span-5">
              <Panel>
                <PanelHeader
                  eyebrow="Risk composition"
                  title="Why this score?"
                  description="Explainable contributors to the institution risk score."
                />
                <div className="space-y-3 px-5 pb-5 pt-3">
                  {riskFactors.map((factor) => (
                    <div key={factor.label}>
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-[10.5px] font-semibold text-ink-soft">{factor.label}</span>
                        <span className="text-[10px] font-bold text-ink">{factor.value}%</span>
                      </div>
                      <ProgressBar value={factor.value * 2.4} tone={factor.tone} height={4} />
                    </div>
                  ))}
                  <p className="pt-1 text-[9px] leading-relaxed text-muted">
                    Score is advisory. It prioritises review and never triggers automatic action.
                  </p>
                </div>
              </Panel>

              <Panel>
                <PanelHeader
                  eyebrow="Compliance snapshot"
                  title="Institution context"
                  action={<ShieldCheck className="h-4 w-4 text-teal" />}
                />
                <div className="divide-y divide-line/70 px-5 pb-3">
                  {[
                    { label: 'Approval status', value: `${institution.approvalStatus} · till ${institution.approvedTill}`, good: true },
                    { label: 'Programmes', value: `${institution.programmes.filter((programme) => programme.status === 'Approved').length} approved · ${institution.programmes.filter((programme) => programme.status !== 'Approved').length} under review`, good: true },
                    { label: 'Last inspection', value: institution.lastInspection, good: true },
                    { label: 'Building safety', value: 'Valid till Mar 2027', good: true },
                    { label: 'Open vigilance flag', value: 'None in demo data', good: true },
                  ].map((row) => (
                    <div key={row.label} className="flex items-start gap-2 py-2.5">
                      <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-teal" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[9.5px] font-bold uppercase tracking-[0.08em] text-muted">{row.label}</p>
                        <p className="mt-0.5 text-[10.5px] font-semibold text-ink-soft">{row.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>
            </div>
          </div>

          <Panel>
            <PanelHeader
              eyebrow="Complaint history"
              title="All cases for this institution"
              description="Raw complaints are consolidated into actionable cases with a complete audit trail."
              action={
                <Link
                  to="/cases"
                  className="inline-flex items-center gap-1 text-[10px] font-bold text-saffron transition hover:text-ink"
                >
                  Open registry
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              }
            />
            <div className="mt-3">
              <CaseTable records={records} showInstitution={false} compact />
            </div>
          </Panel>
        </div>
      ) : null}

      {tab === 'cases' ? (
        <Panel>
          <PanelHeader
            eyebrow="Registry"
            title={`${records.length} cases linked to ${institution.shortName}`}
            description="Every case carries an owner, status, SLA clock and immutable action history."
          />
          <div className="mt-3">
            <CaseTable records={records} showInstitution={false} />
          </div>
        </Panel>
      ) : null}

      {tab === 'programmes' ? (
        <Panel>
          <PanelHeader
            eyebrow="Approval context"
            title="Programmes and sanctioned intake"
            description="Complaint patterns often cluster around a programme or intake change."
            action={<span className="text-[9px] font-semibold text-muted">APH 2026–27</span>}
          />
          <div className="overflow-x-auto scroll-area">
            <table className="mt-3 w-full min-w-[640px] text-left">
              <thead>
                <tr className="border-y border-line bg-paper/50">
                  <th className="px-5 py-2.5 text-[9px] font-bold uppercase tracking-[0.14em] text-muted">Programme</th>
                  <th className="px-4 py-2.5 text-[9px] font-bold uppercase tracking-[0.14em] text-muted">Level</th>
                  <th className="px-4 py-2.5 text-[9px] font-bold uppercase tracking-[0.14em] text-muted">Sanctioned intake</th>
                  <th className="px-4 py-2.5 text-[9px] font-bold uppercase tracking-[0.14em] text-muted">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/70">
                {institution.programmes.map((programme) => (
                  <tr key={programme.name} className="transition hover:bg-paper/50">
                    <td className="px-5 py-3 text-[11.5px] font-semibold text-ink">{programme.name}</td>
                    <td className="px-4 py-3 text-[10.5px] text-muted">{programme.level}</td>
                    <td className="px-4 py-3 font-mono text-[10.5px] text-ink-soft">{programme.intake}</td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9.5px] font-bold',
                          programme.status === 'Approved'
                            ? 'border-teal/15 bg-teal-soft text-teal'
                            : programme.status === 'Under review'
                              ? 'border-saffron/20 bg-saffron-soft text-saffron'
                              : 'border-danger/15 bg-danger-soft text-danger',
                        )}
                      >
                        <span className={cn('h-1.5 w-1.5 rounded-full', programme.status === 'Approved' ? 'bg-teal' : programme.status === 'Under review' ? 'bg-saffron' : 'bg-danger')} />
                        {programme.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      ) : null}

      {tab === 'documents' ? (
        <Panel>
          <PanelHeader
            eyebrow="Evidence"
            title="Documents across cases"
            description="Sealed documents are visible only to authorised cell officers."
            action={<span className="text-[9px] font-semibold text-muted">{documents.length} files</span>}
          />
          <div className="divide-y divide-line/70 px-5 pb-3 pt-2">
            {documents.map((document) => (
              <div key={document.id} className="flex items-center gap-3 py-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-line bg-paper text-muted">
                  {document.sealed ? <Lock className="h-3.5 w-3.5" /> : <FileText className="h-3.5 w-3.5" />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11px] font-semibold text-ink">{document.name}</p>
                  <p className="mt-0.5 text-[9px] text-muted">
                    {document.kind} · {document.size} · {formatDate(document.uploadedAt)} · {document.uploadedBy}
                  </p>
                </div>
                <Link
                  to={`/cases/${document.caseId}`}
                  className="hidden text-[9px] font-bold text-muted transition hover:text-saffron sm:block"
                >
                  {document.caseNo}
                </Link>
                <button
                  type="button"
                  onClick={() =>
                    toast({
                      title: document.sealed ? 'Sealed document' : 'Document download',
                      description: document.sealed
                        ? 'Switch to the Cell Officer persona to request access.'
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
        </Panel>
      ) : null}
    </div>
  )
}
