import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const DEMO_NOW = new Date('2026-10-26T18:00:00+05:30').getTime()

const dateFormatter = new Intl.DateTimeFormat('en-IN', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

const shortDateFormatter = new Intl.DateTimeFormat('en-IN', {
  day: '2-digit',
  month: 'short',
})

const timeFormatter = new Intl.DateTimeFormat('en-IN', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
})

export function formatDate(iso: string): string {
  return dateFormatter.format(new Date(iso))
}

export function formatShortDate(iso: string): string {
  return shortDateFormatter.format(new Date(iso))
}

export function formatDateTime(iso: string): string {
  const date = new Date(iso)
  return `${shortDateFormatter.format(date)} · ${timeFormatter.format(date)}`
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-IN').format(value)
}

export function formatCompact(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}

export function daysSince(iso: string): number {
  const then = new Date(iso).getTime()
  return Math.max(0, Math.floor((DEMO_NOW - then) / 86_400_000))
}

export function daysUntil(iso: string): number {
  const then = new Date(iso).getTime()
  return Math.ceil((then - DEMO_NOW) / 86_400_000)
}

export function relativeTime(iso: string): string {
  const diff = Math.max(0, DEMO_NOW - new Date(iso).getTime())
  const minutes = Math.floor(diff / 60_000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  return `${months}mo ago`
}

export function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function titleCase(value: string): string {
  return value.replace(/\b\w/g, (char) => char.toUpperCase())
}
