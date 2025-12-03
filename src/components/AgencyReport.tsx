import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
const pieData = [
  { name: 'Innovate Inc.', value: 800 },
  { name: 'Solutions Co.', value: 1200 },
  { name: 'Other Client', value: 500 },
];
const COLORS = ['#F38020', '#667EEA', '#0F172A'];
export function AgencyReport() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Sub-account Usage</CardTitle>
          <CardDescription>Contact usage across your sub-accounts.</CardDescription>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value">
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total Revenue</CardTitle>
          <CardDescription>Your agency's total revenue from sub-accounts.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">$1,250 / mo</p>
          <p className="text-sm text-muted-foreground">+15% from last month</p>
        </CardContent>
      </Card>
    </div>
  );
}