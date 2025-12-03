import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { api } from '@/lib/api-client';
import { useAuthStore } from '@/lib/mock-auth';
import type { Ticket } from '@shared/types';
const ticketSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters."),
  description: z.string().min(10, "Please provide a detailed description."),
  priority: z.enum(['low', 'medium', 'high']),
  type: z.enum(['bug', 'feature', 'other']),
});
const fetchTickets = async (orgId: string) => api<{ items: Ticket[] }>('/api/tickets', { query: { orgId } });
export function SupportTicketSystem() {
  const queryClient = useQueryClient();
  const currentOrg = useAuthStore(s => s.currentOrg);
  const [isDialogOpen, setDialogOpen] = React.useState(false);
  const { data, isLoading } = useQuery({
    queryKey: ['tickets', currentOrg?.id],
    queryFn: () => fetchTickets(currentOrg!.id),
    enabled: !!currentOrg,
  });
  const form = useForm<z.infer<typeof ticketSchema>>({
    resolver: zodResolver(ticketSchema),
    defaultValues: { priority: 'low', type: 'bug' },
  });
  const createTicketMutation = useMutation({
    mutationFn: (newTicket: Omit<Ticket, 'id' | 'status' | 'createdAt' | 'orgId'>) =>
      api('/api/tickets', {
        method: 'POST',
        body: JSON.stringify({ ...newTicket, orgId: currentOrg?.id }),
      }),
    onSuccess: () => {
      toast.success('Support ticket created!');
      queryClient.invalidateQueries({ queryKey: ['tickets', currentOrg?.id] });
      setDialogOpen(false);
      form.reset();
    },
    onError: () => toast.error('Failed to create ticket.'),
  });
  function onSubmit(values: z.infer<typeof ticketSchema>) {
    createTicketMutation.mutate(values);
  }
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Support Tickets</CardTitle>
            <CardDescription>Submit and track your support requests.</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>New Ticket</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a new support ticket</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField control={form.control} name="title" render={({ field }) => (
                    <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} rows={5} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="priority" render={({ field }) => (
                      <FormItem><FormLabel>Priority</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="low">Low</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="high">High</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="type" render={({ field }) => (
                      <FormItem><FormLabel>Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="bug">Bug Report</SelectItem><SelectItem value="feature">Feature Request</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                    )} />
                  </div>
                  <Button type="submit" disabled={createTicketMutation.isPending}>Submit Ticket</Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={3} className="text-center">Loading tickets...</TableCell></TableRow>
            ) : (
              data?.items.map(ticket => (
                <motion.tr key={ticket.id} whileHover={{ scale: 1.02 }} className="cursor-pointer">
                  <TableCell>{ticket.title}</TableCell>
                  <TableCell><Badge variant={ticket.status === 'open' ? 'default' : 'secondary'} className="capitalize">{ticket.status}</Badge></TableCell>
                  <TableCell><Badge variant="outline" className="capitalize">{ticket.priority}</Badge></TableCell>
                </motion.tr>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}