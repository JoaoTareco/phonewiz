"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button"
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Card } from "@/components/ui/card";
// import { cn } from "@/lib/utils";

// import { tools } from "@/constants";

import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"

import { useEffect } from "react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  scales: {
    y: {
      ticks: {
        display: false,
      }
    }
  },
  responsive: true,
  plugins: {
    legend: {
      display: false
    },
    title: {
      display: false,
      text: 'Chart.js Line Chart',
    },
  },
};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

export const data = {
  labels,
  datasets: [
    {
      label: 'My First dataset',
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      data: [65, 59, 80, 81, 56, 55, 40]
    }
  ],
};

export default function HomePage() {
  const router = useRouter();

  return (
    <div>
      <div className="mb-8 space-y-8">
        <h2 className="text-2xl md:text-2xl font-medium ml-10">
          Explore the power of AI
        </h2>
      </div>
    <div className="m-8">
    <div className="grid grid-cols-3 gap-4 content-start">
    <Card className="w-flex m-4">
      <CardHeader>
        <div className="flex justify-between">
        <CardTitle className="pt-2">Keyword</CardTitle>
        <div className="flex-none">
        <div className="flex justify-between">
          <div className="flex-none px-2">
            <div className="text-muted-foreground text-center text-sm">Volume</div>
            <div className="text-foreground text-center text-xl">26K</div>
          </div>
          <div className="flex-none px-2">
            <div className="text-muted-foreground text-center text-sm">Growth</div>
            <div className="text-foreground text-center text-xl">+350%</div>
          </div>
          <div className="flex-none px-2">
            <div className="text-muted-foreground text-center text-sm">Competition</div>
            <div className="text-foreground text-center text-xl"><Badge variant="low">Low</Badge></div>
          </div>
        </div>
        </div>
        </div>
      </CardHeader>
      <CardContent>
          <Line options={options} data={data} />
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button>More +</Button>
      </CardFooter>
    </Card>
    </div>
    </div>
      {/* <div className="px-4 md:px-20 lg:px-32 space-y-4">
        {tools.map((tool) => (
          <Card onClick={() => router.push(tool.href)} key={tool.href} className="p-4 border-black/5 flex items-center justify-between hover:shadow-md transition cursor-pointer">
            <div className="flex items-center gap-x-4">
              <div className={cn("p-2 w-fit rounded-md", tool.bgColor)}>
                <tool.icon className={cn("w-8 h-8", tool.color)} />
              </div>
              <div className="font-semibold">
                {tool.label}
              </div>
            </div>
            <ArrowRight className="w-5 h-5" />
          </Card>
        ))}
      </div> */}
    </div>
  );
}
