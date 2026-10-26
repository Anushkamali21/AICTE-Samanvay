import type { CSSProperties } from 'react'
import { riskLabel, riskTone } from '@/lib/presentation'
import { cn } from '@/lib/utils'

export function RiskRing({
  score,
  size = 96,
  stroke = 8,
  showLabel = true,
  className,
}: {
  score: number
  size?: number
  stroke?: number
  showLabel?: boolean
  className?: string
}) {
  const tone = riskTone(score)
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - score / 100)

  return (
    <div className={cn('relative inline-flex shrink-0 items-center justify-center', className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#ece6da" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={tone.soft}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="ring-animate"
          style={{ '--ring-full': `${circumference}px` } as CSSProperties}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-[22px] leading-none text-ink">{score}</span>
        {showLabel ? (
          <span className={cn('mt-0.5 text-[8px] font-bold whitespace-nowrap uppercase tracking-[0.14em]', tone.text)}>
            {riskLabel(score)}
          </span>
        ) : null}
      </div>
    </div>
  )
}
