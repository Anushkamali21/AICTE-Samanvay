import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { disposalTrend } from '@/data/mock'
import { ChartTooltip } from './ChartTooltip'

export function DisposalTrendChart() {
  return (
    <div className="h-[210px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={disposalTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
            domain={[16, 24]}
            ticks={[16, 18, 20, 22, 24]}
            width={42}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#cec6b6', strokeDasharray: '3 4' }} />
          <Line
            type="monotone"
            dataKey="days"
            name="Avg. disposal (days)"
            stroke="#e2872f"
            strokeWidth={2.4}
            dot={{ r: 3.2, fill: '#fffdf8', stroke: '#e2872f', strokeWidth: 2 }}
            activeDot={{ r: 5, fill: '#e2872f', stroke: '#fffdf8', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
