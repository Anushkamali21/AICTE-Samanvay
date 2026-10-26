import {
  ArrowUpRight,
  Building2,
  Download,
  GitMerge,
  MapPin,
  Plus,
  ShieldAlert,
  Users,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useData } from '@/data/DataProvider'
import { riskTone } from '@/lib/presentation'
import { cn, formatNumber } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { FilterSelect } from '@/components/ui/FilterSelect'
import { PageHeader } from '@/components/ui/PageHeader'
import { Panel } from '@/components/ui/Panel'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { SearchInput } from '@/components/ui/SearchInput'
import { useToast } from '@/components/ui/Toast'

const regions = ['All regions', 'Southern', 'South-West', 'Western', 'Northern', 'North-West', 'Eastern', 'Central']
const types = [
  'All types',
  'Private-Self Financing',
  'Deemed University (Pvt)',
  'Government',
  'State Government University',
]
const riskBands = ['All risk levels', 'High risk (75+)', 'Elevated (60–74)', 'Moderate (40–59)', 'Low (<40)']

export function Institutions() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { institutions, getOpenCasesForInstitution } = useData()
  const [query, setQuery] = useState('')
  const [region, setRegion] = useState('All regions')
  const [type, setType] = useState('All types')
  const [riskBand, setRiskBand] = useState('All risk levels')

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return institutions.filter((institution) => {
      const matchesQuery =
        !normalized ||
        institution.name.toLowerCase().includes(normalized) ||
        institution.shortName.toLowerCase().includes(normalized) ||
        institution.permanentId.toLowerCase().includes(normalized) ||
        institution.city.toLowerCase().includes(normalized) ||
        institution.state.toLowerCase().includes(normalized)
      const matchesRegion = region === 'All regions' || institution.region === region
      const matchesType = type === 'All types' || institution.type === type
      const matchesRisk =
        riskBand === 'All risk levels' ||
        (riskBand === 'High risk (75+)' && institution.riskScore >= 75) ||
        (riskBand === 'Elevated (60–74)' && institution.riskScore >= 60 && institution.riskScore < 75) ||
        (riskBand === 'Moderate (40–59)' && institution.riskScore >= 40 && institution.riskScore < 60) ||
        (riskBand === 'Low (<40)' && institution.riskScore < 40)
      return matchesQuery && matchesRegion && matchesType && matchesRisk
    })
  }, [institutions, query, region, riskBand, type])

  return (
    <div>
      <PageHeader
        eyebrow="Institution directory"
        title="Every complaint has an institution."
        description="A canonical institution profile keyed on AICTE Permanent ID, with aliases, approval context and a consolidated complaint footprint."
        actions={
          <>
            <Button
              variant="secondary"
              leadingIcon={<Download className="h-3.5 w-3.5" />}
              onClick={() =>
                toast({
                  title: 'Institution list export queued',
                  description: 'CSV export is stubbed in the prototype.',
                  tone: 'info',
                })
              }
            >
              Export list
            </Button>
            <Button
              variant="primary"
              leadingIcon={<Plus className="h-3.5 w-3.5" />}
              onClick={() =>
                toast({
                  title: 'Institution master sync',
                  description: 'Production would sync with the AICTE approved-institutions registry.',
                  tone: 'info',
                })
              }
            >
              Sync master
            </Button>
          </>
        }
      />

      <div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="panel flex items-center gap-3 p-4">
          <span className="grid h-9 w-9 place-items-center rounded-lg border border-blue/15 bg-blue-soft text-blue">
            <Building2 className="h-4 w-4" />
          </span>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-muted">Institutions</p>
            <p className="font-display text-[25px] leading-tight text-ink">{formatNumber(12981)}</p>
          </div>
        </div>
        <div className="panel flex items-center gap-3 p-4">
          <span className="grid h-9 w-9 place-items-center rounded-lg border border-saffron/20 bg-saffron-soft text-saffron">
            <ShieldAlert className="h-4 w-4" />
          </span>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-muted">High risk</p>
            <p className="font-display text-[25px] leading-tight text-ink">312</p>
          </div>
        </div>
        <div className="panel flex items-center gap-3 p-4">
          <span className="grid h-9 w-9 place-items-center rounded-lg border border-vermilion/15 bg-vermilion-soft text-vermilion">
            <Users className="h-4 w-4" />
          </span>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-muted">Open cases</p>
            <p className="font-display text-[25px] leading-tight text-ink">1,284</p>
          </div>
        </div>
        <div className="panel flex items-center gap-3 p-4">
          <span className="grid h-9 w-9 place-items-center rounded-lg border border-teal/15 bg-teal-soft text-teal">
            <GitMerge className="h-4 w-4" />
          </span>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-muted">Multi-bureau</p>
            <p className="font-display text-[25px] leading-tight text-ink">209</p>
          </div>
        </div>
      </div>

      <Panel>
        <div className="flex flex-col gap-3 border-b border-line px-4 py-3.5 lg:flex-row lg:items-center">
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Search by institution, Permanent ID, city…"
            className="w-full lg:max-w-[340px]"
          />
          <div className="flex flex-wrap items-center gap-2 lg:ml-auto">
            <FilterSelect
              label="Region"
              value={region}
              onChange={(event) => setRegion(event.target.value)}
              options={regions.map((entry) => ({ value: entry, label: entry }))}
            />
            <FilterSelect
              label="Institution type"
              value={type}
              onChange={(event) => setType(event.target.value)}
              options={types.map((entry) => ({ value: entry, label: entry }))}
            />
            <FilterSelect
              label="Risk band"
              value={riskBand}
              onChange={(event) => setRiskBand(event.target.value)}
              options={riskBands.map((entry) => ({ value: entry, label: entry }))}
            />
            <span className="rounded-lg border border-line bg-paper px-2.5 py-1.5 text-[10px] font-bold text-muted">
              {filtered.length} shown
            </span>
          </div>
        </div>

        <div className="hidden overflow-x-auto scroll-area md:block">
          <table className="w-full min-w-[1020px] text-left">
            <thead>
              <tr className="border-b border-line bg-paper/50">
                <th className="px-5 py-2.5 text-[9px] font-bold uppercase tracking-[0.14em] text-muted">Institution</th>
                <th className="px-4 py-2.5 text-[9px] font-bold uppercase tracking-[0.14em] text-muted">Permanent ID</th>
                <th className="px-4 py-2.5 text-[9px] font-bold uppercase tracking-[0.14em] text-muted">Region</th>
                <th className="px-4 py-2.5 text-[9px] font-bold uppercase tracking-[0.14em] text-muted">Type</th>
                <th className="px-4 py-2.5 text-[9px] font-bold uppercase tracking-[0.14em] text-muted">Open</th>
                <th className="px-4 py-2.5 text-[9px] font-bold uppercase tracking-[0.14em] text-muted">Risk</th>
                <th className="px-4 py-2.5 text-[9px] font-bold uppercase tracking-[0.14em] text-muted">Last inspection</th>
                <th className="w-10 px-3 py-2.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line/70">
              {filtered.map((institution) => {
                const open = getOpenCasesForInstitution(institution.id)
                const tone = riskTone(institution.riskScore)
                const bureauCount = new Set(open.map((record) => record.bureau)).size
                return (
                  <tr
                    key={institution.id}
                    onClick={() => navigate(`/institutions/${institution.id}`)}
                    className="group cursor-pointer transition hover:bg-paper/60"
                  >
                    <td className="max-w-[320px] px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-line bg-paper text-muted transition group-hover:border-saffron/25 group-hover:bg-saffron-soft group-hover:text-saffron">
                          <Building2 className="h-3.5 w-3.5" />
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-[12px] font-bold text-ink transition group-hover:text-saffron">
                            {institution.name}
                          </p>
                          <p className="mt-0.5 flex items-center gap-1 text-[9.5px] text-muted">
                            <MapPin className="h-2.5 w-2.5" />
                            {institution.city}, {institution.state}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-[10px] text-ink-soft">{institution.permanentId}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="rounded-md border border-line bg-paper px-2 py-1 text-[9.5px] font-semibold text-ink-soft">
                        {institution.region}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-[10.5px] text-muted">{institution.type}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-display text-[17px] leading-none text-ink">{open.length}</span>
                        {bureauCount > 1 ? (
                          <span className="rounded border border-saffron/20 bg-saffron-soft px-1.5 py-0.5 text-[8px] font-bold text-saffron">
                            {bureauCount} bureaus
                          </span>
                        ) : null}
                      </div>
                    </td>
                    <td className="w-[130px] px-4 py-3.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className={cn('text-[10px] font-bold', tone.text)}>{institution.riskScore}</span>
                        <span className="text-[8.5px] text-muted">{institution.riskScore >= 75 ? 'High' : institution.riskScore >= 60 ? 'Elevated' : institution.riskScore >= 40 ? 'Moderate' : 'Low'}</span>
                      </div>
                      <ProgressBar
                        value={institution.riskScore}
                        tone={
                          institution.riskScore >= 75
                            ? 'danger'
                            : institution.riskScore >= 60
                              ? 'saffron'
                              : institution.riskScore >= 40
                                ? 'amber'
                                : 'teal'
                        }
                        height={3}
                        className="mt-1.5"
                      />
                    </td>
                    <td className="px-4 py-3.5 text-[10px] text-muted">{institution.lastInspection}</td>
                    <td className="px-3 py-3.5">
                      <Link
                        to={`/institutions/${institution.id}`}
                        className="grid h-7 w-7 place-items-center rounded-md text-muted opacity-0 transition group-hover:opacity-100 hover:bg-paper-deep hover:text-ink"
                        aria-label={`Open ${institution.name}`}
                        onClick={(event) => event.stopPropagation()}
                      >
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="divide-y divide-line/70 md:hidden">
          {filtered.map((institution) => {
            const open = getOpenCasesForInstitution(institution.id)
            const tone = riskTone(institution.riskScore)
            const bureauCount = new Set(open.map((record) => record.bureau)).size
            return (
              <Link
                key={institution.id}
                to={`/institutions/${institution.id}`}
                className="block px-4 py-3.5 transition active:bg-paper"
              >
                <div className="flex items-start gap-2.5">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-line bg-paper text-muted">
                    <Building2 className="h-3.5 w-3.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] font-bold leading-snug text-ink">{institution.name}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-[9px] text-muted">
                      <MapPin className="h-2.5 w-2.5" />
                      {institution.city}, {institution.state} · {institution.region}
                    </p>
                  </div>
                  <span className={cn('rounded-md border px-2 py-1 text-[10px] font-bold', tone.bg, tone.text, tone.border)}>
                    {institution.riskScore}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <span className="font-mono text-[8.5px] text-muted">{institution.permanentId}</span>
                  <span className="rounded border border-line bg-paper px-1.5 py-0.5 text-[8px] font-semibold text-ink-soft">
                    {open.length} open
                  </span>
                  {bureauCount > 1 ? (
                    <span className="rounded border border-saffron/20 bg-saffron-soft px-1.5 py-0.5 text-[8px] font-bold text-saffron">
                      {bureauCount} bureaus
                    </span>
                  ) : null}
                  <span className="ml-auto text-[8px] text-muted">{institution.type}</span>
                </div>
              </Link>
            )
          })}
          {filtered.length === 0 ? (
            <div className="px-4 py-8 text-center text-[12px] text-muted">No institutions match these filters.</div>
          ) : null}
        </div>

        <div className="flex flex-col gap-2 border-t border-line px-5 py-3 text-[9.5px] text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>
            Showing {filtered.length} of {institutions.length} demo institutions · 12,981 in the full master
          </span>
          <span>Institution master: public AICTE listings · cases: synthetic</span>
        </div>
      </Panel>
    </div>
  )
}
