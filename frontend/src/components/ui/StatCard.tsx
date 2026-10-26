import { ArrowDownRight, ArrowUpRight, Minus, type LucideIcon } from 'lucide-react'
import { Sparkline } from '@/components/ui/Sparkline'
import { cn } from '@/lib/utils'

export function StatCard({
  label,
  value,
  suffix,
  delta,
  deltaLabel,
  trend = 'up',
  good = true,
  icon: Icon,
  sparkData,
  color = '#e2872f',
  note,
  className,
}: {
  label: string
  value: string | number
  suffix?: string
  delta?: string
  deltaLabel?: string
  trend?: 'up' | 'down' | 'flat'
  good?: boolean
  icon: LucideIcon
  sparkData?: number[]
  color?: string
  note?: string
  className?: string
}) {
  const DeltaIcon = trend === 'up' ? ArrowUpRight : trend === 'down' ? ArrowDownRight : Minus
  return (
    <div className={cn('panel group relative overflow-hidden p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift', className)}>
      <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-paper-deep/50 blur-2xl transition group-hover:bg-saffron-soft/70" />
      <div className="relative flex items-start justify-between gap-2">
        <div>
          <p className="text-[9.5px] font-bold uppercase tracking-[0.14em] text-muted">{label}</p>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="font-display text-[31px] leading-none tracking-[-0.04em] text-ink">{value}</span>
            {suffix ? <span className="text-[12px] font-semibold text-muted">{suffix}</span> : null}
          </div>
        </div>
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-line bg-paper/70 text-ink-soft">
          <Icon className="h-3.5 w-3.5" strokeWidth={1.8} />
        </span>
      </div>

      <div className="relative mt-3 flex items-end justify-between gap-2">
        <div className="flex flex-col gap-1">
          {delta ? (
            <span
              className={cn(
                'inline-flex w-fit items-center gap-0.5 rounded-full border px-1.5 py-0.5 text-[9px] font-bold',
                good
                  ? 'border-teal/15 bg-teal-soft text-teal'
                  : 'border-danger/15 bg-danger-soft text-danger',
              )}
            >
              <DeltaIcon className="h-2.5 w-2.5" />
              {delta}
            </span>
          ) : null}
          <span className="text-[9.5px] leading-tight text-muted">{deltaLabel ?? note}</span>
        </div>
        {sparkData ? <Sparkline data={sparkData} color={color} width={86} height={30} /> : null}
      </div>
    </div>
  )
}
