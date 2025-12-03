import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { api } from '@/lib/api-client';
import type { Workflow } from '@shared/types';
import ReactFlow, { MiniMap } from 'reactflow';
import 'reactflow/dist/style.css';
const fetchWorkflowTemplates = async () => api<{ items: Workflow[] }>('/api/workflows/templates');
interface WorkflowTemplatesProps {
  onSelect: (template: Workflow) => void;
}
export function WorkflowTemplates({ onSelect }: WorkflowTemplatesProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['workflowTemplates'],
    queryFn: fetchWorkflowTemplates,
  });
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12">
        <h2 className="text-2xl font-bold mb-6">Start with a Template</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-64 w-full" />)
          ) : (
            data?.items.map((template) => (
              <motion.div
                key={template.id}
                whileHover={{ scale: 1.02, y: -4 }}
                className="cursor-pointer"
                onClick={() => onSelect(template)}
              >
                <Card className="h-full overflow-hidden">
                  <CardHeader>
                    <CardTitle>{template.name}</CardTitle>
                    <CardDescription>A pre-built workflow to get you started.</CardDescription>
                  </CardHeader>
                  <CardContent className="h-40 bg-muted/50 pointer-events-none">
                    <div className="h-full w-full">
                      <ReactFlow nodes={template.nodes} edges={template.edges} fitView>
                        <MiniMap nodeStrokeWidth={3} zoomable={false} pannable={false} />
                      </ReactFlow>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}