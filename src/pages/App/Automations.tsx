import React, { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ReactFlow, {
  Controls, Background, applyNodeChanges, applyEdgeChanges, addEdge,
  OnNodesChange, OnEdgesChange, OnConnect, NodeTypes, MiniMap,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { PlusCircle, Save, Workflow, Zap } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { toast } from 'sonner';
import { api } from '@/lib/api-client';
import type { WorkflowState, WorkflowNode, WorkflowEdge } from '@shared/types';
import { CustomNode } from '@/components/WorkflowNode';
import { WorkflowToolbox } from '@/components/WorkflowToolbox';
import { WorkflowInspector } from '@/components/WorkflowInspector';
import { WorkflowTemplates } from '@/components/WorkflowTemplates';
import { WorkflowTestingPanel } from '@/components/WorkflowTestingPanel';
import { OnboardingTooltip } from '@/components/OnboardingTooltip';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/mock-auth';
const fetchWorkflows = async () => api<{ items: WorkflowState[] }>('/api/workflows');
const nodeTypes: NodeTypes = { custom: CustomNode };
export function Automations() {
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowState | null>(null);
  const [nodes, setNodes] = useState<WorkflowNode[]>([]);
  const [edges, setEdges] = useState<WorkflowEdge[]>([]);
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const [isTemplateSheetOpen, setTemplateSheetOpen] = useState(false);
  const currentOrg = useAuthStore(s => s.currentOrg);
  const queryClient = useQueryClient();
  const onNodesChange: OnNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
  const onEdgesChange: OnEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);
  const onConnect: OnConnect = useCallback((connection) => setEdges((eds) => addEdge(connection, eds)), []);
  const { data, isLoading } = useQuery({ queryKey: ['workflows'], queryFn: fetchWorkflows });
  const saveMutation = useMutation({
    mutationFn: (workflow: { id: string; nodes: WorkflowNode[]; edges: WorkflowEdge[] }) =>
      api(`/api/workflows/${workflow.id}`, { method: 'PUT', body: JSON.stringify(workflow) }),
    onSuccess: () => {
      toast.success('Workflow saved!');
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
    },
  });
  const handleSelectWorkflow = (workflow: WorkflowState) => {
    setSelectedWorkflow(workflow);
    setNodes(workflow.nodes);
    setEdges(workflow.edges);
    setSelectedNode(null);
  };
  if (selectedWorkflow) {
    return (
      <div className="h-[calc(100vh-64px)] w-full flex flex-col bg-white">
        <header className="h-16 border-b-4 border-black flex justify-between items-center px-6 bg-white z-10">
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="font-black uppercase text-xs hover:bg-orange-50" onClick={() => setSelectedWorkflow(null)}>&larr; Exit</Button>
            <div className="h-8 w-[2px] bg-black" />
            <h2 className="text-xl font-black uppercase tracking-tighter">{selectedWorkflow.name}</h2>
          </div>
          <div className="flex gap-3">
            <Button className="brutalist-button bg-orange-500 text-white" onClick={() => saveMutation.mutate({ id: selectedWorkflow.id, nodes, edges })}>
              <Save className="mr-2 h-4 w-4" /> SAVE WORKFLOW
            </Button>
          </div>
        </header>
        <div className="flex-grow flex overflow-hidden">
          <WorkflowToolbox />
          <div className="flex-grow relative bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:24px_24px] [background-position:center]">
            <ReactFlow
              nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
              onConnect={onConnect} onNodeClick={(_, node) => setSelectedNode(node)} onPaneClick={() => setSelectedNode(null)}
              nodeTypes={nodeTypes} fitView proOptions={{ hideAttribution: true }}
            >
              <Controls className="border-2 border-black shadow-brutalist rounded-none" />
              <Background color="#000" gap={24} />
            </ReactFlow>
          </div>
          <div className="w-96 border-l-4 border-black bg-white flex flex-col">
            <Tabs defaultValue="inspector" className="flex-grow flex flex-col">
              <TabsList className="m-4 border-2 border-black bg-muted p-1 rounded-none">
                <TabsTrigger value="inspector" className="flex-1 font-black uppercase text-xs data-[state=active]:bg-black data-[state=active]:text-white rounded-none">Inspector</TabsTrigger>
                <TabsTrigger value="testing" className="flex-1 font-black uppercase text-xs data-[state=active]:bg-black data-[state=active]:text-white rounded-none">Testing</TabsTrigger>
              </TabsList>
              <TabsContent value="inspector" className="flex-grow overflow-auto">
                <WorkflowInspector selectedNode={selectedNode} onUpdate={(id, config) => setNodes(nds => nds.map(n => n.id === id ? { ...n, data: { ...n.data, config } } : n))} />
              </TabsContent>
              <TabsContent value="testing" className="flex-grow overflow-auto">
                <WorkflowTestingPanel />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="editorial-heading">Automations</h1>
            <p className="text-xl font-mono mt-2 uppercase font-bold text-muted-foreground">Workflow Engine & Logic.</p>
          </div>
          <OnboardingTooltip tourId="new-workflow" content="Start with a template for faster setup.">
            <Sheet open={isTemplateSheetOpen} onOpenChange={setTemplateSheetOpen}>
              <SheetTrigger asChild>
                <Button className="brutalist-button bg-orange-500 text-white"><PlusCircle className="mr-2 h-4 w-4" /> NEW WORKFLOW</Button>
              </SheetTrigger>
              <SheetContent className="sm:max-w-5xl border-l-4 border-black">
                <SheetHeader><SheetTitle className="text-3xl font-black uppercase">Workflow Templates</SheetTitle></SheetHeader>
                <WorkflowTemplates onSelect={(t) => { handleSelectWorkflow(t); setTemplateSheetOpen(false); }} />
              </SheetContent>
            </Sheet>
          </OnboardingTooltip>
        </div>
        <div className="border-4 border-black bg-white shadow-brutalist overflow-hidden">
          <Table>
            <TableHeader className="bg-black">
              <TableRow className="hover:bg-black border-b-4 border-black">
                <TableHead className="text-white font-black uppercase tracking-widest">Workflow Name</TableHead>
                <TableHead className="text-white font-black uppercase tracking-widest">Status</TableHead>
                <TableHead className="text-white font-black uppercase tracking-widest">Performance</TableHead>
                <TableHead className="text-white font-black uppercase tracking-widest text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-b-2 border-black"><TableCell colSpan={4}><Skeleton className="h-12 w-full" /></TableCell></TableRow>
                ))
              ) : (
                data?.items.map((workflow) => (
                  <motion.tr
                    key={workflow.id}
                    onClick={() => handleSelectWorkflow(workflow)}
                    className="cursor-pointer hover:bg-orange-50 border-b-2 border-black group"
                    whileHover={{ x: 4 }}
                  >
                    <TableCell className="font-black uppercase text-sm flex items-center gap-3">
                      <div className="h-8 w-8 bg-black text-white flex items-center justify-center"><Workflow className="h-4 w-4" /></div>
                      {workflow.name}
                    </TableCell>
                    <TableCell>
                      <Badge className={workflow.paused ? 'bg-muted text-black border-2 border-black' : 'bg-green-500 text-white border-2 border-black'}>
                        {workflow.paused ? 'PAUSED' : 'ACTIVE'}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      <div className="flex items-center gap-2">
                        <Zap className="h-3 w-3 text-orange-500" />
                        {workflow.metrics?.completions ?? 0} / {workflow.metrics?.runs ?? 0} RUNS
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" className="font-black uppercase text-[10px] hover:bg-black hover:text-white">Edit &rarr;</Button>
                    </TableCell>
                  </motion.tr>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}