import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: {
  eyebrow?: string
  title: string
  description?: string
  actions?: ReactNode
  className?: string
}) {
  return (
    <div className={cn('mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between', className)}>
      <div className="min-w-0">
        {eyebrow ? <p className="kicker mb-2">{eyebrow}</p> : null}
        <h1 className="max-w-3xl text-balance text-[30px] leading-[1.04] tracking-[-0.03em] text-ink sm:text-[36px]">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 max-w-2xl text-[12.5px] leading-relaxed text-muted">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  )
}
