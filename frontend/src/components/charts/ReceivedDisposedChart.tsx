import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { monthlyInflow } from '@/data/mock'
import { ChartTooltip } from './ChartTooltip'

export function ReceivedDisposedChart() {
  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={monthlyInflow} margin={{ top: 10, right: 6, left: 0, bottom: 0 }} barGap={4}>
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
          <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(227,221,207,.28)' }} />
          <Bar dataKey="received" name="Received" fill="#2f5da8" radius={[3, 3, 0, 0]} barSize={16} />
          <Bar dataKey="disposed" name="Disposed" fill="#1b7a6b" radius={[3, 3, 0, 0]} barSize={16} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
