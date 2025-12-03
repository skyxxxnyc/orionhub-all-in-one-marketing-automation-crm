import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
const completionData = [
  { name: 'Jan', rate: 85 }, { name: 'Feb', rate: 92 }, { name: 'Mar', rate: 90 },
  { name: 'Apr', rate: 95 }, { name: 'May', rate: 91 }, { name: 'Jun', rate: 94 },
];
const dropoffData = [
  { name: 'Welcome Email', dropoffs: 5 },
  { name: 'Wait 3 Days', dropoffs: 2 },
  { name: 'Follow-up SMS', dropoffs: 8 },
];
export function WorkflowAnalytics() {
  return (
    <div className="p-4 grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Completion Rate Over Time</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={completionData}>
              <XAxis dataKey="name" />
              <YAxis unit="%" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="rate" stroke="#F38020" name="Completion Rate" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Node Drop-offs</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dropoffData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="dropoffs" fill="#667EEA" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}