import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import * as LucideIcons from 'lucide-react';
const toolboxItems = {
  Triggers: [
    { label: 'Form Submitted', type: 'trigger', icon: 'FileText', description: 'Starts when a form is submitted.' },
    { label: 'Tag Added', type: 'trigger', icon: 'Tag', description: 'Starts when a tag is added to a contact.' },
    { label: 'Date-based', type: 'trigger', icon: 'Calendar', description: 'Starts on a specific date or anniversary.' },
  ],
  Actions: [
    { label: 'Send Email', type: 'action', icon: 'Mail', description: 'Sends an email to the contact.' },
    { label: 'Send SMS', type: 'action', icon: 'MessageSquare', description: 'Sends an SMS to the contact.' },
    { label: 'Wait', type: 'action', icon: 'Clock', description: 'Pauses the workflow for a period.' },
    { label: 'Add Tag', type: 'action', icon: 'Tag', description: 'Adds a tag to the contact.' },
    { label: 'Update Deal', type: 'action', icon: 'BarChart', description: 'Moves a deal to a new stage.' },
  ],
  Conditions: [
    { label: 'If/Else', type: 'condition', icon: 'GitBranch', description: 'Splits the path based on a condition.' },
  ],
  Exit: [
    { label: 'End Workflow', type: 'end', icon: 'CheckCircle', description: 'Ends this workflow path.' },
  ]
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
      <TooltipProvider>
        <Accordion type="multiple" defaultValue={['Triggers', 'Actions']} className="w-full">
          {Object.entries(toolboxItems).map(([category, items]) => (
            <AccordionItem value={category} key={category}>
              <AccordionTrigger>{category}</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {items.map((item) => {
                    const Icon = (LucideIcons as any)[item.icon] || LucideIcons.HelpCircle;
                    return (
                      <Tooltip key={item.label}>
                        <TooltipTrigger asChild>
                          <div
                            className="p-2 border rounded-lg flex items-center gap-2 cursor-grab bg-muted/50 hover:bg-muted transition-colors"
                            draggable
                            onDragStart={(event: React.DragEvent<HTMLDivElement>) => onDragStart(event, 'custom', item)}
                          >
                            <Icon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{item.label}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p>{item.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </TooltipProvider>
    </div>
  );
}