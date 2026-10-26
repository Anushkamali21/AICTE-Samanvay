import { Lock } from 'lucide-react'
import type { Bureau, CaseStatus, Confidentiality, Severity } from '@/data/types'
import {
  bureauTones,
  severityTones,
  statusTones,
  type Tone,
} from '@/lib/presentation'
import { cn } from '@/lib/utils'

function toneClasses(tone: Tone) {
  return cn(tone.bg, tone.text, tone.border)
}

export function StatusPill({
  status,
  className,
  size = 'md',
}: {
  status: CaseStatus
  className?: string
  size?: 'sm' | 'md'
}) {
  const tone = statusTones[status]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-semibold whitespace-nowrap',
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-[11px]',
        toneClasses(tone),
        className,
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', tone.dot)} />
      {status}
    </span>
  )
}

export function SeverityBadge({
  severity,
  className,
  withLabel = true,
}: {
  severity: Severity
  className?: string
  withLabel?: boolean
}) {
  const tone = severityTones[severity]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap',
        toneClasses(tone),
        className,
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', tone.dot)} />
      {withLabel ? severity : null}
    </span>
  )
}

export function BureauBadge({
  bureau,
  className,
  compact = false,
}: {
  bureau: Bureau
  className?: string
  compact?: boolean
}) {
  const tone = bureauTones[bureau]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[10px] font-bold tracking-[0.02em] whitespace-nowrap',
        toneClasses(tone),
        className,
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-sm', tone.dot)} />
      {compact && bureau === 'Regulation Bureau' ? 'RB' : bureau}
    </span>
  )
}

export function ConfidentialityBadge({
  level,
  className,
}: {
  level: Confidentiality
  className?: string
}) {
  if (level === 'Normal') return null
  const sealed = level === 'Sealed'
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[10px] font-bold tracking-[0.04em] uppercase whitespace-nowrap',
        sealed
          ? 'border-danger/20 bg-danger-soft text-danger'
          : 'border-amber/20 bg-amber-soft text-amber',
        className,
      )}
    >
      <Lock className="h-3 w-3" />
      {sealed ? 'Sealed' : 'Restricted'}
    </span>
  )
}

export function Dot({ className }: { className?: string }) {
  return <span className={cn('h-1.5 w-1.5 rounded-full', className)} />
}

export function CountBadge({
  children,
  tone = 'neutral',
  className,
}: {
  children: React.ReactNode
  tone?: 'neutral' | 'accent' | 'danger' | 'teal'
  className?: string
}) {
  const tones = {
    neutral: 'bg-paper-deep text-ink-soft border-line-strong/60',
    accent: 'bg-saffron-soft text-saffron border-saffron/20',
    danger: 'bg-danger-soft text-danger border-danger/15',
    teal: 'bg-teal-soft text-teal border-teal/15',
  }
  return (
    <span
      className={cn(
        'inline-flex min-w-5 items-center justify-center rounded-full border px-1.5 py-0.5 text-[10px] font-bold',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
