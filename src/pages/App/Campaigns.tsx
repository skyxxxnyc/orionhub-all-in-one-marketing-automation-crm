import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { PlusCircle, Mail, MessageSquare, Send, BarChart3 } from 'lucide-react';
import { api } from '@/lib/api-client';
import type { Campaign } from '@shared/types';
import { CampaignComposer } from '@/components/CampaignComposer';
import { AnalyticsCard } from '@/components/AnalyticsCard';
import { motion } from 'framer-motion';
const fetchCampaigns = async () => api<{ items: Campaign[] }>('/api/campaigns');
export function Campaigns() {
  const [isComposerOpen, setComposerOpen] = useState(false);
  const { data, isLoading } = useQuery({ queryKey: ['campaigns'], queryFn: fetchCampaigns });
  const campaigns = useMemo(() => data?.items ?? [], [data]);
  const renderTable = (list: Campaign[]) => (
    <div className="border-4 border-black bg-white shadow-brutalist overflow-hidden">
      <Table>
        <TableHeader className="bg-black">
          <TableRow className="hover:bg-black border-b-4 border-black">
            <TableHead className="text-white font-black uppercase tracking-widest">Campaign Name</TableHead>
            <TableHead className="text-white font-black uppercase tracking-widest">Status</TableHead>
            <TableHead className="text-white font-black uppercase tracking-widest">Scheduled</TableHead>
            <TableHead className="text-white font-black uppercase tracking-widest">Engagement</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i} className="border-b-2 border-black"><TableCell colSpan={4}><Skeleton className="h-10 w-full" /></TableCell></TableRow>
            ))
          ) : list.length > 0 ? (
            list.map((c) => (
              <TableRow key={c.id} className="hover:bg-orange-50 border-b-2 border-black">
                <TableCell className="font-black uppercase text-sm">{c.name}</TableCell>
                <TableCell>
                  <Badge className="bg-white text-black border-2 border-black uppercase text-[10px] font-black">
                    {c.status}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-xs uppercase">
                  {c.scheduledAt ? format(new Date(c.scheduledAt), 'MMM dd, HH:mm') : 'DRAFT'}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-4 font-mono text-[10px] font-black">
                    <span className="text-orange-500">S: {c.analytics.sends}</span>
                    <span className="text-blue-500">O: {c.analytics.opens}</span>
                    <span className="text-green-500">C: {c.analytics.clicks}</span>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow><TableCell colSpan={4} className="h-32 text-center font-black uppercase text-muted-foreground">No campaigns found.</TableCell></TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="editorial-heading">Campaigns</h1>
            <p className="text-xl font-mono mt-2 uppercase font-bold text-muted-foreground">Outbound Marketing & Broadcasts.</p>
          </div>
          <Sheet open={isComposerOpen} onOpenChange={setComposerOpen}>
            <SheetTrigger asChild>
              <Button className="brutalist-button bg-orange-500 text-white"><PlusCircle className="mr-2 h-4 w-4" /> NEW CAMPAIGN</Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-2xl border-l-4 border-black">
              <SheetHeader><SheetTitle className="text-3xl font-black uppercase">Create Campaign</SheetTitle></SheetHeader>
              <CampaignComposer onSuccess={() => setComposerOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
          <AnalyticsCard data={{ sends: 1700, deliveries: 1680, opens: 570, clicks: 95 }} type="email" />
          <div className="brutalist-card bg-black text-white flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="font-black uppercase text-xs tracking-widest">Total Reach</span>
              <BarChart3 className="h-5 w-5 text-orange-500" />
            </div>
            <div className="mt-4">
              <span className="text-4xl font-black">2.4K</span>
              <p className="text-[10px] font-mono uppercase mt-1 opacity-60">Unique recipients this month</p>
            </div>
          </div>
        </div>
        <Tabs defaultValue="email" className="w-full">
          <TabsList className="mb-8 border-4 border-black bg-muted p-1 rounded-none w-fit">
            <TabsTrigger value="email" className="font-black uppercase text-xs px-8 py-3 data-[state=active]:bg-black data-[state=active]:text-white rounded-none flex items-center gap-2">
              <Mail className="h-4 w-4" /> EMAIL
            </TabsTrigger>
            <TabsTrigger value="sms" className="font-black uppercase text-xs px-8 py-3 data-[state=active]:bg-black data-[state=active]:text-white rounded-none flex items-center gap-2">
              <MessageSquare className="h-4 w-4" /> SMS
            </TabsTrigger>
          </TabsList>
          <TabsContent value="email" className="mt-0">
            {renderTable(campaigns.filter(c => c.type === 'email'))}
          </TabsContent>
          <TabsContent value="sms" className="mt-0">
            {renderTable(campaigns.filter(c => c.type === 'sms'))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}