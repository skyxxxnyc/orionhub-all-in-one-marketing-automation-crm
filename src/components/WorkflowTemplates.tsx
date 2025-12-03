import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { api } from '@/lib/api-client';
import type { Workflow } from '@shared/types';
import { ReactFlow, MiniMap } from 'reactflow';
import 'reactflow/dist/style.css';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useAuthStore } from '@/lib/mock-auth';
import { Badge } from './ui/badge';
const fetchWorkflowTemplates = async (orgId?: string) => api<{ items: Workflow[] }>('/api/workflows/templates', { query: { orgId } });
interface WorkflowTemplatesProps {
  onSelect: (template: Workflow) => void;
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
  const onDragStart = (event: React.DragEvent<HTMLDivElement>, template: Workflow) => {
    event.dataTransfer.setData('application/reactflow-template', JSON.stringify(template));
    event.dataTransfer.effectAllowed = 'move';
  };
  return (
    <div className="py-4 space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold">Start with a Template</h2>
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.05,
            },
          },
        }}
        initial="hidden"
        animate="show"
      >
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-64 w-full" />)
        ) : (
          filteredTemplates.map((template) => (
            <motion.div
              key={template.id}
              variants={{ hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1 } }}
              whileHover={{ scale: 1.05, y: -4, zIndex: 10, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
              transition={{ duration: 0.2 }}
              className="cursor-pointer"
              onClick={() => onSelect(template)}
              draggable
              onDragStart={(e) => onDragStart(e, template)}
            >
              <Card className="h-full overflow-hidden">
                <CardHeader>
                  <CardTitle>{template.name}</CardTitle>
                  <CardDescription className="line-clamp-2">{template.description}</CardDescription>
                  <div className="flex gap-2 pt-1">
                    {template.category && <Badge variant="secondary">{template.category}</Badge>}
                    {template.complexity && <Badge variant="outline">{template.complexity}</Badge>}
                  </div>
                </CardHeader>
                <CardContent className="h-40 bg-muted/50 pointer-events-none">
                  <div className="h-full w-full overflow-hidden">
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
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  );
}