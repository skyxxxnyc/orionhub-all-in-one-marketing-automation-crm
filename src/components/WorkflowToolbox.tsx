import React from 'react';
import { motion } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import * as LucideIcons from 'lucide-react';
const toolboxItems = {
  Triggers: [
    { label: 'Form Submitted', type: 'trigger', icon: 'FileText' },
    { label: 'Tag Added', type: 'trigger', icon: 'Tag' },
  ],
  Actions: [
    { label: 'Send Email', type: 'action', icon: 'Mail' },
    { label: 'Send SMS', type: 'action', icon: 'MessageSquare' },
    { label: 'Wait', type: 'action', icon: 'Clock' },
  ],
  Conditions: [
    { label: 'If/Else', type: 'condition', icon: 'GitBranch' },
  ],
};
const onDragStart = (event: React.DragEvent, nodeType: string, nodeData: any) => {
  const data = JSON.stringify({ type: 'custom', data: nodeData });
  event.dataTransfer.setData('application/reactflow', data);
  event.dataTransfer.effectAllowed = 'move';
};
export function WorkflowToolbox() {
  return (
    <div className="w-64 border-r bg-background p-4">
      <h3 className="text-lg font-semibold mb-4">Toolbox</h3>
      <Accordion type="multiple" defaultValue={['Triggers', 'Actions']} className="w-full">
        {Object.entries(toolboxItems).map(([category, items]) => (
          <AccordionItem value={category} key={category}>
            <AccordionTrigger>{category}</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {items.map((item) => {
                  const Icon = (LucideIcons as any)[item.icon] || LucideIcons.HelpCircle;
                  return (
                    <motion.div
                      key={item.label}
                      className="p-2 border rounded-lg flex items-center gap-2 cursor-grab bg-muted/50 hover:bg-muted"
                      draggable
                      onDragStart={(event: React.DragEvent) => onDragStart(event, 'custom', item)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{item.label}</span>
                    </motion.div>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}