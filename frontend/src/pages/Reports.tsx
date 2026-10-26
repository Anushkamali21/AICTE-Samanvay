import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  Download,
  FileBarChart,
  FileText,
  GitMerge,
  Printer,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react'
import { useState } from 'react'
import { AgeingChart } from '@/components/charts/AgeingChart'
import { DisposalTrendChart } from '@/components/charts/DisposalTrendChart'
import { ReceivedDisposedChart } from '@/components/charts/ReceivedDisposedChart'
import { Button } from '@/components/ui/Button'
import { PageHeader } from '@/components/ui/PageHeader'
import { Panel, PanelHeader } from '@/components/ui/Panel'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Tabs } from '@/components/ui/Tabs'
import { useToast } from '@/components/ui/Toast'
import { cn, formatNumber } from '@/lib/utils'

const bureauPerformance = [
  { bureau: 'PGRC', received: 1842, disposed: 1690, pending: 486, avg: 17.2, sla: 88, trend: 4.2 },
  { bureau: 'Regulation Bureau', received: 1424, disposed: 1288, pending: 372, avg: 19.6, sla: 84, trend: 2.8 },
  { bureau: 'Anti-Ragging Cell', received: 486, disposed: 412, pending: 128, avg: 12.4, sla: 91, trend: -1.6 },
  { bureau: 'SC/ST Cell', received: 342, disposed: 298, pending: 94, avg: 15.8, sla: 89, trend: 1.2 },
  { bureau: "Women's Cell", received: 276, disposed: 236, pending: 76, avg: 14.1, sla: 92, trend: -0.8 },
  { bureau: 'Legal Cell', received: 198, disposed: 160, pending: 58, avg: 26.8, sla: 76, trend: 3.4 },
  { bureau: 'Vigilance Cell', received: 154, disposed: 126, pending: 42, avg: 24.6, sla: 79, trend: 5.1 },
]

const regionPerformance = [
  { region: 'Southern', open: 342, disposed: 1684, avg: 17.8, highRisk: 64 },
  { region: 'Western', open: 276, disposed: 1420, avg: 18.2, highRisk: 51 },
  { region: 'Northern', open: 221, disposed: 1186, avg: 19.4, highRisk: 48 },
  { region: 'North-West', open: 198, disposed: 1042, avg: 18.9, highRisk: 42 },
  { region: 'Eastern', open: 154, disposed: 896, avg: 20.6, highRisk: 37 },
  { region: 'Central', open: 121, disposed: 702, avg: 21.2, highRisk: 31 },
  { region: 'South-West', open: 96, disposed: 624, avg: 19.1, highRisk: 24 },
  { region: 'South-Central', open: 84, disposed: 588, avg: 20.4, highRisk: 15 },
]

const reportPacks = [
  { name: 'Monthly management pack', period: 'October 2026', type: 'PDF · 12 pages', updated: 'Today, 06:30' },
  { name: 'Bureau-wise ageing report', period: 'Q2 FY 2026–27', type: 'XLSX · 8 sheets', updated: '24 Oct 2026' },
  { name: 'Overlap & duplication audit', period: 'September 2026', type: 'PDF · 6 pages', updated: '01 Oct 2026' },
]

export function Reports() {
  const { toast } = useToast()
  const [range, setRange] = useState('6m')

  return (
    <div>
      <PageHeader
        eyebrow="Reports & analytics"
        title="Evidence for the next decision."
        description="Bureau, region and institution-level performance — with SLA compliance, ageing, disposal quality and the coordination dividend."
        actions={
          <>
            <Tabs
              tabs={[
                { id: '6m', label: '6 months' },
                { id: 'q2', label: 'Q2' },
                { id: 'ytd', label: 'YTD' },
              ]}
              value={range}
              onChange={setRange}
              variant="pill"
            />
            <Button
              variant="secondary"
              leadingIcon={<Printer className="h-3.5 w-3.5" />}
              onClick={() =>
                toast({
                  title: 'Print view prepared',
                  description: 'A print-optimised management brief would open in production.',
                  tone: 'info',
                })
              }
            >
              Print
            </Button>
            <Button
              variant="primary"
              leadingIcon={<Download className="h-3.5 w-3.5" />}
              onClick={() =>
                toast({
                  title: 'Report pack exported',
                  description: 'PDF + Excel export is stubbed in the prototype.',
                  tone: 'success',
                })
              }
            >
              Export pack
            </Button>
          </>
        }
      />

      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: 'Received', value: 6446, delta: '+8.2%', good: false, note: 'Last 6 months' },
          { label: 'Disposed', value: 6054, delta: '+11.4%', good: true, note: 'Last 6 months' },
          { label: 'Avg. disposal', value: '20.3', suffix: 'days', delta: '−2.4 days', good: true, note: 'Weighted across bureaus' },
          { label: 'SLA compliance', value: '86', suffix: '%', delta: '+3.1 pts', good: true, note: 'Target 90%' },
        ].map((stat) => (
          <div key={stat.label} className="panel px-4 py-3.5">
            <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-muted">{stat.label}</p>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="font-display text-[26px] leading-none text-ink">{typeof stat.value === 'number' ? formatNumber(stat.value) : stat.value}</span>
              {stat.suffix ? <span className="text-[10px] font-semibold text-muted">{stat.suffix}</span> : null}
            </div>
            <div className="mt-1 flex items-center gap-1.5">
              <span className={cn('inline-flex items-center gap-0.5 text-[9px] font-bold', stat.good ? 'text-teal' : 'text-saffron')}>
                {stat.good ? <ArrowUpRight className="h-2.5 w-2.5" /> : <ArrowDownRight className="h-2.5 w-2.5" />}
                {stat.delta}
              </span>
              <span className="text-[8.5px] text-muted">{stat.note}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-4 grid gap-4 lg:grid-cols-12">
        <Panel className="lg:col-span-7">
          <PanelHeader
            eyebrow="Throughput"
            title="Received vs. disposed"
            description="Monthly case volume across all bureaus and cells."
            action={
              <div className="flex items-center gap-3 text-[9px] font-semibold text-muted">
                <span className="inline-flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-blue" />Received</span>
                <span className="inline-flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-teal" />Disposed</span>
              </div>
            }
          />
          <div className="px-3 pb-3 pt-2">
            <ReceivedDisposedChart />
          </div>
        </Panel>

        <Panel className="lg:col-span-5">
          <PanelHeader
            eyebrow="Quality"
            title="Disposal time"
            description="Average days to dispose, weighted by bureau."
            action={
              <span className="inline-flex items-center gap-1 rounded-full border border-teal/15 bg-teal-soft px-2 py-1 text-[9px] font-bold text-teal">
                <TrendingUp className="h-3 w-3" />
                Improving
              </span>
            }
          />
          <div className="px-3 pb-3 pt-1">
            <DisposalTrendChart />
          </div>
          <div className="mx-4 mb-4 grid grid-cols-3 gap-2 rounded-lg border border-line bg-paper/50 p-2.5">
            {[
              { label: 'Fastest', value: 'Anti-Ragging', note: '12.4 days' },
              { label: 'Slowest', value: 'Legal Cell', note: '26.8 days' },
              { label: 'Target', value: '18 days', note: 'FY 2026–27' },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-[7.5px] font-bold uppercase tracking-[0.1em] text-muted">{item.label}</p>
                <p className="mt-0.5 truncate text-[9.5px] font-bold text-ink">{item.value}</p>
                <p className="text-[8px] text-muted">{item.note}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="mb-4 grid gap-4 lg:grid-cols-12">
        <Panel className="lg:col-span-4">
          <PanelHeader
            eyebrow="Backlog"
            title="Ageing profile"
            description="Open cases by age bucket."
            action={<span className="text-[9px] font-bold text-danger">74 over 90d</span>}
          />
          <div className="px-3 pb-2 pt-1">
            <AgeingChart />
          </div>
        </Panel>

        <Panel className="lg:col-span-8">
          <PanelHeader
            eyebrow="Performance"
            title="Bureau & cell scorecard"
            description="Volume, disposal, pendency and SLA compliance."
            action={
              <Button
                variant="ghost"
                size="sm"
                leadingIcon={<FileBarChart className="h-3.5 w-3.5" />}
                onClick={() =>
                  toast({
                    title: 'Scorecard export',
                    description: 'Excel export is stubbed in the prototype.',
                    tone: 'info',
                  })
                }
              >
                Export
              </Button>
            }
          />
          <div className="overflow-x-auto scroll-area">
            <table className="mt-3 w-full min-w-[720px] text-left">
              <thead>
                <tr className="border-y border-line bg-paper/50">
                  <th className="px-5 py-2.5 text-[9px] font-bold uppercase tracking-[0.13em] text-muted">Bureau / cell</th>
                  <th className="px-3 py-2.5 text-[9px] font-bold uppercase tracking-[0.13em] text-muted">Received</th>
                  <th className="px-3 py-2.5 text-[9px] font-bold uppercase tracking-[0.13em] text-muted">Disposed</th>
                  <th className="px-3 py-2.5 text-[9px] font-bold uppercase tracking-[0.13em] text-muted">Pending</th>
                  <th className="px-3 py-2.5 text-[9px] font-bold uppercase tracking-[0.13em] text-muted">Avg. days</th>
                  <th className="px-5 py-2.5 text-[9px] font-bold uppercase tracking-[0.13em] text-muted">SLA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/70">
                {bureauPerformance.map((bureau) => (
                  <tr key={bureau.bureau} className="transition hover:bg-paper/50">
                    <td className="px-5 py-2.5 text-[11px] font-semibold text-ink">{bureau.bureau}</td>
                    <td className="px-3 py-2.5 font-mono text-[10px] text-ink-soft">{formatNumber(bureau.received)}</td>
                    <td className="px-3 py-2.5 font-mono text-[10px] text-ink-soft">{formatNumber(bureau.disposed)}</td>
                    <td className="px-3 py-2.5 font-mono text-[10px] text-ink-soft">{formatNumber(bureau.pending)}</td>
                    <td className="px-3 py-2.5">
                      <span className="text-[10px] text-ink-soft">{bureau.avg}</span>
                      <span className={cn('ml-1 inline-flex items-center gap-0.5 text-[8px] font-bold', bureau.trend <= 0 ? 'text-teal' : 'text-saffron')}>
                        {bureau.trend <= 0 ? <ArrowDownRight className="h-2.5 w-2.5" /> : <ArrowUpRight className="h-2.5 w-2.5" />}
                        {Math.abs(bureau.trend)}
                      </span>
                    </td>
                    <td className="px-5 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className={cn('w-7 text-[9.5px] font-bold', bureau.sla >= 90 ? 'text-teal' : bureau.sla >= 80 ? 'text-saffron' : 'text-danger')}>{bureau.sla}%</span>
                        <ProgressBar value={bureau.sla} tone={bureau.sla >= 90 ? 'teal' : bureau.sla >= 80 ? 'saffron' : 'danger'} height={3} className="w-16" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>

      <div className="mb-4 grid gap-4 lg:grid-cols-12">
        <Panel className="lg:col-span-7">
          <PanelHeader
            eyebrow="Geography"
            title="Regional performance"
            description="Open cases and disposal time by AICTE region."
            action={<CalendarDays className="h-4 w-4 text-muted" />}
          />
          <div className="overflow-x-auto scroll-area">
            <table className="mt-3 w-full min-w-[620px] text-left">
              <thead>
                <tr className="border-y border-line bg-paper/50">
                  <th className="px-5 py-2.5 text-[9px] font-bold uppercase tracking-[0.13em] text-muted">Region</th>
                  <th className="px-3 py-2.5 text-[9px] font-bold uppercase tracking-[0.13em] text-muted">Open</th>
                  <th className="px-3 py-2.5 text-[9px] font-bold uppercase tracking-[0.13em] text-muted">Disposed</th>
                  <th className="px-3 py-2.5 text-[9px] font-bold uppercase tracking-[0.13em] text-muted">Avg. days</th>
                  <th className="px-5 py-2.5 text-[9px] font-bold uppercase tracking-[0.13em] text-muted">High-risk institutions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/70">
                {regionPerformance.map((region) => (
                  <tr key={region.region} className="transition hover:bg-paper/50">
                    <td className="px-5 py-2.5 text-[11px] font-semibold text-ink">{region.region}</td>
                    <td className="px-3 py-2.5 font-mono text-[10px] text-ink-soft">{region.open}</td>
                    <td className="px-3 py-2.5 font-mono text-[10px] text-ink-soft">{formatNumber(region.disposed)}</td>
                    <td className="px-3 py-2.5 text-[10px] text-ink-soft">{region.avg}</td>
                    <td className="px-5 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="w-6 text-[9.5px] font-bold text-ink">{region.highRisk}</span>
                        <ProgressBar value={(region.highRisk / 64) * 100} tone={region.highRisk > 50 ? 'saffron' : 'amber'} height={3} className="w-20" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <div className="space-y-4 lg:col-span-5">
          <Panel className="border-saffron/20 bg-gradient-to-br from-surface to-saffron-soft/25">
            <PanelHeader
              eyebrow="Coordination dividend"
              title="What overlap detection changed"
              description="Pilot-style targets from the demo dataset. Validate in production."
              action={<GitMerge className="h-4 w-4 text-saffron" />}
            />
            <div className="grid grid-cols-2 gap-2 px-5 pb-5 pt-3">
              {[
                { label: 'Overlaps detected', value: '37', note: 'last 30 days' },
                { label: 'Confirmed links', value: '23', note: '62% of suggestions' },
                { label: 'Duplicates prevented', value: '14', note: 'no new case created' },
                { label: 'Avg. effort saved', value: '6.4d', note: 'per confirmed overlap' },
              ].map((metric) => (
                <div key={metric.label} className="rounded-lg border border-line bg-surface p-3">
                  <p className="text-[8px] font-bold uppercase tracking-[0.1em] text-muted">{metric.label}</p>
                  <p className="mt-1 font-display text-[21px] leading-none text-ink">{metric.value}</p>
                  <p className="mt-1 text-[8px] text-muted">{metric.note}</p>
                </div>
              ))}
            </div>
            <div className="mx-5 mb-5 rounded-lg border border-line bg-paper/60 p-3">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-muted">Suggestion precision</span>
                <span className="font-mono text-[10px] font-bold text-teal">87%</span>
              </div>
              <ProgressBar value={87} tone="teal" height={5} className="mt-1.5" />
              <p className="mt-1.5 text-[8px] leading-relaxed text-muted">
                Precision-first by design. Every suggestion requires an officer decision.
              </p>
            </div>
          </Panel>

          <Panel>
            <PanelHeader
              eyebrow="Downloads"
              title="Report packs"
              action={<ShieldCheck className="h-4 w-4 text-muted" />}
            />
            <div className="divide-y divide-line/70 px-5 pb-3 pt-1">
              {reportPacks.map((pack) => (
                <div key={pack.name} className="flex items-center gap-2.5 py-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-line bg-paper text-muted">
                    <FileText className="h-3.5 w-3.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[10.5px] font-semibold text-ink">{pack.name}</p>
                    <p className="mt-0.5 text-[8.5px] text-muted">{pack.period} · {pack.type} · {pack.updated}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      toast({
                        title: 'Report download',
                        description: `${pack.name} would download as ${pack.type.split(' · ')[0]}.`,
                        tone: 'info',
                      })
                    }
                    className="grid h-7 w-7 place-items-center rounded-md text-muted transition hover:bg-paper-deep hover:text-ink"
                    aria-label={`Download ${pack.name}`}
                  >
                    <Download className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>

      <p className="text-[9px] text-muted">
        Figures are synthetic and illustrative. Production reports would carry a methodology note, data cut-off and
        sign-off by the reporting officer.
      </p>
    </div>
  )
}
