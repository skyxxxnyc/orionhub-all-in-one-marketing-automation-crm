import React from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
const contactGrowthData = [
  { name: 'Jan', contacts: 400 }, { name: 'Feb', contacts: 300 }, { name: 'Mar', contacts: 600 },
  { name: 'Apr', contacts: 800 }, { name: 'May', contacts: 700 }, { name: 'Jun', contacts: 900 },
];
const leadSourceData = [
  { name: 'Website', value: 400 }, { name: 'Referral', value: 300 },
  { name: 'LinkedIn', value: 300 }, { name: 'Webinar', value: 200 },
];
const COLORS = ['#F38020', '#667EEA', '#0F172A', '#8884d8'];
export function AdvancedReporting() {
  return (
    <ResizablePanelGroup direction="vertical" className="min-h-[800px]">
      <ResizablePanel defaultSize={50}>
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={65}>
            <Card className="h-full">
              <CardHeader><CardTitle>Contact Growth</CardTitle></CardHeader>
              <CardContent className="h-[calc(100%-4rem)]">
                <ResponsiveContainer>
                  <AreaChart data={contactGrowthData}>
                    <defs>
                      <linearGradient id="colorContactsAdv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F38020" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#F38020" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="contacts" stroke="#F38020" fill="url(#colorContactsAdv)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={35}>
            <Card className="h-full">
              <CardHeader><CardTitle>Lead Sources</CardTitle></CardHeader>
              <CardContent className="h-[calc(100%-4rem)]">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={leadSourceData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                      {leadSourceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50}>
        {/* Another row of reports can go here */}
        <Card className="h-full">
            <CardHeader><CardTitle>Pipeline Velocity</CardTitle></CardHeader>
            <CardContent>
                <p>More reports coming soon...</p>
            </CardContent>
        </Card>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}