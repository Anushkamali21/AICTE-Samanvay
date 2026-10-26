interface TooltipEntry {
  name?: string
  value?: number | string
  color?: string
  dataKey?: string
}

export function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: TooltipEntry[]
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-line bg-surface px-3 py-2 shadow-lift">
      {label ? <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.12em] text-muted">{label}</p> : null}
      <div className="space-y-1">
        {payload.map((entry) => (
          <div key={`${entry.dataKey}-${entry.name}`} className="flex items-center gap-2 text-[11px]">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: entry.color }} />
            <span className="text-muted">{entry.name}</span>
            <span className="ml-auto font-bold text-ink">{entry.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
