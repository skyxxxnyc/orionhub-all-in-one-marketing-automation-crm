import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { api } from '@/lib/api-client';
import type { WorkflowState } from '@shared/types';
import { ReactFlow, MiniMap } from 'reactflow';
import 'reactflow/dist/style.css';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useAuthStore } from '@/lib/mock-auth';
import { Badge } from './ui/badge';
const fetchWorkflowTemplates = async (orgId?: string) => api<{ items: WorkflowState[] }>('/api/workflows/templates', { query: { orgId } });
interface WorkflowTemplatesProps {
  onSelect: (template: WorkflowState) => void;
}
export function WorkflowTemplates({ onSelect }: WorkflowTemplatesProps) {
  const currentOrg = useAuthStore(s => s.currentOrg);
  const { data, isLoading } = useQuery({
    queryKey: ['workflowTemplates', currentOrg?.id],
    queryFn: () => fetchWorkflowTemplates(currentOrg?.id),
  });
  const [searchTerm, setSearchTerm] = useState('');
  const filteredTemplates = useMemo(() => {
    if (!data?.items) return [];
    return data.items.filter(template =>
      (template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.category?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [data, searchTerm]);
  const onDragStart = (event: React.DragEvent<HTMLDivElement>, template: WorkflowState) => {
    const nodeData = { ...template, orgId: currentOrg?.id };
    event.dataTransfer.setData('application/reactflow-template', JSON.stringify(nodeData));
    event.dataTransfer.effectAllowed = 'move';
  };
  return (
    <div className="py-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-3xl font-display font-black uppercase">Templates</h2>
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="SEARCH..."
            className="brutalist-input pl-10 uppercase font-bold"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-64 w-full border-2 border-black" />)
        ) : (
          filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="cursor-pointer brutalist-card flex flex-col p-0 overflow-hidden"
              onClick={() => onSelect(template)}
              draggable
              onDragStart={(e) => onDragStart(e, template)}
            >
              <div className="p-4 border-b-2 border-black">
                <h3 className="text-xl font-black uppercase truncate">{template.name}</h3>
                <div className="flex gap-2 mt-2">
                  {template.category && <Badge className="bg-black text-white uppercase text-[10px]">{template.category}</Badge>}
                  {template.complexity && <Badge variant="outline" className="border-black uppercase text-[10px]">{template.complexity}</Badge>}
                </div>
              </div>
              <div className="h-40 bg-muted pointer-events-none relative">
                <ReactFlow
                  nodes={template.nodes ?? []}
                  edges={template.edges ?? []}
                  fitView
                  nodesDraggable={false}
                  nodesConnectable={false}
                  elementsSelectable={false}
                  proOptions={{ hideAttribution: true }}
                  style={{ height: '100%', width: '100%' }}
                >
                  <MiniMap nodeStrokeWidth={3} zoomable={false} pannable={false} />
                </ReactFlow>
              </div>
              <div className="p-4 bg-white">
                <p className="text-xs font-medium text-muted-foreground line-clamp-2">{template.description}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}