import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function Panel({
  children,
  className,
  as: Tag = 'section',
}: {
  children: ReactNode
  className?: string
  as?: 'section' | 'article' | 'div'
}) {
  return <Tag className={cn('panel', className)}>{children}</Tag>
}

export function PanelHeader({
  eyebrow,
  title,
  description,
  action,
  className,
}: {
  eyebrow?: string
  title: string
  description?: string
  action?: ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex items-start justify-between gap-4 px-5 pt-5', className)}>
      <div className="min-w-0">
        {eyebrow ? <p className="kicker mb-1.5">{eyebrow}</p> : null}
        <h2 className="text-[17px] leading-tight text-ink">{title}</h2>
        {description ? (
          <p className="mt-1 max-w-xl text-[12px] leading-relaxed text-muted">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}
