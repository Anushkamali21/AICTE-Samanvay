import { useNavigate } from 'react-router-dom'
import type { CaseRecord, Institution } from '@/data/types'
import { useRole } from '@/context/RoleContext'
import { bureauTones, chartColors } from '@/lib/presentation'
import { cn } from '@/lib/utils'

function truncate(value: string, length: number): string {
  return value.length > length ? `${value.slice(0, length - 1)}…` : value
}

export function CaseGraph({
  institution,
  records,
  className,
}: {
  institution: Institution
  records: CaseRecord[]
  className?: string
}) {
  const navigate = useNavigate()
  const { canViewSealed } = useRole()
  const visible = records.slice(0, 4)
  const positions = [
    { x: 34, y: 30 },
    { x: 446, y: 30 },
    { x: 34, y: 248 },
    { x: 446, y: 248 },
  ]
  const center = { x: 320, y: 170 }

  return (
    <div className={cn('w-full overflow-x-auto scroll-area', className)}>
      <svg viewBox="0 0 640 340" className="h-auto w-full min-w-[600px]" role="img" aria-label="Institution case family graph">
        <defs>
          <pattern id="case-grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#e3ddcf" strokeWidth="0.5" opacity=".65" />
          </pattern>
          <filter id="node-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#131b26" floodOpacity=".07" />
          </filter>
        </defs>

        <rect width="640" height="340" fill="url(#case-grid)" opacity=".6" rx="12" />

        {visible.map((record, index) => {
          const position = positions[index]
          const nodeCenter = { x: position.x + 80, y: position.y + 32 }
          const isLinked = record.linkedCaseIds.length > 0
          const stroke = isLinked ? chartColors.saffron : chartColors.line
          return (
            <path
              key={`edge-${record.id}`}
              d={`M ${center.x} ${center.y} C ${center.x} ${nodeCenter.y}, ${nodeCenter.x} ${center.y}, ${nodeCenter.x} ${nodeCenter.y}`}
              fill="none"
              stroke={stroke}
              strokeWidth={isLinked ? 1.8 : 1.2}
              strokeDasharray={isLinked ? '4 4' : undefined}
              opacity={isLinked ? 0.9 : 0.65}
            />
          )
        })}

        <g filter="url(#node-shadow)">
          <rect x="218" y="134" width="204" height="72" rx="12" fill="#0b1725" />
          <rect x="218" y="134" width="4" height="72" rx="2" fill="#e2872f" />
          <text x="236" y="158" fill="#fffdf8" fontSize="12" fontWeight="700" fontFamily="Manrope Variable, sans-serif">
            {truncate(institution.shortName, 26)}
          </text>
          <text x="236" y="173" fill="#ffffff" opacity=".5" fontSize="7.5" fontFamily="JetBrains Mono Variable, monospace">
            {institution.permanentId}
          </text>
          <text x="236" y="191" fill="#e2872f" fontSize="8" fontWeight="700" fontFamily="Manrope Variable, sans-serif" letterSpacing="1.2">
            {records.length} OPEN CASE{records.length === 1 ? '' : 'S'} · CASE FAMILY
          </text>
        </g>

        {visible.map((record, index) => {
          const position = positions[index]
          const masked = record.confidentiality === 'Sealed' && !canViewSealed
          const tone = bureauTones[record.bureau]
          const isLinked = record.linkedCaseIds.length > 0
          return (
            <g
              key={record.id}
              role="button"
              tabIndex={0}
              aria-label={`Open ${record.caseNo}`}
              onClick={() => navigate(`/cases/${record.id}`)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') navigate(`/cases/${record.id}`)
              }}
              className="cursor-pointer"
            >
              <rect
                x={position.x}
                y={position.y}
                width="160"
                height="64"
                rx="9"
                fill="#fffdf8"
                stroke={masked ? '#b42318' : isLinked ? '#e2872f' : '#e3ddcf'}
                strokeWidth={masked || isLinked ? 1.3 : 1}
                filter="url(#node-shadow)"
              />
              <rect x={position.x} y={position.y} width="4" height="64" rx="2" fill={masked ? chartColors.danger : tone.soft} />
              <text
                x={position.x + 13}
                y={position.y + 16}
                fill="#6e7784"
                fontSize="7"
                fontWeight="700"
                fontFamily="JetBrains Mono Variable, monospace"
              >
                {record.caseNo.slice(-5)}
              </text>
              <text
                x={position.x + 13}
                y={position.y + 30}
                fill="#131b26"
                fontSize="9"
                fontWeight="700"
                fontFamily="Manrope Variable, sans-serif"
              >
                {masked ? 'Sealed inquiry' : truncate(record.title, 25)}
              </text>
              <circle cx={position.x + 15} cy={position.y + 43} r="2.2" fill={masked ? chartColors.danger : tone.soft} />
              <text
                x={position.x + 21}
                y={position.y + 46}
                fill="#3a4452"
                fontSize="7"
                fontWeight="600"
                fontFamily="Manrope Variable, sans-serif"
              >
                {masked ? 'Restricted cell' : truncate(record.bureau, 22)}
              </text>
              <text
                x={position.x + 13}
                y={position.y + 57}
                fill={masked ? '#b42318' : isLinked ? '#b07318' : '#6e7784'}
                fontSize="6.6"
                fontWeight="700"
                fontFamily="Manrope Variable, sans-serif"
                letterSpacing=".6"
              >
                {masked ? 'SEALED · RESTRICTED' : isLinked ? 'LINKED · COORDINATION' : record.status.toUpperCase()}
              </text>
            </g>
          )
        })}

        {records.length > 4 ? (
          <text x="320" y="326" textAnchor="middle" fill="#6e7784" fontSize="9" fontWeight="700" fontFamily="Manrope Variable, sans-serif">
            +{records.length - 4} more cases in the registry
          </text>
        ) : null}
      </svg>
    </div>
  )
}
