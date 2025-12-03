import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { WorkflowNode } from '@shared/types';
import { useAuthStore } from '@/lib/mock-auth';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
import { MOCK_CONTACTS } from '@shared/mock-data';
interface WorkflowInspectorProps {
  selectedNode: WorkflowNode | null;
  onUpdate: (nodeId: string, config: any) => void;
}
export function WorkflowInspector({ selectedNode, onUpdate }: WorkflowInspectorProps) {
  const { register, handleSubmit, reset, watch } = useForm();
  const currentOrg = useAuthStore(s => s.currentOrg);
  const testSendMutation = useMutation({
    mutationFn: (data: any) => api('/api/gmail/send', {
      method: 'POST',
      body: JSON.stringify({ to: 'test@example.com', subject: 'Test from Workflow', body: 'This is a test.' }),
      headers: { 'PICA_SECRET_KEY': 'mock-secret' }
    }),
    onSuccess: () => toast.success('Test email sent!'),
    onError: () => toast.error('Failed to send test email.'),
  });
  const quickAddMutation = useMutation({
    mutationFn: (text: string) => api('/api/calendar/quickAdd', {
      method: 'POST',
      body: JSON.stringify({ text }),
      headers: { 'PICA_SECRET_KEY': 'mock-secret' }
    }),
    onSuccess: () => toast.success('Test event added!'),
    onError: () => toast.error('Failed to add test event.'),
  });
  const testResearchMutation = useMutation({
    mutationFn: (prompt: string) => api('/api/perplexity/completions', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
      headers: { 'PICA_SECRET_KEY': 'mock-secret' }
    }),
    onSuccess: (data: any) => toast.info(`Research result: ${data.choices[0].message.content}`),
    onError: () => toast.error('Failed to test research.'),
  });
  useEffect(() => {
    if (selectedNode) {
      reset(selectedNode.data.config || {});
    }
  }, [selectedNode, reset]);
  const onSubmit = (data: any) => {
    if (selectedNode) {
      onUpdate(selectedNode.id, data);
    }
  };
  const renderForm = () => {
    if (!selectedNode) return null;
    const MotionDiv = motion.div;
    switch (selectedNode.data.label) {
      case 'Send Email':
        return (
          <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div>
              <Label htmlFor="templateId">Email Template</Label>
              <Select {...register('templateId')}>
                <SelectTrigger><SelectValue placeholder="Select a template" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="et-1">Welcome Email</SelectItem>
                  <SelectItem value="et-2">Follow-up</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </MotionDiv>
        );
      case 'Wait':
        return (
          <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Label htmlFor="duration">Duration (days)</Label>
            <Input id="duration" type="number" {...register('duration', { valueAsNumber: true })} />
          </MotionDiv>
        );
      case 'If/Else':
        return (
          <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <Label>Condition</Label>
            <div className="flex items-center gap-2">
              <Select {...register('field')}>
                <SelectTrigger><SelectValue placeholder="Field" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="tag">Tag</SelectItem>
                  <SelectItem value="dealStage">Deal Stage</SelectItem>
                </SelectContent>
              </Select>
              <Select {...register('operator')}>
                <SelectTrigger><SelectValue placeholder="Operator" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="contains">Contains</SelectItem>
                  <SelectItem value="not_contains">Does not contain</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Input {...register('value')} placeholder="Value (e.g., 'hot-lead')" />
          </MotionDiv>
        );
      case 'Send Gmail Sequence':
        return (
          <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div>
              <Label>Template</Label>
              <Select {...register('templateId')}><SelectTrigger><SelectValue placeholder="Select Gmail template" /></SelectTrigger><SelectContent><SelectItem value="gmail-1">Gmail Welcome</SelectItem></SelectContent></Select>
            </div>
            <Button type="button" variant="outline" onClick={() => testSendMutation.mutate({})}>Test Send</Button>
          </MotionDiv>
        );
      case 'Schedule Calendar Event':
        return (
          <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <Label>Event Description</Label>
            <Input {...register('naturalLanguage')} placeholder="Meeting tomorrow at 2pm" />
            <Button type="button" variant="outline" onClick={() => quickAddMutation.mutate(watch('naturalLanguage'))}>Parse & Add</Button>
          </MotionDiv>
        );
      case 'Research Prospect':
        return (
          <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <Label>Contact</Label>
            <Select {...register('contactId')}><SelectTrigger><SelectValue placeholder="Select a contact" /></SelectTrigger><SelectContent>{MOCK_CONTACTS.slice(0, 10).map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select>
            <Label>Research Prompt</Label>
            <Textarea {...register('prompt')} placeholder="e.g., Find recent news about {{contact.company}}" />
            <Button type="button" variant="outline" onClick={() => testResearchMutation.mutate(watch('prompt'))}>Test Research</Button>
          </MotionDiv>
        );
      default:
        return <p className="text-muted-foreground">No configuration available for this node.</p>;
    }
  };
  return (
    <AnimatePresence>
      {selectedNode && (
        <motion.div
          key={selectedNode.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="p-4 h-full flex flex-col"
        >
          <SheetHeader className="mb-4">
            <SheetTitle>Edit: {selectedNode.data.label}</SheetTitle>
            <SheetDescription>Modify the settings for this node.</SheetDescription>
          </SheetHeader>
          <form onChange={handleSubmit(onSubmit)} className="flex-grow flex flex-col justify-between">
            <div className="flex-grow overflow-y-auto pr-2">
              {renderForm()}
            </div>
            <Button type="button" onClick={handleSubmit(onSubmit)} className="mt-4">Save Changes</Button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}