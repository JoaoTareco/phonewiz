"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CallDistributionChartProps {
  data: {
    morning: number
    afternoon: number
    evening: number
    night: number
  }
}

const COLORS = ["#E8EDFB", "#6C5DD3", "#9747FF", "#4CAF50"]

export function CallDistributionChart({ data }: CallDistributionChartProps) {
  // Transform the data object into an array format that Recharts expects
  const chartData = [
    { name: "Morning", value: data.morning },
    { name: "Afternoon", value: data.afternoon },
    { name: "Evening", value: data.evening },
    { name: "Night", value: data.night }
  ]

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Call Distribution by Time of Day</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={0}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

