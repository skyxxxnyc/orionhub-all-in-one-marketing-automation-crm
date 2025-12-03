import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Send, Trash2 } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { api } from '@/lib/api-client';
import type { Webhook } from '@shared/types';
const fetchWebhooks = async () => api<{ items: Webhook[] }>('/api/webhooks');
export function WebhookManager() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['webhooks'], queryFn: fetchWebhooks });
  const testMutation = useMutation({
    mutationFn: (id: string) => api(`/api/webhooks/${id}/test`, { method: 'POST' }),
    onSuccess: () => toast.success('Test event sent successfully.'),
    onError: () => toast.error('Failed to send test event.'),
  });
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Webhooks</CardTitle>
            <CardDescription>Manage integrations with external services.</CardDescription>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button><PlusCircle className="mr-2 h-4 w-4" /> Add Webhook</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Add New Webhook</SheetTitle>
              </SheetHeader>
              {/* Form for new webhook would go here */}
              <div className="py-4 space-y-4">
                <div>
                  <Label htmlFor="url">Webhook URL</Label>
                  <Input id="url" placeholder="https://api.example.com/webhook" />
                </div>
                <Button>Save Webhook</Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>URL</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={3} className="text-center">Loading...</TableCell></TableRow>
            ) : (
              data?.items.map(webhook => (
                <TableRow key={webhook.id}>
                  <TableCell className="font-mono">{webhook.url}</TableCell>
                  <TableCell>
                    <Badge variant={webhook.active ? 'default' : 'secondary'}>
                      {webhook.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => testMutation.mutate(webhook.id)}>
                      <Send className="mr-1 h-3 w-3" /> Test
                    </Button>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="mr-1 h-3 w-3" /> Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}