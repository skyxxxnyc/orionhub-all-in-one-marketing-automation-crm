import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts';
import type { Campaign } from '@shared/types';
interface AnalyticsCardProps {
  data: Campaign['analytics'];
  type: 'email' | 'sms';
}
export function AnalyticsCard({ data, type }: AnalyticsCardProps) {
  const title = type === 'email' ? 'Email Performance' : 'SMS Performance';
  const openRate = data.sends > 0 ? ((data.opens / data.deliveries) * 100).toFixed(1) : 0;
  const clickRate = data.opens > 0 ? ((data.clicks / data.opens) * 100).toFixed(1) : 0;
  const deliveryRate = data.sends > 0 ? ((data.deliveries / data.sends) * 100).toFixed(1) : 0;
  const chartData = type === 'email'
    ? [{ name: 'Sends', value: data.sends }, { name: 'Opens', value: data.opens }, { name: 'Clicks', value: data.clicks }]
    : [{ name: 'Sends', value: data.sends }, { name: 'Deliveries', value: data.deliveries }];
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {type === 'email' ? `${openRate}% open rate, ${clickRate}% click rate` : `${deliveryRate}% delivery rate`}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-24">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
            <Bar dataKey="value" fill="#F38020" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}