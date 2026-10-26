import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { monthlyInflow } from '@/data/mock'
import { ChartTooltip } from './ChartTooltip'

export function InflowChart() {
  return (
    <div className="h-[248px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={monthlyInflow} margin={{ top: 10, right: 6, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="inflow-received" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2f5da8" stopOpacity={0.26} />
              <stop offset="100%" stopColor="#2f5da8" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="inflow-disposed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1b7a6b" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#1b7a6b" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="#e3ddcf" strokeDasharray="3 5" />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6e7784', fontSize: 10, fontWeight: 600 }}
            dy={8}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6e7784', fontSize: 10 }}
            domain={[0, 1400]}
            ticks={[0, 400, 800, 1200]}
            tickFormatter={(value: number) => value.toLocaleString('en-IN')}
            width={52}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#cec6b6', strokeDasharray: '3 4' }} />
          <Area
            type="monotone"
            dataKey="received"
            name="Received"
            stroke="#2f5da8"
            strokeWidth={2}
            fill="url(#inflow-received)"
            dot={false}
            activeDot={{ r: 4, strokeWidth: 2, stroke: '#fffdf8' }}
          />
          <Area
            type="monotone"
            dataKey="disposed"
            name="Disposed"
            stroke="#1b7a6b"
            strokeWidth={2}
            strokeDasharray="5 4"
            fill="url(#inflow-disposed)"
            dot={false}
            activeDot={{ r: 4, strokeWidth: 2, stroke: '#fffdf8' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
