"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, CheckCircle, AlertCircle, ClipboardList } from "lucide-react";

const barData = [
  { name: "Open", value: 42 },
  { name: "Closed", value: 68 },
  { name: "Total", value: 110 },
];

const pieData = [
  { name: "Open", value: 42 },
  { name: "Closed", value: 68 },
];

const COLORS = ["#ef4444", "#22c55e"]; // merah & hijau

export default function DashboardPage() {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Tagging Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Open Tagging</CardTitle>
            <AlertCircle className="text-red-500" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">42</p>
            <p className="text-sm text-muted-foreground">Tagging belum diselesaikan</p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Closed Tagging</CardTitle>
            <CheckCircle className="text-green-500" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">68</p>
            <p className="text-sm text-muted-foreground">Tagging sudah selesai</p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Total Tagging</CardTitle>
            <ClipboardList className="text-blue-500" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">110</p>
            <p className="text-sm text-muted-foreground">Total keseluruhan</p>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Chart Section */}
      <Tabs defaultValue="bar" className="w-full">
        <TabsList className="w-fit mb-4">
          <TabsTrigger value="bar">Bar Chart</TabsTrigger>
          <TabsTrigger value="pie">Pie Chart</TabsTrigger>
        </TabsList>

        {/* Bar Chart */}
        <TabsContent value="bar">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Statistik Tagging</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pie Chart */}
        <TabsContent value="pie">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Persentase Tagging</CardTitle>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={120}
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
