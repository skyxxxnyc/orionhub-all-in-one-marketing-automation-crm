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
interface WorkflowInspectorProps {
  selectedNode: WorkflowNode | null;
  onUpdate: (nodeId: string, config: any) => void;
}
export function WorkflowInspector({ selectedNode, onUpdate }: WorkflowInspectorProps) {
  const { register, handleSubmit, reset, watch } = useForm();
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
      case 'Send Email':
        return (
          <div className="space-y-4">
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
          </div>
        );
      case 'Wait':
        return (
          <div>
            <Label htmlFor="duration">Duration (days)</Label>
            <Input id="duration" type="number" {...register('duration', { valueAsNumber: true })} />
          </div>
        );
      case 'If/Else':
        return (
          <div className="space-y-4">
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
            <form onChange={handleSubmit(onSubmit)} className="flex-grow flex flex-col justify-between">
              <div className="flex-grow overflow-y-auto pr-2">
                {renderForm()}
              </div>
              <Button type="button" onClick={handleSubmit(onSubmit)} className="mt-4">Save Changes</Button>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}