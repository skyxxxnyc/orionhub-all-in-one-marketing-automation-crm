import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuthStore } from '@/lib/mock-auth';
import { api } from '@/lib/api-client';
import type { Billing } from '@shared/types';
import { format } from 'date-fns';
import { toast } from 'sonner';
export function StripeBilling() {
  const currentOrg = useAuthStore((state) => state.currentOrg);
  const { data: billing, isLoading } from useQuery({
    queryKey: ['billing', currentOrg?.id],
    queryFn: () => api<Billing>(`/api/billing/${currentOrg!.id}`),
    enabled: !!currentOrg,
  });
  const handleUpgrade = async () => {
    if (!currentOrg) return;
    try {
      const { url } = await api<{ url: string }>(`/api/billing/${currentOrg.id}/upgrade`, {
        method: 'POST',
        body: JSON.stringify({ plan: 'pro' }),
      });
      toast.info('Redirecting to Stripe...');
      window.open(url, '_blank');
    } catch (error) {
      toast.error('Failed to initiate upgrade.');
    }
  };
  const planLimits = {
    free: { contacts: 100, campaigns: 5 },
    pro: { contacts: 2000, campaigns: 50 },
    enterprise: { contacts: 10000, campaigns: 200 },
  };
  const contactUsage = billing ? (billing.usage.contacts / planLimits[billing.plan].contacts) * 100 : 0;
  const campaignUsage = billing ? (billing.usage.campaigns / planLimits[billing.plan].campaigns) * 100 : 0;
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
            <Button onClick={handleUpgrade}>Upgrade Plan</Button>
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
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm">Contacts</span>
              <span className="text-sm text-muted-foreground">{billing?.usage.contacts} / {planLimits[billing?.plan || 'free'].contacts}</span>
            </div>
            <Progress value={contactUsage} />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm">Campaigns</span>
              <span className="text-sm text-muted-foreground">{billing?.usage.campaigns} / {planLimits[billing?.plan || 'free'].campaigns}</span>
            </div>
            <Progress value={campaignUsage} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Invoice History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>{format(new Date(), 'PP')}</TableCell>
                <TableCell>$99.00</TableCell>
                <TableCell><Badge>Paid</Badge></TableCell>
                <TableCell><Button variant="outline" size="sm">Download</Button></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}