import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Import, Workflow, Users } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
const chartData = [
  { name: 'Jan', contacts: 400 },
  { name: 'Feb', contacts: 300 },
  { name: 'Mar', contacts: 600 },
  { name: 'Apr', contacts: 800 },
  { name: 'May', contacts: 700 },
  { name: 'Jun', contacts: 900 },
];
export function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's a snapshot of your business.</p>
          </div>
          <div className="flex gap-2">
            <Button><PlusCircle className="mr-2 h-4 w-4" /> Add Contact</Button>
            <Button variant="outline"><Import className="mr-2 h-4 w-4" /> Import CSV</Button>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle>New Contacts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">1,204</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Pipeline Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">$45,231</div>
              <p className="text-xs text-muted-foreground">+12.5% from last week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Open Conversations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">89</div>
              <p className="text-xs text-muted-foreground">3 require attention</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Conversion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">24.5%</div>
              <p className="text-xs text-muted-foreground">+2.1% from last month</p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-6 mt-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Contact Growth</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] w-full">
              <ResponsiveContainer>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorContacts" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F38020" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#F38020" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
                  <Area type="monotone" dataKey="contacts" stroke="#F38020" fillOpacity={1} fill="url(#colorContacts)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Button variant="outline" className="justify-start"><Workflow className="mr-2 h-4 w-4" /> Create Automation</Button>
              <Button variant="outline" className="justify-start"><Users className="mr-2 h-4 w-4" /> Create Pipeline</Button>
              <Button variant="outline" className="justify-start"><PlusCircle className="mr-2 h-4 w-4" /> Send Email Campaign</Button>
              <Button variant="outline" className="justify-start"><PlusCircle className="mr-2 h-4 w-4" /> Schedule Appointment</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}