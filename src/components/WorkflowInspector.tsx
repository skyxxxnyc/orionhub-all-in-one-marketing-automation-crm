import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import type { WorkflowNode } from '@shared/types';
interface WorkflowInspectorProps {
  selectedNode: WorkflowNode | null;
  onUpdate: (nodeId: string, config: any) => void;
}
export function WorkflowInspector({ selectedNode, onUpdate }: WorkflowInspectorProps) {
  const { register, handleSubmit, reset, watch } = useForm();
  const formData = watch();
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
    switch (selectedNode.data.label) {
      case 'Send Welcome Email':
      case 'Send "We Miss You" Email':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" {...register('subject')} placeholder="Welcome to our newsletter!" />
            </div>
            <div>
              <Label htmlFor="body">Body</Label>
              <Textarea id="body" {...register('body')} placeholder="Hi {{contact.name}}," rows={6} />
              <p className="text-xs text-muted-foreground mt-1">Use merge tags like {{contact.name}}.</p>
            </div>
          </div>
        );
      case 'Wait 3 Days':
      case 'Wait 7 Days':
        return (
          <div>
            <Label htmlFor="duration">Duration (days)</Label>
            <Input id="duration" type="number" {...register('duration', { valueAsNumber: true })} />
          </div>
        );
      default:
        return <p className="text-muted-foreground">No configuration available for this node.</p>;
    }
  };
  return (
    <AnimatePresence>
      {selectedNode && (
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 350 }}
          exit={{ width: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="bg-background border-l overflow-hidden"
        >
          <div className="p-4 h-full flex flex-col">
            <SheetHeader className="mb-4">
              <SheetTitle>Edit: {selectedNode.data.label}</SheetTitle>
              <SheetDescription>Modify the settings for this node.</SheetDescription>
            </SheetHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="flex-grow flex flex-col justify-between">
              <div className="flex-grow overflow-y-auto pr-2">
                {renderForm()}
              </div>
              <Button type="submit" className="mt-4">Save Changes</Button>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}