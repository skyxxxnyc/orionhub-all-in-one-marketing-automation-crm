import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuthStore } from '@/lib/mock-auth';
import { api } from '@/lib/api-client';
import type { Billing } from '@shared/types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
export function BillingPanel() {
  const currentOrg = useAuthStore((state) => state.currentOrg);
  const { data: billing, isLoading } = useQuery({
    queryKey: ['billing', currentOrg?.id],
    queryFn: () => api<Billing>(`/api/billing/${currentOrg!.id}`),
    enabled: !!currentOrg,
  });
  const planLimits = {
    free: { contacts: 100, campaigns: 5 },
    pro: { contacts: 2000, campaigns: 50 },
    enterprise: { contacts: 10000, campaigns: 200 },
  };
  const chartData = [
    { name: 'Contacts', used: billing?.usage.contacts || 0, limit: planLimits[billing?.plan || 'free'].contacts },
    { name: 'Campaigns', used: billing?.usage.campaigns || 0, limit: planLimits[billing?.plan || 'free'].campaigns },
  ];
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>
                You are on the <span className="font-semibold capitalize">{billing?.plan}</span> plan.
              </CardDescription>
            </div>
            <Button>Upgrade Plan</Button>
          </div>
        </CardHeader>
        <CardContent>
          {billing && (
            <p className="text-sm text-muted-foreground">
              Next invoice on {format(new Date(billing.nextInvoice), 'PP')}.
            </p>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Usage</CardTitle>
          <CardDescription>Your current usage for this billing period.</CardDescription>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="used" fill="#F38020" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}