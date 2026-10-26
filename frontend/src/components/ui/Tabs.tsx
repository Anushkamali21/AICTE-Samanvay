import { cn } from '@/lib/utils'

export interface TabItem {
  id: string
  label: string
  count?: number
}

export function Tabs({
  tabs,
  value,
  onChange,
  variant = 'underline',
  className,
}: {
  tabs: TabItem[]
  value: string
  onChange: (id: string) => void
  variant?: 'underline' | 'pill'
  className?: string
}) {
  if (variant === 'pill') {
    return (
      <div
        className={cn(
          'flex max-w-full flex-wrap items-center gap-1 rounded-xl border border-line bg-paper/70 p-1 sm:inline-flex sm:flex-nowrap',
          className,
        )}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              'inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-3 text-[12px] font-semibold transition',
              value === tab.id
                ? 'bg-surface text-ink shadow-sm'
                : 'text-muted hover:bg-surface/60 hover:text-ink',
            )}
          >
            {tab.label}
            {typeof tab.count === 'number' ? (
              <span className={cn('text-[10px] font-bold', value === tab.id ? 'text-saffron' : 'text-muted')}>
                {tab.count}
              </span>
            ) : null}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className={cn('flex items-center gap-5 overflow-x-auto border-b border-line scroll-area', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn(
            'relative -mb-px inline-flex shrink-0 items-center gap-2 whitespace-nowrap pb-2.5 pt-1 text-[12px] font-semibold transition',
            value === tab.id
              ? 'border-b-2 border-ink text-ink'
              : 'border-b-2 border-transparent text-muted hover:text-ink',
          )}
        >
          {tab.label}
          {typeof tab.count === 'number' ? (
            <span
              className={cn(
                'inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-[9px] font-bold',
                value === tab.id ? 'bg-ink text-paper' : 'bg-paper-deep text-muted',
              )}
            >
              {tab.count}
            </span>
          ) : null}
        </button>
      ))}
    </div>
  )
}
