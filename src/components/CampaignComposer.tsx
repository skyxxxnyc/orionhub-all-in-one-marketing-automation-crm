import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { api } from '@/lib/api-client';
import type { EmailTemplate, SMSTemplate, Campaign } from '@shared/types';
const campaignSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  type: z.enum(['email', 'sms']),
  templateId: z.string().min(1, 'Template is required'),
  scheduledAt: z.date().optional(),
});
const fetchEmailTemplates = async () => api<{ items: EmailTemplate[] }>('/api/templates/email');
const fetchSmsTemplates = async () => api<{ items: SMSTemplate[] }>('/api/templates/sms');
interface CampaignComposerProps {
  onSuccess: () => void;
}
export function CampaignComposer({ onSuccess }: CampaignComposerProps) {
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof campaignSchema>>({
    resolver: zodResolver(campaignSchema),
    defaultValues: { name: '', type: 'email' },
  });
  const campaignType = form.watch('type');
  const { data: emailTemplates } = useQuery({ queryKey: ['emailTemplates'], queryFn: fetchEmailTemplates });
  const { data: smsTemplates } = useQuery({ queryKey: ['smsTemplates'], queryFn: fetchSmsTemplates });
  const createCampaignMutation = useMutation({
    mutationFn: (data: Partial<Campaign>) => api('/api/campaigns', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
      toast.success('Campaign created successfully!');
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      onSuccess();
    },
    onError: () => toast.error('Failed to create campaign.'),
  });
  function onSubmit(values: z.infer<typeof campaignSchema>) {
    createCampaignMutation.mutate({
      ...values,
      scheduledAt: values.scheduledAt?.getTime(),
    });
  }
  const templates = campaignType === 'email' ? emailTemplates?.items : smsTemplates?.items;
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem>
            <FormLabel>Campaign Name</FormLabel>
            <FormControl><Input placeholder="e.g., Q4 Newsletter" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="type" render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Type</FormLabel>
            <FormControl>
              <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="email" /></FormControl><FormLabel>Email</FormLabel></FormItem>
                <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="sms" /></FormControl><FormLabel>SMS</FormLabel></FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="templateId" render={({ field }) => (
          <FormItem>
            <FormLabel>Template</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl><SelectTrigger><SelectValue placeholder="Select a template" /></SelectTrigger></FormControl>
              <SelectContent>
                {templates?.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="scheduledAt" render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Schedule (Optional)</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button variant="outline" className={cn('w-[240px] pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>
                    {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )} />
        <Button type="submit" disabled={createCampaignMutation.isPending}>
          {createCampaignMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Campaign
        </Button>
      </form>
    </Form>
  );
}