import {
  Activity,
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  Clock3,
  Download,
  GitMerge,
  Gauge,
  Plus,
  ShieldCheck,
  Timer,
  TrendingDown,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { dashboardKpis, regionLoad } from '@/data/mock'
import { useData } from '@/data/DataProvider'
import { riskTone } from '@/lib/presentation'
import { cn, formatDate, formatNumber } from '@/lib/utils'
import { AgeingChart } from '@/components/charts/AgeingChart'
import { BureauWorkloadChart } from '@/components/charts/BureauWorkloadChart'
import { InflowChart } from '@/components/charts/InflowChart'
import { SlaGauge } from '@/components/charts/SlaGauge'
import { CaseTable } from '@/components/cases/CaseTable'
import { MatchScore } from '@/components/overlaps/MatchScore'
import { Button } from '@/components/ui/Button'
import { BureauBadge, StatusPill } from '@/components/ui/Badge'
import { Panel, PanelHeader } from '@/components/ui/Panel'
import { PageHeader } from '@/components/ui/PageHeader'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { StatCard } from '@/components/ui/StatCard'
import { useToast } from '@/components/ui/Toast'

const inflowSpark = [920, 1010, 980, 1080, 1120, 1180, 1240, 1210, 1284]
const overdueSpark = [142, 136, 128, 124, 116, 108, 104, 100, 96]
const disposalSpark = [24.2, 23.8, 22.9, 21.8, 20.6, 19.7, 19.1, 18.7, 18.4]
const overlapSpark = [12, 16, 18, 22, 24, 28, 31, 34, 37]

const slaRows = [
  { label: 'On track', value: 1102, width: 86, tone: 'teal' as const, note: '86% of open cases' },
  { label: 'Due within 7 days', value: 86, width: 42, tone: 'saffron' as const, note: 'Needs officer action' },
  { label: 'Overdue', value: 96, width: 24, tone: 'danger' as const, note: 'Escalation required' },
]

export function Dashboard() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const {
    cases,
    institutions,
    overlaps,
    getCase,
    getInstitution,
    getOpenCasesForInstitution,
  } = useData()
  const pendingOverlaps = overlaps.filter((overlap) => overlap.status === 'pending')
  const recentCases = [...cases]
    .sort((a, b) => new Date(b.lastActionAt).getTime() - new Date(a.lastActionAt).getTime())
    .slice(0, 7)
  const riskWatchlist = [...institutions].sort((a, b) => b.riskScore - a.riskScore).slice(0, 4)

  return (
    <div>
      <PageHeader
        eyebrow={`Command Centre · ${formatDate('2026-10-26T10:00:00+05:30')}`}
        title="One institution. One case file."
        description="A live view of institution complaints across AICTE bureaus and cells — with cross-bureau overlaps surfaced before they become conflicting actions."
        actions={
          <>
            <Button
              variant="secondary"
              leadingIcon={<Download className="h-3.5 w-3.5" />}
              onClick={() =>
                toast({
                  title: 'Management brief generated',
                  description: 'A one-page PDF brief would download in production. Demo export is stubbed.',
                  tone: 'success',
                })
              }
            >
              Export brief
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

      <Link
        to="/overlaps"
        className="group mb-4 flex flex-col gap-3 overflow-hidden rounded-xl border border-saffron/25 bg-gradient-to-r from-saffron-soft/90 via-saffron-soft/55 to-transparent px-4 py-3.5 transition hover:border-saffron/45 sm:flex-row sm:items-center"
      >
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-saffron/25 bg-surface/70 text-saffron">
          <GitMerge className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[12.5px] font-bold text-ink">
            {pendingOverlaps.length} potential overlaps need coordination
          </p>
          <p className="mt-0.5 text-[11px] leading-relaxed text-ink-soft/75">
            Siddaganga Institute of Technology has open cases in RB, PGRC and the Anti-Ragging Cell. One institution may receive three separate notices.
          </p>
        </div>
        <span className="flex shrink-0 items-center gap-1.5 text-[11px] font-bold text-saffron">
          Review queue
          <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
        </span>
      </Link>

      <div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Active cases"
          value={formatNumber(dashboardKpis.activeCases)}
          delta={`+${dashboardKpis.activeDelta}%`}
          deltaLabel="vs. previous month"
          trend="up"
          good={false}
          icon={Activity}
          sparkData={inflowSpark}
          color="#2f5da8"
        />
        <StatCard
          label="Pending beyond SLA"
          value={formatNumber(dashboardKpis.overdue)}
          delta={`${dashboardKpis.overdueDelta}%`}
          deltaLabel="improvement this month"
          trend="down"
          good
          icon={Clock3}
          sparkData={overdueSpark}
          color="#b42318"
        />
        <StatCard
          label="Avg. disposal time"
          value={dashboardKpis.averageDisposal}
          suffix="days"
          delta={`${dashboardKpis.disposalDelta} days`}
          deltaLabel="faster than last month"
          trend="down"
          good
          icon={Timer}
          sparkData={disposalSpark}
          color="#1b7a6b"
        />
        <StatCard
          label="Overlaps detected"
          value={dashboardKpis.overlaps}
          delta={`+${dashboardKpis.overlapsDelta}`}
          deltaLabel="pending review: 7"
          trend="up"
          good={false}
          icon={GitMerge}
          sparkData={overlapSpark}
          color="#e2872f"
        />
      </div>

      <div className="mb-4 grid gap-4 lg:grid-cols-12">
        <Panel className="lg:col-span-8">
          <PanelHeader
            eyebrow="Volume"
            title="Case inflow"
            description="Received vs. disposed complaints over the last six months."
            action={
              <div className="flex items-center gap-3 text-[9.5px] font-semibold text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue" />
                  Received
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-teal" />
                  Disposed
                </span>
              </div>
            }
          />
          <div className="px-3 pb-3 pt-2">
            <InflowChart />
          </div>
        </Panel>

        <Panel className="lg:col-span-4">
          <PanelHeader
            eyebrow="Timelines"
            title="SLA health"
            description="Compliance against prescribed disposal clocks."
            action={
              <span className="inline-flex items-center gap-1.5 rounded-full border border-teal/15 bg-teal-soft px-2 py-1 text-[9px] font-bold text-teal">
                <ShieldCheck className="h-3 w-3" />
                On watch
              </span>
            }
          />
          <div className="px-4 pb-4 pt-2">
            <SlaGauge value={dashboardKpis.slaCompliance} />
            <div className="mt-2 space-y-2.5">
              {slaRows.map((row) => (
                <div key={row.label}>
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <span className="text-[10.5px] font-semibold text-ink-soft">{row.label}</span>
                    <span className="text-[10px] font-bold text-ink">{formatNumber(row.value)}</span>
                  </div>
                  <ProgressBar value={row.width} tone={row.tone} height={4} />
                  <p className="mt-0.5 text-[8.5px] text-muted">{row.note}</p>
                </div>
              ))}
            </div>
          </div>
        </Panel>
      </div>

      <div className="mb-4 grid gap-4 lg:grid-cols-12">
        <Panel className="lg:col-span-4">
          <PanelHeader
            eyebrow="Distribution"
            title="Bureau & cell workload"
            description="Open cases by current owner."
            action={<span className="text-[9px] font-semibold text-muted">1,284 open</span>}
          />
          <div className="px-2 pb-2 pt-1">
            <BureauWorkloadChart />
          </div>
        </Panel>

        <Panel className="lg:col-span-4">
          <PanelHeader
            eyebrow="Ageing"
            title="Open cases by age"
            description="Where the backlog is sitting."
            action={
              <span className="inline-flex items-center gap-1 text-[9px] font-bold text-danger">
                <AlertTriangle className="h-3 w-3" />
                74 over 90d
              </span>
            }
          />
          <div className="px-3 pb-2 pt-1">
            <AgeingChart />
          </div>
        </Panel>

        <Panel className="lg:col-span-4">
          <PanelHeader
            eyebrow="Geography"
            title="Regional pressure"
            description="Open cases and month-on-month change."
            action={<Gauge className="h-4 w-4 text-muted" />}
          />
          <div className="space-y-2.5 px-5 pb-5 pt-3">
            {regionLoad.slice(0, 5).map((region) => (
              <div key={region.region}>
                <div className="mb-1 flex items-center justify-between gap-2">
                  <span className="text-[10.5px] font-semibold text-ink-soft">{region.region}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-ink">{region.cases}</span>
                    <span
                      className={cn(
                        'inline-flex items-center gap-0.5 text-[8.5px] font-bold',
                        region.change > 0 ? 'text-saffron' : 'text-teal',
                      )}
                    >
                      {region.change > 0 ? (
                        <ArrowUpRight className="h-2.5 w-2.5" />
                      ) : (
                        <TrendingDown className="h-2.5 w-2.5" />
                      )}
                      {Math.abs(region.change)}%
                    </span>
                  </div>
                </div>
                <ProgressBar
                  value={(region.cases / 342) * 100}
                  tone={region.cases > 250 ? 'saffron' : region.cases > 180 ? 'amber' : 'teal'}
                  height={4}
                />
              </div>
            ))}
            <Link
              to="/reports"
              className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold text-ink-soft transition hover:text-saffron"
            >
              Open regional report
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </Panel>
      </div>

      <div className="mb-4 grid gap-4 lg:grid-cols-12">
        <Panel className="lg:col-span-7">
          <PanelHeader
            eyebrow="Coordination required"
            title="Overlap spotlight"
            description="The same institution, different owners, one coordinated response."
            action={
              <Link to="/overlaps" className="text-[10px] font-bold text-saffron transition hover:text-ink">
                View all 7
              </Link>
            }
          />
          <div className="grid gap-3 p-4 sm:grid-cols-2">
            {pendingOverlaps.slice(0, 2).map((overlap) => {
              const institution = getInstitution(overlap.institutionId)
              const caseA = getCase(overlap.caseAId)
              const caseB = getCase(overlap.caseBId)
              if (!institution || !caseA || !caseB) return null
              return (
                <Link
                  key={overlap.id}
                  to="/overlaps"
                  className="group rounded-xl border border-line bg-paper/40 p-3.5 transition hover:-translate-y-0.5 hover:border-saffron/30 hover:bg-surface hover:shadow-card"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-[11.5px] font-bold text-ink">{institution.shortName}</p>
                      <p className="mt-0.5 font-mono text-[8.5px] text-muted">{institution.permanentId}</p>
                    </div>
                    <MatchScore score={overlap.score} size={52} />
                  </div>
                  <div className="mt-3 space-y-1.5">
                    {[caseA, caseB].map((record) => (
                      <div key={record.id} className="flex items-center gap-2">
                        <span className="font-mono text-[8px] text-muted">{record.caseNo.slice(-5)}</span>
                        <span className="min-w-0 flex-1 truncate text-[9.5px] font-medium text-ink-soft">
                          {record.title}
                        </span>
                        <BureauBadge bureau={record.bureau} compact className="px-1.5 py-0.5 text-[8px]" />
                      </div>
                    ))}
                  </div>
                  <p className="mt-2.5 line-clamp-2 text-[9.5px] leading-relaxed text-muted">
                    {overlap.reasons.slice(0, 2).join(' · ')}
                  </p>
                  <span className="mt-2 inline-flex items-center gap-1 text-[9.5px] font-bold text-saffron">
                    Review overlap
                    <ArrowUpRight className="h-3 w-3 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </Link>
              )
            })}
          </div>
        </Panel>

        <Panel className="lg:col-span-5">
          <PanelHeader
            eyebrow="Institution risk"
            title="Watchlist"
            description="Repeat complaints, severity and overdue cases."
            action={
              <Link to="/institutions" className="text-[10px] font-bold text-saffron transition hover:text-ink">
                All institutions
              </Link>
            }
          />
          <div className="divide-y divide-line/70 px-5 pb-2">
            {riskWatchlist.map((institution) => {
              const tone = riskTone(institution.riskScore)
              const open = getOpenCasesForInstitution(institution.id).length
              return (
                <Link
                  key={institution.id}
                  to={`/institutions/${institution.id}`}
                  className="group flex items-center gap-3 py-3 transition"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[11.5px] font-bold text-ink transition group-hover:text-saffron">
                      {institution.shortName}
                    </p>
                    <p className="mt-0.5 text-[9.5px] text-muted">
                      {institution.city} · {open} open case{open === 1 ? '' : 's'}
                    </p>
                    <ProgressBar
                      value={institution.riskScore}
                      tone={
                        institution.riskScore >= 75
                          ? 'danger'
                          : institution.riskScore >= 60
                            ? 'saffron'
                            : 'amber'
                      }
                      height={3}
                      className="mt-1.5 max-w-[180px]"
                    />
                  </div>
                  <span
                    className={cn(
                      'inline-flex min-w-11 justify-center rounded-md border px-2 py-1 text-[10px] font-bold',
                      tone.bg,
                      tone.text,
                      tone.border,
                    )}
                  >
                    {institution.riskScore}
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-muted transition group-hover:text-saffron" />
                </Link>
              )
            })}
          </div>
        </Panel>
      </div>

      <Panel>
        <PanelHeader
          eyebrow="Latest activity"
          title="Recent cases"
          description="A cross-bureau view of the most recently touched cases."
          action={
            <Link
              to="/cases"
              className="inline-flex items-center gap-1 text-[10px] font-bold text-saffron transition hover:text-ink"
            >
              View all cases
              <ArrowRight className="h-3 w-3" />
            </Link>
          }
        />
        <div className="mt-3">
          <CaseTable records={recentCases} />
        </div>
      </Panel>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-[9px] text-muted">
        <StatusPill status="Under process" size="sm" />
        <span>Snapshot generated from synthetic demo data.</span>
        <span className="text-line-strong">·</span>
        <span>Institution master sourced from public AICTE listings.</span>
      </div>
    </div>
  )
}
