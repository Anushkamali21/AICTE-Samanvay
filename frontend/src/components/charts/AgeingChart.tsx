import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ageingBuckets } from '@/data/mock'
import { chartColors } from '@/lib/presentation'
import { ChartTooltip } from './ChartTooltip'

export function AgeingChart() {
  return (
    <div className="h-[224px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={ageingBuckets} margin={{ top: 20, right: 2, left: 0, bottom: 0 }} barCategoryGap={18}>
          <CartesianGrid vertical={false} stroke="#e3ddcf" strokeDasharray="3 5" />
          <XAxis
            dataKey="bucket"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6e7784', fontSize: 10, fontWeight: 600 }}
            dy={8}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6e7784', fontSize: 10 }}
            domain={[0, 350]}
            ticks={[0, 100, 200, 300]}
            tickFormatter={(value: number) => value.toLocaleString('en-IN')}
            width={42}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(227,221,207,.28)' }} />
          <Bar dataKey="cases" name="Open cases" radius={[5, 5, 0, 0]} barSize={26}>
            {ageingBuckets.map((entry) => (
              <Cell key={entry.bucket} fill={chartColors[entry.tone] ?? chartColors.slate} />
            ))}
            <LabelList
              dataKey="cases"
              position="top"
              style={{ fill: '#3a4452', fontSize: 9.5, fontWeight: 700 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
