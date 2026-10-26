import { useId } from 'react'
import { cn } from '@/lib/utils'

export function Sparkline({
  data,
  color = '#e2872f',
  width = 120,
  height = 34,
  filled = true,
  className,
}: {
  data: number[]
  color?: string
  width?: number
  height?: number
  filled?: boolean
  className?: string
}) {
  const gradientId = useId().replaceAll(':', '')
  if (data.length < 2) return null

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const step = width / (data.length - 1)
  const points = data.map((value, index) => {
    const x = index * step
    const y = height - 5 - ((value - min) / range) * (height - 10)
    return [x, y] as const
  })
  const line = points.map(([x, y], index) => `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`).join(' ')
  const area = `${line} L ${width} ${height} L 0 ${height} Z`

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={cn('overflow-visible', className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {filled ? <path d={area} fill={`url(#${gradientId})`} /> : null}
      <path d={line} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle
        cx={points[points.length - 1][0]}
        cy={points[points.length - 1][1]}
        r="2.6"
        fill={color}
        stroke="#fffdf8"
        strokeWidth="1.5"
      />
    </svg>
  )
}
