export function SlaGauge({ value = 86 }: { value?: number }) {
  const size = 176
  const center = size / 2
  const radius = 62
  const startAngle = 135
  const endAngle = 405

  const polar = (angle: number) => {
    const radians = (angle * Math.PI) / 180
    return {
      x: center + radius * Math.cos(radians),
      y: center + radius * Math.sin(radians),
    }
  }
  const start = polar(startAngle)
  const end = polar(endAngle)
  const arc = `M ${start.x} ${start.y} A ${radius} ${radius} 0 1 1 ${end.x} ${end.y}`

  return (
    <div className="relative flex flex-col items-center">
      <svg width={size} height={size - 18} viewBox={`0 0 ${size} ${size - 18}`} aria-hidden="true">
        <path d={arc} fill="none" stroke="#ece6da" strokeWidth={13} strokeLinecap="round" />
        <path
          d={arc}
          fill="none"
          stroke="#1b7a6b"
          strokeWidth={13}
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray={`${value} ${100 - value}`}
        />
        <circle cx={start.x} cy={start.y} r={2.5} fill="#cec6b6" />
        <circle cx={end.x} cy={end.y} r={2.5} fill="#cec6b6" />
      </svg>
      <div className="pointer-events-none absolute inset-x-0 top-[38px] flex flex-col items-center">
        <span className="font-display text-[36px] leading-none tracking-[-0.04em] text-ink">{value}%</span>
        <span className="mt-1 text-[8.5px] font-bold uppercase tracking-[0.16em] text-muted">SLA compliance</span>
      </div>
      <div className="mt-1 flex w-full items-center justify-between px-1 text-[9px] font-semibold text-muted">
        <span>0</span>
        <span className="text-teal">Target 90%</span>
        <span>100</span>
      </div>
    </div>
  )
}
