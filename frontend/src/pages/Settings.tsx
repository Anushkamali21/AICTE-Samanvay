import {
  ArrowRight,
  Check,
  Database,
  GitMerge,
  Lock,
  Plug,
  Save,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Users,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { PageHeader } from '@/components/ui/PageHeader'
import { Panel } from '@/components/ui/Panel'
import { Tabs } from '@/components/ui/Tabs'
import { useToast } from '@/components/ui/Toast'

const slaRules = [
  { category: 'Admission & fees', first: '3 working days', disposal: '45 days', escalate: 'PGRC → Bureau head', active: true },
  { category: 'Approval & compliance', first: '2 working days', disposal: '30 days', escalate: 'RB → Adviser', active: true },
  { category: 'Harassment & discrimination', first: '24 hours', disposal: '15 days', escalate: 'Cell → Competent authority', active: true },
  { category: 'Faculty & staff welfare', first: '3 working days', disposal: '45 days', escalate: 'PGRC → Bureau head', active: true },
  { category: 'Infrastructure & safety', first: '2 working days', disposal: '30 days', escalate: 'RB → Regional office', active: true },
  { category: 'Academic & examination', first: '3 working days', disposal: '30 days', escalate: 'PGRC → Bureau head', active: false },
]

const routingRules = [
  { condition: 'Category is Approval & compliance', owner: 'Regulation Bureau', priority: 'High', active: true },
  { condition: 'Category is Harassment & discrimination', owner: 'Anti-Ragging / ICC', priority: 'Critical', active: true },
  { condition: 'Institution region is Eastern', owner: 'Eastern Regional Office', priority: 'Normal', active: true },
  { condition: 'Complainant is faculty or staff', owner: 'PGRC · GRC desk', priority: 'High', active: true },
  { condition: 'Duplicate score ≥ 0.85', owner: 'Parent case owner', priority: 'Review', active: true },
]

const sources = [
  { name: 'AICTE CSS', type: 'REST adapter', status: 'Adapter ready', last: 'Awaiting authorization' },
  { name: 'CPGRAMS', type: 'Reference ingest', status: 'Adapter ready', last: 'Awaiting authorization' },
  { name: 'Complaint mailbox', type: 'IMAP / Graph', status: 'Demo connected', last: '2 minutes ago' },
  { name: 'Legacy registers', type: 'CSV / Excel', status: 'Demo connected', last: 'Yesterday, 18:20' },
  { name: 'Anti-Ragging helpline', type: 'Sealed import', status: 'Adapter ready', last: 'Awaiting authorization' },
]

const roles = [
  { role: 'PGRC Officer', scope: 'All normal cases · PGRC queue', sealed: false, config: false },
  { role: 'RB Officer', scope: 'All normal cases · RB queue', sealed: false, config: false },
  { role: 'Cell Officer', scope: 'Assigned cell · sealed cases', sealed: true, config: false },
  { role: 'Senior Management', scope: 'All cases · aggregate analytics', sealed: true, config: false },
  { role: 'System Administrator', scope: 'Configuration · no case content', sealed: false, config: true },
]

export function Settings() {
  const { toast } = useToast()
  const [tab, setTab] = useState('sla')
  const [rules, setRules] = useState(slaRules)
  const [routes, setRoutes] = useState(routingRules)

  return (
    <div>
      <PageHeader
        eyebrow="Configuration"
        title="Policy changes belong in the console, not the code."
        description="SLA clocks, routing rules, access scopes and ingestion adapters are configurable by authorised administrators — with a full change history."
        actions={
          <Button
            variant="primary"
            leadingIcon={<Save className="h-3.5 w-3.5" />}
            onClick={() =>
              toast({
                title: 'Configuration saved',
                description: 'Demo changes are local to this session. Production would version and audit them.',
                tone: 'success',
              })
            }
          >
            Save changes
          </Button>
        }
      />

      <div className="mb-4 flex flex-col gap-2 rounded-xl border border-saffron/20 bg-saffron-soft/50 px-4 py-3 sm:flex-row sm:items-center">
        <SlidersHorizontal className="h-4 w-4 shrink-0 text-saffron" />
        <p className="text-[10.5px] leading-relaxed text-ink-soft">
          <span className="font-bold text-ink">Demo configuration.</span> Changes are local to this session and are not
          persisted. Production would require role-based approval and a versioned audit trail.
        </p>
      </div>

      <Panel>
        <div className="px-5 pt-4">
          <Tabs
            tabs={[
              { id: 'sla', label: 'SLA rules' },
              { id: 'routing', label: 'Routing' },
              { id: 'access', label: 'Access' },
              { id: 'sources', label: 'Sources' },
            ]}
            value={tab}
            onChange={setTab}
          />
        </div>

        {tab === 'sla' ? (
          <div>
            <div className="flex items-center justify-between px-5 py-3">
              <div>
                <p className="text-[11px] font-bold text-ink">Disposal clocks</p>
                <p className="mt-0.5 text-[9.5px] text-muted">Every clock shows its statutory or administrative basis.</p>
              </div>
              <span className="rounded-full border border-teal/15 bg-teal-soft px-2 py-1 text-[8.5px] font-bold text-teal">
                5 active · 1 draft
              </span>
            </div>
            <div className="overflow-x-auto scroll-area">
              <table className="w-full min-w-[760px] text-left">
                <thead>
                  <tr className="border-y border-line bg-paper/50">
                    <th className="px-5 py-2.5 text-[9px] font-bold uppercase tracking-[0.13em] text-muted">Category</th>
                    <th className="px-4 py-2.5 text-[9px] font-bold uppercase tracking-[0.13em] text-muted">First response</th>
                    <th className="px-4 py-2.5 text-[9px] font-bold uppercase tracking-[0.13em] text-muted">Disposal</th>
                    <th className="px-4 py-2.5 text-[9px] font-bold uppercase tracking-[0.13em] text-muted">Escalation</th>
                    <th className="px-5 py-2.5 text-[9px] font-bold uppercase tracking-[0.13em] text-muted">Active</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line/70">
                  {rules.map((rule, index) => (
                    <tr key={rule.category} className="transition hover:bg-paper/50">
                      <td className="px-5 py-3 text-[11px] font-semibold text-ink">{rule.category}</td>
                      <td className="px-4 py-3 text-[10px] text-ink-soft">{rule.first}</td>
                      <td className="px-4 py-3 text-[10px] text-ink-soft">{rule.disposal}</td>
                      <td className="px-4 py-3 text-[10px] text-muted">{rule.escalate}</td>
                      <td className="px-5 py-3">
                        <button
                          type="button"
                          onClick={() => {
                            setRules((current) =>
                              current.map((entry, entryIndex) =>
                                entryIndex === index ? { ...entry, active: !entry.active } : entry,
                              ),
                            )
                            toast({
                              title: rule.active ? 'SLA rule paused' : 'SLA rule activated',
                              description: `${rule.category} · ${rule.disposal}`,
                              tone: 'info',
                            })
                          }}
                          className={cn(
                            'relative h-5 w-9 rounded-full border transition',
                            rule.active ? 'border-teal/30 bg-teal' : 'border-line bg-paper-deep',
                          )}
                          aria-label={`Toggle ${rule.category}`}
                          aria-pressed={rule.active}
                        >
                          <span
                            className={cn(
                              'absolute top-0.5 h-3.5 w-3.5 rounded-full bg-surface shadow-sm transition-all',
                              rule.active ? 'left-[18px]' : 'left-0.5',
                            )}
                          />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}

        {tab === 'routing' ? (
          <div>
            <div className="flex items-center justify-between px-5 py-3">
              <div>
                <p className="text-[11px] font-bold text-ink">Auto-routing rules</p>
                <p className="mt-0.5 text-[9.5px] text-muted">Rules are evaluated in order. A human can always override.</p>
              </div>
              <Button variant="ghost" size="sm" leadingIcon={<GitMerge className="h-3.5 w-3.5" />} onClick={() => toast({ title: 'Rule builder', description: 'Visual rule builder is stubbed in the prototype.', tone: 'info' })}>
                Add rule
              </Button>
            </div>
            <div className="divide-y divide-line/70 border-t border-line px-5">
              {routes.map((route, index) => (
                <div key={route.condition} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-line bg-paper text-[8px] font-bold text-muted">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10.5px] font-semibold text-ink">{route.condition}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-[9px] text-muted">
                      Route to <ArrowRight className="h-2.5 w-2.5" /> <span className="font-bold text-ink-soft">{route.owner}</span>
                    </p>
                  </div>
                  <span className="rounded border border-line bg-paper px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.08em] text-muted">
                    {route.priority}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setRoutes((current) =>
                        current.map((entry, entryIndex) =>
                          entryIndex === index ? { ...entry, active: !entry.active } : entry,
                        ),
                      )
                      toast({ title: route.active ? 'Rule paused' : 'Rule activated', description: route.condition, tone: 'info' })
                    }}
                    className={cn(
                      'relative h-5 w-9 rounded-full border transition',
                      route.active ? 'border-teal/30 bg-teal' : 'border-line bg-paper-deep',
                    )}
                    aria-label={`Toggle ${route.condition}`}
                    aria-pressed={route.active}
                  >
                    <span
                      className={cn(
                        'absolute top-0.5 h-3.5 w-3.5 rounded-full bg-surface shadow-sm transition-all',
                        route.active ? 'left-[18px]' : 'left-0.5',
                      )}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {tab === 'access' ? (
          <div>
            <div className="flex items-center justify-between px-5 py-3">
              <div>
                <p className="text-[11px] font-bold text-ink">Role-based access</p>
                <p className="mt-0.5 text-[9.5px] text-muted">Sealed cases require need-to-know assignment, not just a role.</p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full border border-danger/15 bg-danger-soft px-2 py-1 text-[8.5px] font-bold text-danger">
                <Lock className="h-2.5 w-2.5" />
                Sealed
              </span>
            </div>
            <div className="overflow-x-auto scroll-area">
              <table className="w-full min-w-[640px] text-left">
                <thead>
                  <tr className="border-y border-line bg-paper/50">
                    <th className="px-5 py-2.5 text-[9px] font-bold uppercase tracking-[0.13em] text-muted">Role</th>
                    <th className="px-4 py-2.5 text-[9px] font-bold uppercase tracking-[0.13em] text-muted">Data scope</th>
                    <th className="px-4 py-2.5 text-[9px] font-bold uppercase tracking-[0.13em] text-muted">Sealed cases</th>
                    <th className="px-4 py-2.5 text-[9px] font-bold uppercase tracking-[0.13em] text-muted">Configuration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line/70">
                  {roles.map((role) => (
                    <tr key={role.role} className="transition hover:bg-paper/50">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <span className="grid h-7 w-7 place-items-center rounded-md border border-line bg-paper text-muted">
                            <Users className="h-3 w-3" />
                          </span>
                          <span className="text-[10.5px] font-bold text-ink">{role.role}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[10px] text-muted">{role.scope}</td>
                      <td className="px-4 py-3">
                        {role.sealed ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-teal/15 bg-teal-soft px-2 py-0.5 text-[8.5px] font-bold text-teal">
                            <Check className="h-2.5 w-2.5" /> Assigned only
                          </span>
                        ) : (
                          <span className="text-[9px] text-muted">No</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-[9px] text-muted">{role.config ? 'Yes' : 'No'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}

        {tab === 'sources' ? (
          <div>
            <div className="flex items-center justify-between px-5 py-3">
              <div>
                <p className="text-[11px] font-bold text-ink">Ingestion adapters</p>
                <p className="mt-0.5 text-[9.5px] text-muted">Adapters are built; live connections require AICTE authorisation.</p>
              </div>
              <Button variant="ghost" size="sm" leadingIcon={<Plug className="h-3.5 w-3.5" />} onClick={() => toast({ title: 'Connection test', description: 'All demo adapters are healthy. Live credentials are not configured.', tone: 'info' })}>
                Test connections
              </Button>
            </div>
            <div className="divide-y divide-line/70 border-t border-line px-5">
              {sources.map((source) => (
                <div key={source.name} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-line bg-paper text-muted">
                    <Database className="h-3.5 w-3.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10.5px] font-bold text-ink">{source.name}</p>
                    <p className="mt-0.5 text-[9px] text-muted">{source.type} · {source.last}</p>
                  </div>
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[8.5px] font-bold',
                      source.status === 'Demo connected'
                        ? 'border-teal/15 bg-teal-soft text-teal'
                        : 'border-saffron/20 bg-saffron-soft text-saffron',
                    )}
                  >
                    <span className={cn('h-1.5 w-1.5 rounded-full', source.status === 'Demo connected' ? 'bg-teal' : 'bg-saffron')} />
                    {source.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-2 border-t border-line bg-paper/50 px-5 py-3 text-[9px] text-muted">
          <ShieldCheck className="h-3 w-3 text-teal" />
          Every configuration change is versioned and audited.
          <span className="ml-auto inline-flex items-center gap-1">
            <Settings2 className="h-3 w-3" />
            Demo only
          </span>
        </div>
      </Panel>
    </div>
  )
}
