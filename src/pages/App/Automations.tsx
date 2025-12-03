import React, { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ReactFlow, {
  Controls, Background, applyNodeChanges, applyEdgeChanges, addEdge,
  Node, Edge, OnNodesChange, OnEdgesChange, OnConnect, NodeTypes, MiniMap,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { PlusCircle, Play, Save, Workflow as WorkflowIcon, Pause, StopCircle, Undo, Redo, Share2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { toast } from 'sonner';
import { api } from '@/lib/api-client';
import type { Workflow, WorkflowNode, WorkflowEdge } from '@shared/types';
import { CustomNode } from '@/components/WorkflowNode';
import { WorkflowToolbox } from '@/components/WorkflowToolbox';
import { WorkflowInspector } from '@/components/WorkflowInspector';
import { WorkflowTemplates } from '@/components/WorkflowTemplates';
import { WorkflowAnalytics } from '@/components/WorkflowAnalytics';
import { WorkflowTestingPanel } from '@/components/WorkflowTestingPanel';
import { WorkflowJourneyViewer } from '@/components/WorkflowJourneyViewer';
import { OnboardingTooltip } from '@/components/OnboardingTooltip';
const fetchWorkflows = async () => api<{ items: Workflow[] }>('/api/workflows');
const nodeTypes: NodeTypes = { custom: CustomNode };
export function Automations() {
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [nodes, setNodes] = useState<WorkflowNode[]>([]);
  const [edges, setEdges] = useState<WorkflowEdge[]>([]);
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const [isTemplateSheetOpen, setTemplateSheetOpen] = useState(false);
  const onNodesChange: OnNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), [setNodes]);
  const onEdgesChange: OnEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), [setEdges]);
  const onConnect: OnConnect = useCallback((connection) => setEdges((eds) => addEdge(connection, eds)), [setEdges]);
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['workflows'], queryFn: fetchWorkflows });
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
  const onNodeClick = (_: React.MouseEvent, node: WorkflowNode) => setSelectedNode(node);
  const onPaneClick = () => setSelectedNode(null);
  const updateNodeConfig = (nodeId: string, config: any) => {
    setNodes((nds) =>
      nds.map((node) => node.id === nodeId ? { ...node, data: { ...node.data, config } } : node)
    );
  };
  const handleTemplateSelect = (template: Workflow) => {
    handleSelectWorkflow({ ...template, id: `wf-${crypto.randomUUID()}`, name: `Copy of ${template.name}` });
    setTemplateSheetOpen(false);
  };
  if (selectedWorkflow) {
    return (
      <div className="h-[calc(100vh-57px)] w-full flex flex-col">
        <header className="p-2 border-b flex justify-between items-center bg-background z-10">
          <Button variant="ghost" onClick={() => setSelectedWorkflow(null)}>&larr; Back to list</Button>
          <h2 className="text-lg font-bold">{selectedWorkflow.name}</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="icon"><Undo className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon"><Redo className="h-4 w-4" /></Button>
            <Button variant="outline"><Share2 className="mr-2 h-4 w-4" /> Share</Button>
            <Button onClick={handleSave} disabled={saveMutation.isPending}>
              <Save className="mr-2 h-4 w-4" /> {saveMutation.isPending ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </header>
        <div className="flex-grow flex">
          <WorkflowToolbox />
          <div className="flex-grow h-full" style={{ height: 'calc(100vh - 100px)' }}>
            <ReactFlow
              nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
              onConnect={onConnect} onNodeClick={onNodeClick} onPaneClick={onPaneClick}
              nodeTypes={nodeTypes} fitView
            >
              <Controls />
              <MiniMap />
              <Background />
            </ReactFlow>
          </div>
          <div className="w-[350px] border-l bg-background flex flex-col">
            <Tabs defaultValue="inspector" className="flex-grow flex flex-col">
              <TabsList className="m-2">
                <TabsTrigger value="inspector">Inspector</TabsTrigger>
                <TabsTrigger value="testing">Testing</TabsTrigger>
              </TabsList>
              <TabsContent value="inspector" className="flex-grow">
                <WorkflowInspector selectedNode={selectedNode} onUpdate={updateNodeConfig} />
              </TabsContent>
              <TabsContent value="testing" className="flex-grow">
                <WorkflowTestingPanel />
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <footer className="border-t">
          <Tabs defaultValue="analytics">
            <TabsList className="m-2">
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="journeys">Journeys</TabsTrigger>
            </TabsList>
            <TabsContent value="analytics"><WorkflowAnalytics /></TabsContent>
            <TabsContent value="journeys"><WorkflowJourneyViewer /></TabsContent>
          </Tabs>
        </footer>
      </div>
    );
  }
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Automations</h1>
            <p className="text-muted-foreground">Create and manage your marketing workflows.</p>
          </div>
          <OnboardingTooltip tourId="new-workflow" content="Start building your first automation from a template.">
            <Sheet open={isTemplateSheetOpen} onOpenChange={setTemplateSheetOpen}>
              <SheetTrigger asChild>
                <Button><PlusCircle className="mr-2 h-4 w-4" /> New Workflow</Button>
              </SheetTrigger>
              <SheetContent className="sm:max-w-4xl">
                <SheetHeader><SheetTitle>New Workflow</SheetTitle></SheetHeader>
                <WorkflowTemplates onSelect={handleTemplateSelect} />
              </SheetContent>
            </Sheet>
          </OnboardingTooltip>
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
                    <TableRow key={workflow.id} onClick={() => handleSelectWorkflow(workflow)} className="cursor-pointer hover:bg-muted/50">
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