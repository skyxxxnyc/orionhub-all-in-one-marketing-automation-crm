import React, { useState, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import ReactFlow, {
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  NodeTypes,
  MiniMap,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { PlusCircle, Play, Save, Workflow as WorkflowIcon } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api-client';
import type { Workflow, WorkflowNode, WorkflowEdge } from '@shared/types';
import { CustomNode } from '@/components/WorkflowNode';
import { WorkflowToolbox } from '@/components/WorkflowToolbox';
import { WorkflowInspector } from '@/components/WorkflowInspector';
const fetchWorkflows = async () => api<{ items: Workflow[] }>('/api/workflows');
const nodeTypes: NodeTypes = {
  custom: CustomNode,
};
export function Automations() {
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [nodes, setNodes] = useState<WorkflowNode[]>([]);
  const [edges, setEdges] = useState<WorkflowEdge[]>([]);
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const onNodesChange: OnNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), [setNodes]);
  const onEdgesChange: OnEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), [setEdges]);
  const onConnect: OnConnect = useCallback((connection) => setEdges((eds) => addEdge(connection, eds)), [setEdges]);
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['workflows'],
    queryFn: fetchWorkflows,
  });
  const saveMutation = useMutation({
    mutationFn: (workflow: { id: string; nodes: WorkflowNode[]; edges: WorkflowEdge[] }) =>
      api(`/api/workflows/${workflow.id}`, { method: 'PUT', body: JSON.stringify(workflow) }),
    onSuccess: () => {
      toast.success('Workflow saved!');
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
    },
    onError: () => toast.error('Failed to save workflow.'),
  });
  const handleSelectWorkflow = (workflow: Workflow) => {
    setSelectedWorkflow(workflow);
    setNodes(workflow.nodes);
    setEdges(workflow.edges);
    setSelectedNode(null);
  };
  const handleSave = () => {
    if (selectedWorkflow) {
      saveMutation.mutate({ id: selectedWorkflow.id, nodes, edges });
    }
  };
  const onNodeClick = (_: React.MouseEvent, node: WorkflowNode) => {
    setSelectedNode(node);
  };
  const onPaneClick = () => {
    setSelectedNode(null);
  };
  const updateNodeConfig = (nodeId: string, config: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return { ...node, data: { ...node.data, config } };
        }
        return node;
      })
    );
  };
  if (selectedWorkflow) {
    return (
      <div className="h-[calc(100vh-57px)] w-full flex flex-col">
        <header className="p-4 border-b flex justify-between items-center bg-background">
          <div>
            <Button variant="ghost" onClick={() => setSelectedWorkflow(null)}>&larr; Back</Button>
            <h2 className="text-xl font-bold inline-block ml-4">{selectedWorkflow.name}</h2>
          </div>
          <div className="flex gap-2">
            <Button variant="outline"><Play className="mr-2 h-4 w-4" /> Test</Button>
            <Button onClick={handleSave} disabled={saveMutation.isPending}>
              <Save className="mr-2 h-4 w-4" /> {saveMutation.isPending ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </header>
        <div className="flex-grow flex">
          <WorkflowToolbox />
          <div className="flex-grow h-full" style={{ height: 'calc(100vh - 120px)' }}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              onPaneClick={onPaneClick}
              nodeTypes={nodeTypes}
              fitView
            >
              <Controls />
              <MiniMap />
              <Background gap={12} size={1} />
            </ReactFlow>
          </div>
          <WorkflowInspector selectedNode={selectedNode} onUpdate={updateNodeConfig} />
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Automations</h1>
            <p className="text-muted-foreground">Create and manage your marketing workflows.</p>
          </div>
          <Button><PlusCircle className="mr-2 h-4 w-4" /> New Workflow</Button>
        </div>
        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Active Contacts</TableHead>
                  <TableHead>Completion Rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    </TableRow>
                  ))
                ) : (
                  data?.items.map((workflow) => (
                    <TableRow key={workflow.id} onClick={() => handleSelectWorkflow(workflow)} className="cursor-pointer">
                      <TableCell className="font-medium">{workflow.name}</TableCell>
                      <TableCell><Badge>Active</Badge></TableCell>
                      <TableCell>1,234</TableCell>
                      <TableCell>92%</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}