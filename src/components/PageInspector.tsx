import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import type { PageElement } from '@shared/types';
import type { Node } from 'reactflow';
interface PageInspectorProps {
  selectedNode: Node<PageElement> | null;
  onUpdate: (nodeId: string, data: Partial<PageElement>) => void;
}
export function PageInspector({ selectedNode, onUpdate }: PageInspectorProps) {
  const { register, handleSubmit, reset, watch } = useForm();
  const formData = watch();
  useEffect(() => {
    if (selectedNode) {
      reset(selectedNode.data || {});
    }
  }, [selectedNode, reset]);
  const onSubmit = (data: any) => {
    if (selectedNode) {
      onUpdate(selectedNode.id, data);
    }
  };
  const renderForm = () => {
    if (!selectedNode) return null;
    switch (selectedNode.data.type) {
      case 'text':
        return (
          <div>
            <Label htmlFor="content">Text Content</Label>
            <Textarea id="content" {...register('content')} rows={4} />
          </div>
        );
      case 'image':
        return (
          <div>
            <Label htmlFor="content">Image URL</Label>
            <Input id="content" {...register('content')} placeholder="https://..." />
            {formData.content && <img src={formData.content} alt="preview" className="mt-2 rounded-md" />}
          </div>
        );
      case 'button':
        return (
          <div>
            <Label htmlFor="content">Button Text</Label>
            <Input id="content" {...register('content')} />
          </div>
        );
      default:
        return <p className="text-muted-foreground">No configuration available.</p>;
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
              <SheetTitle>Edit: {selectedNode.data.type}</SheetTitle>
              <SheetDescription>Modify the element's settings.</SheetDescription>
            </SheetHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="flex-grow flex flex-col justify-between">
              <div className="flex-grow overflow-y-auto pr-2 space-y-4">
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