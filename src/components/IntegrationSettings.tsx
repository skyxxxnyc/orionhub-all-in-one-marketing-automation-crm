import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api-client';
import type { Integration } from '@shared/types';
import { toast } from 'sonner';
const fetchIntegrations = async () => api<{ items: Integration[] }>('/api/integrations');
export function IntegrationSettings() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['integrations'],
    queryFn: fetchIntegrations,
  });
  const connectMutation = useMutation({
    mutationFn: (type: 'google' | 'outlook') => api('/api/integrations/connect', {
      method: 'POST',
      body: JSON.stringify({ type })
    }),
    onSuccess: () => {
      toast.success('Integration connected successfully!');
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
    },
    onError: () => {
      toast.error('Failed to connect integration.');
    }
  });
  const integrations = data?.items || [];
  const googleIntegration = integrations.find(i => i.type === 'google');
  const outlookIntegration = integrations.find(i => i.type === 'outlook');
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Google Calendar</CardTitle>
          <CardDescription>Sync your appointments with Google Calendar.</CardDescription>
        </CardHeader>
        <CardContent>
          {googleIntegration?.status === 'connected' ? (
            <div className="flex items-center justify-between">
              <Badge>Connected</Badge>
              <Button variant="destructive">Disconnect</Button>
            </div>
          ) : (
            <Button onClick={() => connectMutation.mutate('google')} disabled={connectMutation.isPending}>
              Connect Google Calendar
            </Button>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Outlook Calendar</CardTitle>
          <CardDescription>Sync your appointments with Outlook Calendar.</CardDescription>
        </CardHeader>
        <CardContent>
          {outlookIntegration?.status === 'connected' ? (
            <div className="flex items-center justify-between">
              <Badge>Connected</Badge>
              <Button variant="destructive">Disconnect</Button>
            </div>
          ) : (
            <Button onClick={() => connectMutation.mutate('outlook')} disabled={connectMutation.isPending}>
              Connect Outlook Calendar
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}