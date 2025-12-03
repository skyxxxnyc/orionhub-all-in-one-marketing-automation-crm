import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { PlusCircle, Mail, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api-client';
import type { Campaign } from '@shared/types';
import { CampaignComposer } from '@/components/CampaignComposer';
import { AnalyticsCard } from '@/components/AnalyticsCard';
const fetchCampaigns = async () => api<{ items: Campaign[] }>('/api/campaigns');
export function Campaigns() {
  const [isComposerOpen, setComposerOpen] = useState(false);
  const { data, isLoading } = useQuery({
    queryKey: ['campaigns'],
    queryFn: fetchCampaigns,
  });
  const campaigns = useMemo(() => data?.items ?? [], [data]);
  const emailCampaigns = useMemo(() => campaigns.filter(c => c.type === 'email'), [campaigns]);
  const smsCampaigns = useMemo(() => campaigns.filter(c => c.type === 'sms'), [campaigns]);
  const getStatusVariant = (status: Campaign['status']) => {
    switch (status) {
      case 'sent': return 'default';
      case 'scheduled': return 'outline';
      case 'draft': return 'secondary';
      default: return 'secondary';
    }
  };
  const renderTable = (campaigns: Campaign[]) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Scheduled At</TableHead>
          <TableHead>Performance</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell><Skeleton className="h-4 w-48" /></TableCell>
              <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
              <TableCell><Skeleton className="h-4 w-32" /></TableCell>
              <TableCell><Skeleton className="h-4 w-24" /></TableCell>
            </TableRow>
          ))
        ) : campaigns.length > 0 ? (
          campaigns.map((campaign) => (
            <TableRow key={campaign.id}>
              <TableCell className="font-medium">{campaign.name}</TableCell>
              <TableCell><Badge variant={getStatusVariant(campaign.status)} className="capitalize">{campaign.status}</Badge></TableCell>
              <TableCell>{campaign.scheduledAt ? format(new Date(campaign.scheduledAt), 'PPp') : 'Not scheduled'}</TableCell>
              <TableCell>{campaign.analytics.sends} sends</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={4} className="h-24 text-center">No campaigns found.</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Campaigns</h1>
            <p className="text-muted-foreground">Manage your email and SMS marketing campaigns.</p>
          </div>
          <Sheet open={isComposerOpen} onOpenChange={setComposerOpen}>
            <SheetTrigger asChild>
              <Button><PlusCircle className="mr-2 h-4 w-4" /> New Campaign</Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-2xl">
              <SheetHeader>
                <SheetTitle>Create New Campaign</SheetTitle>
              </SheetHeader>
              <CampaignComposer onSuccess={() => setComposerOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <AnalyticsCard data={{ sends: 1700, deliveries: 1680, opens: 570, clicks: 95 }} type="email" />
          <AnalyticsCard data={{ sends: 500, deliveries: 480, opens: 0, clicks: 0 }} type="sms" />
        </div>
        <Card>
          <CardContent className="p-0">
            <Tabs defaultValue="email">
              <TabsList className="p-2">
                <TabsTrigger value="email"><Mail className="mr-2 h-4 w-4" /> Email Campaigns</TabsTrigger>
                <TabsTrigger value="sms"><MessageSquare className="mr-2 h-4 w-4" /> SMS Campaigns</TabsTrigger>
              </TabsList>
              <TabsContent value="email" className="p-4">
                {renderTable(emailCampaigns)}
              </TabsContent>
              <TabsContent value="sms" className="p-4">
                {renderTable(smsCampaigns)}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}