import type { Bureau, CaseRecord, CaseStatus, Severity, SlaState } from '@/data/types'
import { daysUntil } from './utils'

export interface Tone {
  bg: string
  text: string
  border: string
  dot: string
  soft: string
}

export const statusTones: Record<CaseStatus, Tone> = {
  New: {
    bg: 'bg-blue-soft',
    text: 'text-blue',
    border: 'border-blue/15',
    dot: 'bg-blue',
    soft: '#2f5da8',
  },
  Triaged: {
    bg: 'bg-violet-soft',
    text: 'text-violet',
    border: 'border-violet/15',
    dot: 'bg-violet',
    soft: '#6b4fa1',
  },
  'Under process': {
    bg: 'bg-amber-soft',
    text: 'text-amber',
    border: 'border-amber/15',
    dot: 'bg-amber',
    soft: '#b07318',
  },
  'Action initiated': {
    bg: 'bg-saffron-soft',
    text: 'text-saffron',
    border: 'border-saffron/20',
    dot: 'bg-saffron',
    soft: '#e2872f',
  },
  'Awaiting institution': {
    bg: 'bg-slate-soft',
    text: 'text-ink-soft',
    border: 'border-line-strong/50',
    dot: 'bg-ink-soft',
    soft: '#3a4452',
  },
  'Under scrutiny': {
    bg: 'bg-violet-soft',
    text: 'text-violet',
    border: 'border-violet/15',
    dot: 'bg-violet',
    soft: '#6b4fa1',
  },
  Escalated: {
    bg: 'bg-danger-soft',
    text: 'text-danger',
    border: 'border-danger/15',
    dot: 'bg-danger',
    soft: '#b42318',
  },
  Disposed: {
    bg: 'bg-teal-soft',
    text: 'text-teal',
    border: 'border-teal/15',
    dot: 'bg-teal',
    soft: '#1b7a6b',
  },
  Transferred: {
    bg: 'bg-slate-soft',
    text: 'text-muted',
    border: 'border-line-strong/50',
    dot: 'bg-muted',
    soft: '#6e7784',
  },
}

export const severityTones: Record<Severity, Tone> = {
  Low: {
    bg: 'bg-teal-soft',
    text: 'text-teal',
    border: 'border-teal/15',
    dot: 'bg-teal',
    soft: '#1b7a6b',
  },
  Medium: {
    bg: 'bg-blue-soft',
    text: 'text-blue',
    border: 'border-blue/15',
    dot: 'bg-blue',
    soft: '#2f5da8',
  },
  High: {
    bg: 'bg-saffron-soft',
    text: 'text-saffron',
    border: 'border-saffron/20',
    dot: 'bg-saffron',
    soft: '#e2872f',
  },
  Critical: {
    bg: 'bg-danger-soft',
    text: 'text-danger',
    border: 'border-danger/15',
    dot: 'bg-danger',
    soft: '#b42318',
  },
}

export const bureauTones: Record<Bureau, Tone> = {
  PGRC: {
    bg: 'bg-blue-soft',
    text: 'text-blue',
    border: 'border-blue/15',
    dot: 'bg-blue',
    soft: '#2f5da8',
  },
  'Regulation Bureau': {
    bg: 'bg-saffron-soft',
    text: 'text-saffron',
    border: 'border-saffron/20',
    dot: 'bg-saffron',
    soft: '#e2872f',
  },
  'Anti-Ragging Cell': {
    bg: 'bg-danger-soft',
    text: 'text-danger',
    border: 'border-danger/15',
    dot: 'bg-danger',
    soft: '#b42318',
  },
  'SC/ST Cell': {
    bg: 'bg-violet-soft',
    text: 'text-violet',
    border: 'border-violet/15',
    dot: 'bg-violet',
    soft: '#6b4fa1',
  },
  "Women's Cell": {
    bg: 'bg-vermilion-soft',
    text: 'text-vermilion',
    border: 'border-vermilion/15',
    dot: 'bg-vermilion',
    soft: '#cf5a3c',
  },
  'Vigilance Cell': {
    bg: 'bg-amber-soft',
    text: 'text-amber',
    border: 'border-amber/15',
    dot: 'bg-amber',
    soft: '#b07318',
  },
  'Legal Cell': {
    bg: 'bg-slate-soft',
    text: 'text-ink-soft',
    border: 'border-line-strong/50',
    dot: 'bg-ink-soft',
    soft: '#3a4452',
  },
  'Regional Office': {
    bg: 'bg-teal-soft',
    text: 'text-teal',
    border: 'border-teal/15',
    dot: 'bg-teal',
    soft: '#1b7a6b',
  },
}

export const chartColors: Record<string, string> = {
  blue: '#2f5da8',
  saffron: '#e2872f',
  vermilion: '#cf5a3c',
  teal: '#1b7a6b',
  amber: '#b07318',
  violet: '#6b4fa1',
  danger: '#b42318',
  slate: '#7a8492',
  ink: '#131b26',
  line: '#e3ddcf',
}

export function slaState(record: Pick<CaseRecord, 'status' | 'dueAt'>): SlaState {
  if (record.status === 'Disposed' || record.status === 'Transferred') return 'closed'
  const remaining = daysUntil(record.dueAt)
  if (remaining < 0) return 'overdue'
  if (remaining <= 7) return 'due-soon'
  return 'on-track'
}

export function slaLabel(record: Pick<CaseRecord, 'status' | 'dueAt'>): string {
  const state = slaState(record)
  if (state === 'closed') return 'Closed'
  const remaining = daysUntil(record.dueAt)
  if (remaining < 0) return `${Math.abs(remaining)}d overdue`
  if (remaining === 0) return 'Due today'
  return `${remaining}d left`
}

export function riskTone(score: number): Tone {
  if (score >= 75) return severityTones.Critical
  if (score >= 60) return severityTones.High
  if (score >= 40) return severityTones.Medium
  return severityTones.Low
}

export function riskLabel(score: number): string {
  if (score >= 75) return 'High risk'
  if (score >= 60) return 'Elevated'
  if (score >= 40) return 'Moderate'
  return 'Low risk'
}
