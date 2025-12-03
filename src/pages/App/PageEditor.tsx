import React, { useState, useCallback, useEffect, useRef } from 'react';
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
  ReactFlowProvider,
  ReactFlowInstance,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Save, ArrowLeft, Eye, Smartphone, Monitor, BarChart2, Settings2, TestTube2 } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api-client';
import type { Page, PageElement } from '@shared/types';
import { PageToolbox } from '@/components/PageToolbox';
import { PageInspector } from '@/components/PageInspector';
import { PageElementNode } from '@/components/PageElementTypes';
import { PagePreview } from '@/components/PagePreview';
import { PageAnalytics } from '@/components/PageAnalytics';
import { SEOPanel } from '@/components/SEOPanel';
import { ABTestingPanel } from '@/components/ABTestingPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
const fetchPage = async (id: string) => api<Page>(`/api/pages/${id}`);
const nodeTypes: NodeTypes = {
  default: PageElementNode,
};
export function PageEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [nodes, setNodes] = useState<Node<PageElement>[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node<PageElement> | null>(null);
  const [viewMode, setViewMode] = useState<'editor' | 'preview'>('editor');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const { data: page, isLoading } = useQuery({
    queryKey: ['page', id],
    queryFn: () => fetchPage(id!),
    enabled: !!id,
  });
  useEffect(() => {
    if (page) {
      const initialNodes = page.content.map(el => ({
        id: el.id,
        type: 'default',
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
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      if (!reactFlowInstance || !reactFlowWrapper.current) return;
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const data = JSON.parse(event.dataTransfer.getData('application/reactflow'));
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      const newNode: Node<PageElement> = {
        id: `el-${crypto.randomUUID()}`,
        type: 'default',
        position,
        data: {
          id: `el-${crypto.randomUUID()}`,
          type: data.data.type,
          content: '',
          position,
        },
      };
      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );
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
          <Button variant={viewMode === 'editor' ? 'secondary' : 'ghost'} size="sm" onClick={() => setViewMode('editor')}>Editor</Button>
          <Button variant={viewMode === 'preview' ? 'secondary' : 'ghost'} size="sm" onClick={() => setViewMode('preview')}>Preview</Button>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={saveMutation.isPending}>
            <Save className="mr-2 h-4 w-4" /> {saveMutation.isPending ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </header>
      <div className="flex-grow flex">
        <PageToolbox />
        <main className="flex-grow h-full flex flex-col">
          {viewMode === 'preview' && (
            <div className="p-2 border-b bg-background flex justify-center items-center gap-2">
              <Button variant={previewDevice === 'desktop' ? 'secondary' : 'ghost'} size="icon" onClick={() => setPreviewDevice('desktop')}><Monitor className="h-4 w-4" /></Button>
              <Button variant={previewDevice === 'tablet' ? 'secondary' : 'ghost'} size="icon" onClick={() => setPreviewDevice('tablet')}><Smartphone className="h-4 w-4" /></Button>
              <Button variant={previewDevice === 'mobile' ? 'secondary' : 'ghost'} size="icon" onClick={() => setPreviewDevice('mobile')}><Smartphone className="h-4 w-4 rotate-90" /></Button>
            </div>
          )}
          <div className="flex-grow">
            {viewMode === 'editor' ? (
              <ReactFlowProvider>
                <div className="h-full w-full" ref={reactFlowWrapper}>
                  <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onNodeClick={onNodeClick}
                    onPaneClick={onPaneClick}
                    onInit={setReactFlowInstance}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    nodeTypes={nodeTypes}
                    fitView
                  >
                    <Controls />
                    <Background />
                  </ReactFlow>
                </div>
              </ReactFlowProvider>
            ) : (
              <PagePreview nodes={nodes} viewMode={previewDevice} />
            )}
          </div>
        </main>
        <aside className="w-[350px] border-l bg-background">
          <Tabs defaultValue="inspector" className="h-full flex flex-col">
            <TabsList className="m-2">
              <TabsTrigger value="inspector"><Settings2 className="h-4 w-4" /></TabsTrigger>
              <TabsTrigger value="analytics"><BarChart2 className="h-4 w-4" /></TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
              <TabsTrigger value="ab-testing"><TestTube2 className="h-4 w-4" /></TabsTrigger>
            </TabsList>
            <TabsContent value="inspector" className="flex-grow overflow-auto">
              <PageInspector selectedNode={selectedNode} onUpdate={() => {}} />
            </TabsContent>
            <TabsContent value="analytics"><PageAnalytics /></TabsContent>
            <TabsContent value="seo"><SEOPanel /></TabsContent>
            <TabsContent value="ab-testing"><ABTestingPanel /></TabsContent>
          </Tabs>
        </aside>
      </div>
    </div>
  );
}