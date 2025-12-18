import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import * as LucideIcons from 'lucide-react';
import { useAuthStore } from '@/lib/mock-auth';
import { motion } from 'framer-motion';
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
  Integrations: [
    { label: 'Send Gmail Sequence', type: 'action', icon: 'Mail', description: 'Send personalized email via Gmail', config: { to: '{{contact.email}}', subject: 'Personalized Update' } },
    { label: 'Schedule Calendar Event', type: 'action', icon: 'CalendarPlus', description: 'Add event to Google Calendar', config: { eventTitle: 'Consultation Call', duration: 30 } },
    { label: 'Research Prospect', type: 'action', icon: 'Search', description: 'Enrich contact with Perplexity AI', config: { prompt: 'Research {{contact.company}} for latest news and insights' } },
  ],
  Exit: [
    { label: 'End Workflow', type: 'end', icon: 'CheckCircle', description: 'Ends this workflow path.' },
  ]
};
export function WorkflowToolbox() {
  const currentOrg = useAuthStore(s => s.currentOrg);
  const onDragStart = (event: React.DragEvent<HTMLDivElement>, item: any) => {
    const nodeData = { data: { ...item, orgId: currentOrg?.id }, type: 'custom' };
    event.dataTransfer.setData('application/reactflow', JSON.stringify(nodeData));
    event.dataTransfer.effectAllowed = 'move';
  };
  return (
    <div className="w-64 border-r-4 border-black bg-white p-4 overflow-y-auto">
      <h3 className="text-2xl font-display font-black uppercase mb-6 tracking-tighter">Toolbox</h3>
      <TooltipProvider>
        <Accordion type="multiple" defaultValue={['Triggers', 'Actions', 'Integrations']} className="w-full space-y-2">
          {Object.entries(toolboxItems).map(([category, items]) => (
            <AccordionItem value={category} key={category} className="border-2 border-black">
              <AccordionTrigger className="px-3 py-2 hover:no-underline font-black uppercase text-sm">{category}</AccordionTrigger>
              <AccordionContent className="px-3 pb-3">
                <div className="space-y-2">
                  {items.map((item) => {
                    const Icon = (LucideIcons as any)[item.icon] || LucideIcons.HelpCircle;
                    return (
                      <Tooltip key={item.label}>
                        <TooltipTrigger asChild>
                          <div
                            className="p-2 border-2 border-black flex items-center gap-2 cursor-grab bg-white hover:bg-orange-50 transition-colors"
                            draggable
                            onDragStart={(event) => onDragStart(event, item)}
                          >
                            <Icon className="h-4 w-4 text-black" />
                            <span className="text-xs font-bold uppercase">{item.label}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="bg-black text-white border-none">
                          <p className="text-xs">{item.description}</p>
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