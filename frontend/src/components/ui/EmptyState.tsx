import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon
  title: string
  description: string
  action?: ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-col items-center justify-center px-6 py-14 text-center', className)}>
      <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl border border-line bg-paper-deep/60 text-muted">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="text-base text-ink">{title}</h3>
      <p className="mt-1 max-w-sm text-[12px] leading-relaxed text-muted">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  )
}
