import React, { useState, useMemo } from 'react';
import { DndContext, DragEndEvent, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { DealCard } from '@/components/DealCard';
import { api } from '@/lib/api-client';
import type { Pipeline, Deal } from '@shared/types';
import { toast } from 'sonner';
const fetchPipeline = async (id: string) => api<Pipeline>(`/api/pipelines/${id}`);
export function Pipeline() {
  const queryClient = useQueryClient();
  const [activePipelineId] = useState('pipeline-1'); // Default pipeline
  const { data: pipeline, isLoading } = useQuery({
    queryKey: ['pipeline', activePipelineId],
    queryFn: () => fetchPipeline(activePipelineId),
    enabled: !!activePipelineId,
  });
  const deals = useMemo(() => pipeline?.deals ?? [], [pipeline]);
  const dealsByStage = useMemo(() => {
    const grouped: { [key: string]: Deal[] } = {};
    pipeline?.stages.forEach(stage => {
      grouped[stage] = [];
    });
    deals.forEach(deal => {
      if (grouped[deal.stage]) {
        grouped[deal.stage].push(deal);
      }
    });
    return grouped;
  }, [pipeline, deals]);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );
  const updateDealMutation = useMutation({
    mutationFn: ({ id, stage }: { id: string; stage: string }) =>
      api(`/api/deals/${id}`, { method: 'PUT', body: JSON.stringify({ stage }) }),
    onSuccess: () => {
      toast.success('Deal moved successfully');
      queryClient.invalidateQueries({ queryKey: ['pipeline', activePipelineId] });
    },
    onError: () => {
      toast.error('Failed to move deal');
    },
  });
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const activeDeal = deals.find(d => d.id === active.id);
      const overStage = over.id.toString();
      if (activeDeal && activeDeal.stage !== overStage) {
        updateDealMutation.mutate({ id: active.id as string, stage: overStage });
      }
    }
  };
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12">
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-96 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (!pipeline) {
    return <div>Pipeline not found.</div>;
  }
  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{pipeline.name}</h1>
            <p className="text-muted-foreground">Drag and drop deals to manage your sales process.</p>
          </div>
          <Button><PlusCircle className="mr-2 h-4 w-4" /> Add Deal</Button>
        </div>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <div className="flex gap-6 overflow-x-auto pb-4">
            {pipeline.stages.map((stage) => (
              <div key={stage} className="w-72 flex-shrink-0">
                <Card className="bg-muted/50 h-full">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base font-semibold">{stage}</CardTitle>
                    <Badge variant="secondary">{dealsByStage[stage]?.length || 0}</Badge>
                  </CardHeader>
                  <CardContent>
                    <SortableContext id={stage} items={dealsByStage[stage]?.map(d => d.id) || []} strategy={verticalListSortingStrategy}>
                      <div className="min-h-[200px]">
                        {dealsByStage[stage]?.map((deal) => (
                          <DealCard key={deal.id} deal={deal} />
                        ))}
                      </div>
                    </SortableContext>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </DndContext>
      </div>
    </div>
  );
}