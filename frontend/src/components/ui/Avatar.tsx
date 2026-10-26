import { cn, initials } from '@/lib/utils'

const palette = [
  'bg-blue-soft text-blue',
  'bg-saffron-soft text-saffron',
  'bg-teal-soft text-teal',
  'bg-violet-soft text-violet',
  'bg-vermilion-soft text-vermilion',
  'bg-amber-soft text-amber',
]

export function Avatar({
  name,
  size = 'md',
  className,
  tone,
}: {
  name: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
  tone?: number
}) {
  const index =
    tone ??
    name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) % palette.length
  const sizes = {
    sm: 'h-7 w-7 text-[9px]',
    md: 'h-9 w-9 text-[10px]',
    lg: 'h-12 w-12 text-[13px]',
  }
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full border border-black/5 font-bold tracking-wide',
        palette[index],
        sizes[size],
        className,
      )}
      aria-hidden="true"
    >
      {initials(name)}
    </span>
  )
}
