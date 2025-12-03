import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
import { useAuthStore } from '@/lib/mock-auth';
import { motion } from 'framer-motion';
export function IntegrationSettings() {
  const currentOrg = useAuthStore(s => s.currentOrg);
  const [gmailKey, setGmailKey] = useState('');
  const [perplexityKey, setPerplexityKey] = useState('');
  const [quickAddText, setQuickAddText] = useState('');
  useEffect(() => {
    if (currentOrg) {
      setGmailKey(localStorage.getItem(`gmail_key_${currentOrg.id}`) || '');
      setPerplexityKey(localStorage.getItem(`perplexity_key_${currentOrg.id}`) || '');
    }
  }, [currentOrg]);
  const testGmailMutation = useMutation({
    mutationFn: () => api('/api/gmail/send', {
      method: 'POST',
      body: JSON.stringify({ to: 'test@example.com', subject: 'Gmail Connection Test', body: 'This is a test email from OrionHub.' }),
      headers: { 'PICA_SECRET_KEY': 'mock-secret' }
    }),
    onSuccess: () => toast.success('Test email sent successfully!'),
    onError: () => toast.error('Failed to send test email.'),
  });
  const quickAddMutation = useMutation({
    mutationFn: (text: string) => api('/api/calendar/quickAdd', {
      method: 'POST',
      body: JSON.stringify({ text }),
      headers: { 'PICA_SECRET_KEY': 'mock-secret' }
    }),
    onSuccess: () => {
      toast.success('Event added to calendar!');
      setQuickAddText('');
    },
    onError: () => toast.error('Failed to add event.'),
  });
  const testPerplexityMutation = useMutation({
    mutationFn: () => api('/api/perplexity/completions', {
      method: 'POST',
      body: JSON.stringify({ model: 'sonar', prompt: 'Test prompt for prospect research.' }),
      headers: { 'PICA_SECRET_KEY': 'mock-secret' }
    }),
    onSuccess: (data: any) => toast.success(`Test successful: ${data.choices[0].message.content}`),
    onError: () => toast.error('Perplexity API test failed.'),
  });
  const handleSaveKey = (keyName: string, value: string) => {
    if (currentOrg) {
      localStorage.setItem(`${keyName}_${currentOrg.id}`, value);
      if (keyName === 'gmail_key') setGmailKey(value);
      if (keyName === 'perplexity_key') setPerplexityKey(value);
      toast.success(`${keyName.split('_')[0].toUpperCase()} key saved.`);
    }
  };
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <Accordion type="multiple" defaultValue={['gmail', 'gcal']} className="w-full space-y-4">
        <AccordionItem value="gmail">
          <AccordionTrigger className="text-lg font-semibold">Gmail</AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardHeader>
                <CardTitle>Gmail Integration</CardTitle>
                <CardDescription>Connect your Gmail account to send emails directly from OrionHub.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  {gmailKey ? <Badge>Connected</Badge> : <Badge variant="secondary">Disconnected</Badge>}
                  <Button variant="outline">Connect with Google (mock)</Button>
                </div>
                <div>
                  <Label htmlFor="gmail-key">PICA Gmail Connection Key</Label>
                  <Input id="gmail-key" placeholder="Enter secret key" value={gmailKey} onChange={e => handleSaveKey('gmail_key', e.target.value)} />
                </div>
                <Button onClick={() => testGmailMutation.mutate()} disabled={!gmailKey || testGmailMutation.isPending}>Test Send</Button>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="gcal">
          <AccordionTrigger className="text-lg font-semibold">Google Calendar</AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardHeader>
                <CardTitle>Google Calendar Integration</CardTitle>
                <CardDescription>Sync appointments and create events using natural language.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge>Connected</Badge>
                  <Button variant="outline">Sync Settings</Button>
                </div>
                <div>
                  <Label htmlFor="quick-add">Quick Add Event</Label>
                  <div className="flex gap-2">
                    <Input id="quick-add" placeholder="e.g., Meeting with John tomorrow at 2pm" value={quickAddText} onChange={e => setQuickAddText(e.target.value)} />
                    <Button onClick={() => quickAddMutation.mutate(quickAddText)} disabled={!quickAddText || quickAddMutation.isPending}>Add</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="perplexity">
          <AccordionTrigger className="text-lg font-semibold">Perplexity AI</AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardHeader>
                <CardTitle>Perplexity AI Integration</CardTitle>
                <CardDescription>Enrich contact data and perform research with AI.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  {perplexityKey ? <Badge>Connected</Badge> : <Badge variant="secondary">Disconnected</Badge>}
                </div>
                <div>
                  <Label htmlFor="perplexity-key">Perplexity API Key</Label>
                  <Input id="perplexity-key" type="password" placeholder="Enter API key" value={perplexityKey} onChange={e => handleSaveKey('perplexity_key', e.target.value)} />
                </div>
                <Button onClick={() => testPerplexityMutation.mutate()} disabled={!perplexityKey || testPerplexityMutation.isPending}>Test Completion</Button>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </motion.div>
  );
}