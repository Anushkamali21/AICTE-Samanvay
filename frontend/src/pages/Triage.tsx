import {
  ArrowRight,
  Check,
  ChevronRight,
  FileText,
  Globe2,
  Inbox,
  Languages,
  Mail,
  Plus,
  Sparkles,
  TriangleAlert,
  UserRound,
  Wand2,
  X,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Bureau, Severity } from '@/data/types'
import { useData } from '@/data/DataProvider'
import { severityTones } from '@/lib/presentation'
import { cn, relativeTime } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { BureauBadge, SeverityBadge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { FilterSelect } from '@/components/ui/FilterSelect'
import { Modal } from '@/components/ui/Modal'
import { PageHeader } from '@/components/ui/PageHeader'
import { Panel, PanelHeader } from '@/components/ui/Panel'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { SearchInput } from '@/components/ui/SearchInput'
import { useToast } from '@/components/ui/Toast'

const sourceIcons = {
  Email: Mail,
  CPGRAMS: Globe2,
  CSS: Inbox,
  Letter: FileText,
  'Web form': Globe2,
}

const languageTone = {
  English: 'bg-blue-soft text-blue',
  Hindi: 'bg-saffron-soft text-saffron',
  Marathi: 'bg-violet-soft text-violet',
  Tamil: 'bg-teal-soft text-teal',
}

export function Triage() {
  const { toast } = useToast()
  const { complaints, assignComplaint, dismissComplaint, resetDemo } = useData()
  const [selectedId, setSelectedId] = useState(complaints[0]?.id ?? '')
  const [query, setQuery] = useState('')
  const [assignOpen, setAssignOpen] = useState(false)
  const [assignBureau, setAssignBureau] = useState<Bureau>('PGRC')
  const [assignOfficer, setAssignOfficer] = useState('Ananya Menon')
  const [assignNote, setAssignNote] = useState('')

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return complaints
    return complaints.filter(
      (complaint) =>
        complaint.subject.toLowerCase().includes(normalized) ||
        complaint.institutionName.toLowerCase().includes(normalized) ||
        complaint.ref.toLowerCase().includes(normalized) ||
        complaint.ai.category.toLowerCase().includes(normalized),
    )
  }, [complaints, query])

  const selected = complaints.find((complaint) => complaint.id === selectedId) ?? complaints[0]

  const acceptAndAssign = async () => {
    if (!selected) return
    try {
      await assignComplaint(selected.id, {
        bureau: assignBureau,
        officer: assignOfficer,
        note: assignNote,
      })
      const next = complaints.find((complaint) => complaint.id !== selected.id)
      setSelectedId(next?.id ?? '')
      setAssignOpen(false)
      setAssignNote('')
      toast({
        title: 'Case created and assigned',
        description: `${selected.ref} routed to ${assignBureau} · ${assignOfficer}.`,
        tone: 'success',
      })
    } catch (caught) {
      toast({
        title: 'Assignment could not be saved',
        description: caught instanceof Error ? caught.message : 'Please try again.',
        tone: 'danger',
      })
    }
  }

  const dismiss = async () => {
    if (!selected) return
    try {
      await dismissComplaint(selected.id, 'Duplicate or insufficient information at triage')
      const next = complaints.find((complaint) => complaint.id !== selected.id)
      setSelectedId(next?.id ?? '')
      toast({
        title: 'Complaint closed at triage',
        description: 'Recorded as duplicate/spam with a reason. No case was created.',
        tone: 'info',
      })
    } catch (caught) {
      toast({
        title: 'Complaint could not be closed',
        description: caught instanceof Error ? caught.message : 'Please try again.',
        tone: 'danger',
      })
    }
  }

  if (complaints.length === 0) {
    return (
      <div>
        <PageHeader
          eyebrow="Triage inbox"
          title="A clean inbox. Finally."
          description="Every incoming complaint has been triaged, linked or assigned."
        />
        <Panel>
          <EmptyState
            icon={Check}
            title="All caught up"
            description="The demo queue is empty. Reset the prototype to replay the triage flow."
            action={
              <Button onClick={() => void resetDemo()}>
                Reset demo queue
              </Button>
            }
          />
        </Panel>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        eyebrow="Triage inbox"
        title="Read once. Route correctly."
        description="Incoming complaints are translated, classified, matched to an institution and checked against open cases before a human decides."
        actions={
          <Button
            variant="secondary"
            leadingIcon={<Wand2 className="h-3.5 w-3.5" />}
            onClick={() =>
              toast({
                title: 'Triage model refreshed',
                description: 'Demo model card: multilingual embeddings + rules + human confirmation.',
                tone: 'info',
              })
            }
          >
            Model card
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-12">
        <Panel className="overflow-hidden lg:col-span-4">
          <PanelHeader
            eyebrow={`${complaints.length} incoming`}
            title="Triage queue"
            description="Oldest first? No — highest risk first, then recency."
            action={<span className="rounded-full bg-danger-soft px-2 py-1 text-[9px] font-bold text-danger">{complaints.length} pending</span>}
          />
          <div className="px-4 pb-3 pt-2">
            <SearchInput value={query} onChange={setQuery} placeholder="Search queue…" />
          </div>
          <div className="max-h-[720px] overflow-y-auto scroll-area">
            {filtered.map((complaint) => {
              const SourceIcon = sourceIcons[complaint.source]
              const active = complaint.id === selected?.id
              const severityTone = severityTones[complaint.ai.severity as Severity]
              return (
                <button
                  key={complaint.id}
                  type="button"
                  onClick={() => setSelectedId(complaint.id)}
                  className={cn(
                    'group relative flex w-full gap-2.5 border-t border-line/70 px-4 py-3 text-left transition',
                    active ? 'bg-saffron-soft/45' : 'hover:bg-paper/60',
                  )}
                >
                  {active ? <span className="absolute inset-y-0 left-0 w-0.5 bg-saffron" /> : null}
                  <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-line bg-surface text-muted">
                    <SourceIcon className="h-3.5 w-3.5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5">
                      <span className="truncate text-[10.5px] font-bold text-ink">{complaint.institutionName}</span>
                      <span className="ml-auto shrink-0 text-[8.5px] text-muted">{relativeTime(complaint.receivedAt)}</span>
                    </span>
                    <span className="mt-0.5 block truncate text-[10px] font-medium text-ink-soft">{complaint.subject}</span>
                    <span className="mt-1 flex flex-wrap items-center gap-1.5">
                      <span className={cn('rounded border px-1.5 py-0.5 text-[7.5px] font-bold', severityTone.bg, severityTone.text, severityTone.border)}>
                        {complaint.ai.severity}
                      </span>
                      <span className={cn('rounded px-1.5 py-0.5 text-[7.5px] font-bold', languageTone[complaint.language])}>
                        {complaint.language}
                      </span>
                      <span className="truncate text-[8px] text-muted">{complaint.source}</span>
                    </span>
                  </span>
                  <ChevronRight className={cn('mt-1 h-3.5 w-3.5 shrink-0 text-muted transition', active && 'text-saffron')} />
                </button>
              )
            })}
          </div>
          <div className="border-t border-line bg-paper/30 px-4 py-3">
            <p className="text-[8.5px] font-bold uppercase tracking-[0.13em] text-muted">Queue composition</p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {[
                { label: 'Sources', value: new Set(complaints.map((item) => item.source)).size },
                { label: 'Languages', value: new Set(complaints.map((item) => item.language)).size },
                { label: 'Duplicates', value: complaints.filter((item) => item.ai.duplicateOf).length },
              ].map((stat) => (
                <div key={stat.label} className="rounded-lg border border-line bg-surface px-2 py-2">
                  <p className="font-display text-[17px] leading-none text-ink">{stat.value}</p>
                  <p className="mt-1 text-[7.5px] font-bold uppercase tracking-[0.1em] text-muted">{stat.label}</p>
                </div>
              ))}
            </div>
            <p className="mt-2.5 flex items-start gap-1.5 text-[8.5px] leading-relaxed text-muted">
              <Sparkles className="mt-0.5 h-3 w-3 shrink-0 text-saffron" />
              {complaints.filter((item) => item.ai.duplicateOf).length} of {complaints.length} complaints match an open case. Link
              before creating a new file.
            </p>
          </div>
          <div className="border-t border-line bg-paper/50 px-4 py-2.5 text-[9px] text-muted">
            Showing {filtered.length} of {complaints.length} · synthetic complaints
          </div>
        </Panel>

        <div className="space-y-4 lg:col-span-8">
          {selected ? (
            <>
              <Panel className="px-5 py-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[9px] text-muted">{selected.ref}</span>
                      <span className={cn('rounded px-1.5 py-0.5 text-[8px] font-bold', languageTone[selected.language])}>
                        {selected.language}
                      </span>
                      <span className="rounded border border-line bg-paper px-1.5 py-0.5 text-[8px] font-bold text-muted">
                        {selected.source}
                      </span>
                      <SeverityBadge severity={selected.ai.severity} />
                    </div>
                    <h2 className="mt-2 text-[21px] leading-tight tracking-[-0.02em] text-ink">{selected.subject}</h2>
                    <p className="mt-1.5 text-[10.5px] text-muted">
                      {selected.institutionName} · {selected.complainantType} · received {relativeTime(selected.receivedAt)}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2">
                    <Button variant="primary" size="sm" onClick={() => setAssignOpen(true)} leadingIcon={<Plus className="h-3.5 w-3.5" />}>
                      Accept & assign
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() =>
                        toast({
                          title: 'Classification editor',
                          description: 'In production this opens the category, severity and bureau controls.',
                          tone: 'info',
                        })
                      }
                    >
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" onClick={dismiss} leadingIcon={<X className="h-3.5 w-3.5" />}>
                      Reject
                    </Button>
                  </div>
                </div>
              </Panel>

              <div className="grid gap-4 xl:grid-cols-12">
                <div className="space-y-4 xl:col-span-7">
                  <Panel>
                    <PanelHeader
                      eyebrow="Original complaint"
                      title="What the complainant wrote"
                      action={
                        <span className="inline-flex items-center gap-1 rounded-full border border-line bg-paper px-2 py-1 text-[8.5px] font-bold text-muted">
                          <Languages className="h-3 w-3" />
                          {selected.language}
                        </span>
                      }
                    />
                    <div className="px-5 pb-5 pt-3">
                      <p className="rounded-lg border border-line bg-paper/45 p-3 text-[12px] leading-relaxed text-ink-soft">
                        {selected.originalText}
                      </p>
                    </div>
                  </Panel>

                  {selected.translatedText ? (
                    <Panel>
                      <PanelHeader
                        eyebrow="Machine translation"
                        title="English working copy"
                        description="Original is preserved for the legal record; officers can verify the translation."
                        action={<span className="rounded bg-teal-soft px-2 py-1 text-[8px] font-bold uppercase tracking-[0.08em] text-teal">Translated</span>}
                      />
                      <div className="px-5 pb-5 pt-3">
                        <p className="rounded-lg border border-teal/15 bg-teal-soft/35 p-3 text-[12px] leading-relaxed text-ink-soft">
                          {selected.translatedText}
                        </p>
                      </div>
                    </Panel>
                  ) : null}

                  <Panel>
                    <PanelHeader
                      eyebrow="Evidence"
                      title="Attachments & missing information"
                      description="The AI checks the category's evidence checklist before routing."
                    />
                    <div className="px-5 pb-5 pt-3">
                      <div className="flex flex-wrap gap-1.5">
                        {['Fee receipt', 'Withdrawal request'].map((file) => (
                          <span key={file} className="inline-flex items-center gap-1.5 rounded-md border border-line bg-paper px-2 py-1.5 text-[9.5px] font-semibold text-ink-soft">
                            <FileText className="h-3 w-3 text-muted" />
                            {file}
                          </span>
                        ))}
                      </div>
                      <div className="mt-4">
                        <p className="text-[8.5px] font-bold uppercase tracking-[0.12em] text-muted">Missing before assignment</p>
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          {selected.ai.missing.map((item) => (
                            <span key={item} className="inline-flex items-center gap-1 rounded-md border border-saffron/20 bg-saffron-soft px-2 py-1 text-[9px] font-semibold text-saffron">
                              <TriangleAlert className="h-2.5 w-2.5" />
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Panel>
                </div>

                <div className="space-y-4 xl:col-span-5">
                  <Panel className="border-saffron/25 bg-gradient-to-b from-surface to-saffron-soft/20">
                    <PanelHeader
                      eyebrow="AI assist"
                      title="Triage recommendation"
                      description="Model output, not a decision."
                      action={
                        <span className="grid h-8 w-8 place-items-center rounded-lg border border-saffron/25 bg-saffron-soft text-saffron">
                          <Sparkles className="h-4 w-4" />
                        </span>
                      }
                    />
                    <div className="px-5 pb-5 pt-3">
                      <div className="flex items-end justify-between gap-3">
                        <div>
                          <p className="text-[8.5px] font-bold uppercase tracking-[0.12em] text-muted">Suggested route</p>
                          <p className="mt-1 text-[15px] font-bold text-ink">{selected.ai.category}</p>
                          <p className="text-[10.5px] text-muted">{selected.ai.subcategory}</p>
                        </div>
                        <BureauBadge bureau={selected.ai.bureau} />
                      </div>

                      <div className="mt-3 rounded-lg border border-line bg-surface p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-muted">Confidence</span>
                          <span className="font-mono text-[10px] font-bold text-teal">{Math.round(selected.ai.confidence * 100)}%</span>
                        </div>
                        <ProgressBar value={selected.ai.confidence * 100} tone="teal" height={5} className="mt-1.5" />
                      </div>

                      <p className="mt-3 text-[10.5px] leading-relaxed text-ink-soft">{selected.ai.summary}</p>

                      <div className="mt-3">
                        <p className="text-[8.5px] font-bold uppercase tracking-[0.12em] text-muted">Extracted entities</p>
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          {selected.ai.entities.map((entity) => (
                            <span key={entity.label} className="rounded-md border border-line bg-paper px-2 py-1 text-[8.5px] text-ink-soft">
                              <span className="font-bold text-muted">{entity.label}:</span> {entity.value}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mt-3 rounded-lg border border-line bg-paper/50 p-2.5">
                        <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-muted">Why this suggestion</p>
                        <p className="mt-1 text-[9.5px] leading-relaxed text-ink-soft">{selected.ai.rationale}</p>
                      </div>
                    </div>
                  </Panel>

                  {selected.ai.duplicateOf ? (
                    <Panel className="border-danger/20">
                      <PanelHeader
                        eyebrow="Duplicate candidate"
                        title={`${Math.round((selected.ai.duplicateScore ?? 0) * 100)}% match to an open case`}
                        description="Link rather than create a new case. An officer must confirm."
                        action={<TriangleAlert className="h-4 w-4 text-danger" />}
                      />
                      <div className="px-5 pb-5 pt-3">
                        <Link
                          to={`/cases/${selected.ai.duplicateOf}`}
                          className="group flex items-center gap-2 rounded-lg border border-danger/15 bg-danger-soft/40 px-3 py-2.5 transition hover:border-danger/30"
                        >
                          <CopyIcon />
                          <span className="min-w-0 flex-1">
                            <span className="block font-mono text-[9px] text-danger">
                              {selected.ai.duplicateOf === 'case-412' ? 'AICTE/2026/00412' : 'AICTE/2026/00398'}
                            </span>
                            <span className="block truncate text-[10px] font-semibold text-ink-soft">
                              Same institution and issue description
                            </span>
                          </span>
                          <ArrowRight className="h-3.5 w-3.5 text-danger transition group-hover:translate-x-0.5" />
                        </Link>
                      </div>
                    </Panel>
                  ) : null}

                  <Panel>
                    <PanelHeader
                      eyebrow="Assignment"
                      title="Who should own this?"
                      action={<UserRound className="h-4 w-4 text-muted" />}
                    />
                    <div className="px-5 pb-5 pt-3">
                      <div className="flex items-center gap-2.5">
                        <span className="grid h-8 w-8 place-items-center rounded-lg border border-line bg-paper text-muted">
                          <UserRound className="h-3.5 w-3.5" />
                        </span>
                        <div>
                          <p className="text-[10.5px] font-bold text-ink">Suggested: {selected.ai.bureau}</p>
                          <p className="text-[9px] text-muted">Auto-routing based on category and workload</p>
                        </div>
                      </div>
                      <Button
                        variant="primary"
                        size="sm"
                        className="mt-3 w-full"
                        onClick={() => setAssignOpen(true)}
                        trailingIcon={<ArrowRight className="h-3.5 w-3.5" />}
                      >
                        Accept recommendation
                      </Button>
                      <p className="mt-2 text-center text-[8.5px] text-muted">Human confirmation required before a case is created</p>
                    </div>
                  </Panel>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>

      <Modal
        open={assignOpen}
        onClose={() => setAssignOpen(false)}
        title="Create case and assign"
        description={selected ? `${selected.ref} · ${selected.institutionName}` : undefined}
        footer={
          <>
            <Button variant="ghost" onClick={() => setAssignOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={acceptAndAssign}>
              Create case
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.12em] text-muted">Bureau / cell</label>
            <FilterSelect
              label="Bureau"
              value={assignBureau}
              onChange={(event) => setAssignBureau(event.target.value as Bureau)}
              options={['PGRC', 'Regulation Bureau', 'Anti-Ragging Cell', 'SC/ST Cell', "Women's Cell", 'Vigilance Cell'].map((bureau) => ({ value: bureau, label: bureau }))}
              className="w-full [&>select]:w-full"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.12em] text-muted">Assign officer</label>
            <FilterSelect
              label="Officer"
              value={assignOfficer}
              onChange={(event) => setAssignOfficer(event.target.value)}
              options={['Ananya Menon', 'Vikram Rao', 'Rohit Bansal', 'Meera Krishnan', 'Arjun Deshmukh'].map((officer) => ({ value: officer, label: officer }))}
              className="w-full [&>select]:w-full"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.12em] text-muted">Assignment note</label>
            <textarea
              value={assignNote}
              onChange={(event) => setAssignNote(event.target.value)}
              rows={3}
              placeholder="Optional context for the officer…"
              className="w-full resize-none rounded-lg border border-line-strong bg-surface px-3 py-2.5 text-[12px] leading-relaxed text-ink outline-none transition placeholder:text-muted/70 focus:border-saffron/60 focus:ring-2 focus:ring-saffron/15"
            />
          </div>
          <div className="rounded-lg border border-saffron/20 bg-saffron-soft/50 p-3 text-[10px] leading-relaxed text-ink-soft">
            This will create a new case, link the raw complaint, start the SLA clock and notify the assigned officer.
          </div>
        </div>
      </Modal>
    </div>
  )
}

function CopyIcon() {
  return (
    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md border border-danger/15 bg-surface text-danger">
      <FileText className="h-3.5 w-3.5" />
    </span>
  )
}
