import React, { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ReactFlow, {
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  NodeTypes,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Save, ArrowLeft, Eye, Smartphone, Monitor } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api-client';
import type { Page, PageElement } from '@shared/types';
import { PageToolbox } from '@/components/PageToolbox';
import { PageInspector } from '@/components/PageInspector';
const fetchPage = async (id: string) => api<Page>(`/api/pages/${id}`);
const nodeTypes: NodeTypes = {
  // Define custom nodes for page elements later
};
export function PageEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [nodes, setNodes] = useState<Node<PageElement>[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node<PageElement> | null>(null);
  const { data: page, isLoading } = useQuery({
    queryKey: ['page', id],
    queryFn: () => fetchPage(id!),
    enabled: !!id,
  });
  useEffect(() => {
    if (page) {
      const initialNodes = page.content.map(el => ({
        id: el.id,
        type: 'default', // Use custom nodes later
        position: el.position,
        data: el,
      }));
      setNodes(initialNodes);
    }
  }, [page]);
  const saveMutation = useMutation({
    mutationFn: (content: PageElement[]) =>
      api(`/api/pages/${id}`, { method: 'PUT', body: JSON.stringify({ content }) }),
    onSuccess: () => {
      toast.success('Page saved!');
      queryClient.invalidateQueries({ queryKey: ['page', id] });
    },
    onError: () => toast.error('Failed to save page.'),
  });
  const onNodesChange: OnNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), [setNodes]);
  const onEdgesChange: OnEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), [setEdges]);
  const handleSave = () => {
    const content = nodes.map(node => ({ ...node.data, position: node.position }));
    saveMutation.mutate(content);
  };
  const onNodeClick = (_: React.MouseEvent, node: Node<PageElement>) => {
    setSelectedNode(node);
  };
  const onPaneClick = () => {
    setSelectedNode(null);
  };
  if (isLoading) {
    return <Skeleton className="h-screen w-full" />;
  }
  return (
    <div className="h-[calc(100vh-57px)] w-full flex flex-col bg-muted/40">
      <header className="p-2 border-b flex justify-between items-center bg-background z-10">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate('/app/funnels')}><ArrowLeft className="h-4 w-4" /></Button>
          <div>
            <h2 className="text-md font-semibold">{page?.name ?? 'Untitled Page'}</h2>
            <p className="text-xs text-muted-foreground">Page Editor</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline" size="sm"><Monitor className="mr-2 h-4 w-4" /> Desktop</Button>
            <Button variant="ghost" size="sm"><Smartphone className="mr-2 h-4 w-4" /> Mobile</Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Eye className="mr-2 h-4 w-4" /> Preview</Button>
          <Button onClick={handleSave} disabled={saveMutation.isPending}>
            <Save className="mr-2 h-4 w-4" /> {saveMutation.isPending ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </header>
      <div className="flex-grow flex">
        <PageToolbox />
        <div className="flex-grow h-full">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            fitView
          >
            <Controls />
            <Background />
          </ReactFlow>
        </div>
        <PageInspector selectedNode={selectedNode} onUpdate={() => {}} />
      </div>
    </div>
  );
}