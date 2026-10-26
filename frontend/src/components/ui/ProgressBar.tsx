import { cn } from '@/lib/utils'

const tones = {
  ink: 'bg-ink',
  saffron: 'bg-saffron',
  teal: 'bg-teal',
  blue: 'bg-blue',
  amber: 'bg-amber',
  danger: 'bg-danger',
  violet: 'bg-violet',
  vermilion: 'bg-vermilion',
  muted: 'bg-muted',
}

export function ProgressBar({
  value,
  tone = 'ink',
  height = 6,
  className,
  trackClassName,
}: {
  value: number
  tone?: keyof typeof tones
  height?: number
  className?: string
  trackClassName?: string
}) {
  const width = Math.min(100, Math.max(0, value))
  return (
    <div
      className={cn('w-full overflow-hidden rounded-full bg-paper-deep', trackClassName, className)}
      style={{ height }}
      role="progressbar"
      aria-valuenow={Math.round(width)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn('h-full rounded-full transition-[width] duration-700 ease-out', tones[tone])}
        style={{ width: `${width}%` }}
      />
    </div>
  )
}
