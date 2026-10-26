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
import { bureauWorkload } from '@/data/mock'
import { chartColors } from '@/lib/presentation'
import { ChartTooltip } from './ChartTooltip'

export function BureauWorkloadChart() {
  return (
    <div className="h-[268px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={bureauWorkload}
          layout="vertical"
          margin={{ top: 4, right: 34, left: 0, bottom: 0 }}
          barCategoryGap={9}
        >
          <CartesianGrid horizontal={false} stroke="#e3ddcf" strokeDasharray="3 5" />
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="short"
            axisLine={false}
            tickLine={false}
            width={82}
            tick={{ fill: '#3a4452', fontSize: 10, fontWeight: 650 }}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(227,221,207,.28)' }} />
          <Bar dataKey="cases" name="Open cases" radius={[0, 5, 5, 0]} barSize={13}>
            {bureauWorkload.map((entry) => (
              <Cell key={entry.bureau} fill={chartColors[entry.tone] ?? chartColors.slate} />
            ))}
            <LabelList
              dataKey="cases"
              position="right"
              style={{ fill: '#3a4452', fontSize: 10, fontWeight: 700 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
