import { cn } from '@/lib/utils'

export function MatchScore({
  score,
  size = 64,
  label = 'match',
  className,
}: {
  score: number
  size?: number
  label?: string
  className?: string
}) {
  const color = score >= 85 ? '#b42318' : score >= 70 ? '#e2872f' : '#2f5da8'
  const soft = score >= 85 ? '#fbe4e1' : score >= 70 ? '#f7e6cd' : '#e2eaf7'
  return (
    <div
      className={cn('relative grid shrink-0 place-items-center rounded-full border', className)}
      style={{ width: size, height: size, background: soft, borderColor: `${color}22` }}
    >
      <div className="text-center">
        <p className="font-display leading-none tracking-[-0.04em]" style={{ color, fontSize: size * 0.32 }}>
          {score}
        </p>
        <p className="mt-0.5 text-[6.5px] font-bold uppercase tracking-[0.16em]" style={{ color }}>
          {label}
        </p>
      </div>
    </div>
  )
}
