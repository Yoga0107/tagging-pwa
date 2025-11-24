"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Dummy KPI Cards
const kpi = [
  { title: "Total Open Tagging", value: 42 },
  { title: "Total Closed Tagging", value: 19 },
  { title: "High Priority", value: 10 },
  { title: "Waiting for PIC", value: 7 },
];

// Dummy Chart Data
const priorityData = [
  { name: "High", value: 10 },
  { name: "Medium", value: 14 },
  { name: "Low", value: 7 },
];

const barData = [
  { area: "Boiler", open: 6, close: 3 },
  { area: "Packing", open: 4, close: 5 },
  { area: "Chiller", open: 5, close: 2 },
];

const trendData = [
  { day: "Mon", total: 3 },
  { day: "Tue", total: 5 },
  { day: "Wed", total: 4 },
  { day: "Thu", total: 6 },
  { day: "Fri", total: 2 },
];

const COLORS = ["#ef4444", "#f59e0b", "#22c55e"];

export default function Dashboard() {
  return (
    <div className="p-6 space-y-10">

      {/* TITLE */}
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {kpi.map((item, i) => (
          <Card key={i} className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* CHARTS TITLE */}
      <h2 className="text-2xl font-semibold mt-8">Charts Overview</h2>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* PIE CHART */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Tag Priority</CardTitle>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  label
                >
                  {priorityData.map((entry, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* BAR CHART */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Open vs Close by Area</CardTitle>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="area" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="open" />
                <Bar dataKey="close" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* LINE CHART */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Daily Tag Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line dataKey="total" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
