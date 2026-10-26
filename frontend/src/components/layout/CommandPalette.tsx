import {
  ArrowRight,
  Building2,
  Command,
  FileText,
  GitMerge,
  Inbox,
  Search,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { useData } from '@/data/DataProvider'
import { navGroups } from '@/lib/nav'
import { cn } from '@/lib/utils'

interface Result {
  id: string
  group: 'Institutions' | 'Cases' | 'Pages'
  title: string
  subtitle: string
  to: string
  icon: typeof Building2
}

export function CommandPalette({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const navigate = useNavigate()
  const { cases, institutions } = useData()
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const allResults = useMemo<Result[]>(() => {
    const pageResults = navGroups.flatMap((group) =>
      group.items.map((item) => ({
        id: `page-${item.to}`,
        group: 'Pages' as const,
        title: item.label,
        subtitle: group.label,
        to: item.to,
        icon: item.icon,
      })),
    )
    const institutionResults = institutions.map((institution) => ({
      id: institution.id,
      group: 'Institutions' as const,
      title: institution.name,
      subtitle: `${institution.permanentId} · ${institution.city}, ${institution.state}`,
      to: `/institutions/${institution.id}`,
      icon: Building2,
    }))
    const caseResults = cases.map((record) => ({
      id: record.id,
      group: 'Cases' as const,
      title: record.title,
      subtitle: `${record.caseNo} · ${record.bureau}`,
      to: `/cases/${record.id}`,
      icon: FileText,
    }))
    return [...pageResults, ...institutionResults, ...caseResults]
  }, [cases, institutions])

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) {
      return allResults.filter((result) =>
        ['/', '/overlaps', '/triage', '/institutions'].includes(result.to),
      )
    }
    return allResults
      .filter(
        (result) =>
          result.title.toLowerCase().includes(normalized) ||
          result.subtitle.toLowerCase().includes(normalized),
      )
      .slice(0, 10)
  }, [allResults, query])

  useEffect(() => {
    if (!open) return
    setQuery('')
    setActiveIndex(0)
    const timer = window.setTimeout(() => inputRef.current?.focus(), 60)
    return () => window.clearTimeout(timer)
  }, [open])

  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      }
      if (event.key === 'ArrowDown') {
        event.preventDefault()
        setActiveIndex((index) => Math.min(index + 1, Math.max(results.length - 1, 0)))
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault()
        setActiveIndex((index) => Math.max(index - 1, 0))
      }
      if (event.key === 'Enter' && results[activeIndex]) {
        event.preventDefault()
        navigate(results[activeIndex].to)
        onClose()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [activeIndex, navigate, onClose, open, results])

  if (!open) return null

  const grouped = results.reduce<Record<string, Result[]>>((accumulator, result) => {
    accumulator[result.group] = [...(accumulator[result.group] ?? []), result]
    return accumulator
  }, {})
  const flat = Object.values(grouped).flat()
  let runningIndex = -1

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[10vh] sm:pt-[14vh]">
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-navy/45 backdrop-blur-[4px] animate-fade"
        onClick={onClose}
        aria-label="Close search"
      />
      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-line bg-surface shadow-lift animate-rise">
        <div className="flex items-center gap-3 border-b border-line px-4 py-3.5">
          <Search className="h-4 w-4 text-muted" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search institutions, case IDs, Permanent IDs, pages…"
            className="min-w-0 flex-1 bg-transparent text-[13.5px] text-ink outline-none placeholder:text-muted/80"
          />
          <kbd className="rounded border border-line bg-paper px-1.5 py-0.5 font-mono text-[9px] font-semibold text-muted">
            ESC
          </kbd>
        </div>

        <div className="max-h-[54vh] overflow-y-auto p-2 scroll-area">
          {results.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <p className="text-[13px] font-bold text-ink">No matches found</p>
              <p className="mt-1 text-[11.5px] text-muted">Try an institution name, case number or Permanent ID.</p>
            </div>
          ) : (
            Object.entries(grouped).map(([group, entries]) => (
              <div key={group} className="mb-1.5">
                <p className="px-2.5 py-1.5 text-[8.5px] font-bold uppercase tracking-[0.18em] text-muted/70">
                  {group}
                </p>
                {entries.map((result) => {
                  runningIndex += 1
                  const isActive = runningIndex === activeIndex
                  return (
                    <button
                      key={`${result.group}-${result.id}`}
                      type="button"
                      onMouseEnter={() => setActiveIndex(flat.indexOf(result))}
                      onClick={() => {
                        navigate(result.to)
                        onClose()
                      }}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition',
                        isActive ? 'bg-paper-deep/80' : 'hover:bg-paper/70',
                      )}
                    >
                      <span
                        className={cn(
                          'grid h-8 w-8 shrink-0 place-items-center rounded-lg border',
                          result.group === 'Institutions'
                            ? 'border-blue/15 bg-blue-soft text-blue'
                            : result.group === 'Cases'
                              ? 'border-saffron/20 bg-saffron-soft text-saffron'
                              : 'border-line bg-paper text-muted',
                        )}
                      >
                        <result.icon className="h-3.5 w-3.5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[12px] font-bold text-ink">{result.title}</span>
                        <span className="block truncate text-[10.5px] text-muted">{result.subtitle}</span>
                      </span>
                      <ArrowRight
                        className={cn(
                          'h-3.5 w-3.5 shrink-0 transition',
                          isActive ? 'text-ink' : 'text-transparent',
                        )}
                      />
                    </button>
                  )
                })}
              </div>
            ))
          )}
        </div>

        <div className="flex items-center justify-between border-t border-line bg-paper/60 px-4 py-2.5">
          <div className="flex items-center gap-3 text-[9.5px] text-muted">
            <span className="inline-flex items-center gap-1">
              <kbd className="rounded border border-line bg-surface px-1 py-0.5 font-mono text-[8px]">↑</kbd>
              <kbd className="rounded border border-line bg-surface px-1 py-0.5 font-mono text-[8px]">↓</kbd>
              navigate
            </span>
            <span className="inline-flex items-center gap-1">
              <kbd className="rounded border border-line bg-surface px-1 py-0.5 font-mono text-[8px]">↵</kbd>
              open
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[9px] font-semibold text-muted">
            <Command className="h-3 w-3" />
            AICTE Samanvay search
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}

export const quickActions = [
  { label: 'Review overlap queue', to: '/overlaps', icon: GitMerge },
  { label: 'Open triage inbox', to: '/triage', icon: Inbox },
]
