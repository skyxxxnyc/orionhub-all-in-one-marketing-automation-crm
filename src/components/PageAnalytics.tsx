import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
const data = [
  { name: 'Day 1', views: 120, conversions: 12 },
  { name: 'Day 2', views: 150, conversions: 18 },
  { name: 'Day 3', views: 130, conversions: 15 },
  { name: 'Day 4', views: 180, conversions: 25 },
  { name: 'Day 5', views: 210, conversions: 30 },
];
export function PageAnalytics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Page Analytics</CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="views" stroke="#F38020" />
            <Line type="monotone" dataKey="conversions" stroke="#667EEA" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}