"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface CallVolumeChartProps {
  data: number[] // Array of last 7 days call counts
}

export function CallVolumeChart({ data }: CallVolumeChartProps) {
  // Transform the data array into the format Recharts expects
  const chartData = data.map((value, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    return {
      date: date.toLocaleDateString('en-US', { weekday: 'short' }),
      calls: value
    };
  });

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Call Volume (Last 7 Days)</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="calls" fill="#6C5DD3" name="Calls" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

