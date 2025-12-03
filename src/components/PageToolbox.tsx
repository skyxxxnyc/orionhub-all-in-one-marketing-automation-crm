import React from 'react';
import { motion } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import * as LucideIcons from 'lucide-react';
const toolboxItems = {
  Content: [
    { label: 'Heading', type: 'text', icon: 'Heading' },
    { label: 'Paragraph', type: 'text', icon: 'Pilcrow' },
    { label: 'Image', type: 'image', icon: 'Image' },
  ],
  Actions: [
    { label: 'Button', type: 'button', icon: 'MousePointerSquare' },
  ],
  Forms: [
    { label: 'Form', type: 'form', icon: 'ClipboardList' },
  ],
};
const onDragStart = (event: React.DragEvent, nodeType: string, nodeData: any) => {
  const data = JSON.stringify({ type: nodeType, data: nodeData });
  event.dataTransfer.setData('application/reactflow', data);
  event.dataTransfer.effectAllowed = 'move';
};
export function PageToolbox() {
  return (
    <div className="w-64 border-r bg-background p-4">
      <h3 className="text-lg font-semibold mb-4">Elements</h3>
      <Accordion type="multiple" defaultValue={['Content', 'Actions']} className="w-full">
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
                      onDragStart={(event: React.DragEvent) => onDragStart(event, 'default', item)}
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