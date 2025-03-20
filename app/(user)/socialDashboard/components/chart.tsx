"use client"
import {
  BarChart as RechartsBarChart,
  Bar,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface ChartProps {
  data: any[]
  height?: number | string
  xAxisKey: string
  series: {
    key: string
    name: string
    color: string
  }[]
}

export function SimpleLineChart({ data, height = 300, xAxisKey, series }: ChartProps) {
  if (!data || data.length === 0) {
    return <div className="flex h-full items-center justify-center p-6 text-muted-foreground">No data available</div>
  }

  return (
    <div style={{ width: "100%", height: height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxisKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          {series.map((s) => (
            <Line key={s.key} type="monotone" dataKey={s.key} name={s.name} stroke={s.color} activeDot={{ r: 8 }} />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  )
}

export function SimpleBarChart({ data, height = 300, xAxisKey, series }: ChartProps) {
  if (!data || data.length === 0) {
    return <div className="flex h-full items-center justify-center p-6 text-muted-foreground">No data available</div>
  }

  return (
    <div style={{ width: "100%", height: height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxisKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          {series.map((s) => (
            <Bar key={s.key} dataKey={s.key} name={s.name} fill={s.color} />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  )
}

