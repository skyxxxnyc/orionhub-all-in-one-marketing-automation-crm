import React, { useState, useMemo } from 'react';
import { DndContext, DragEndEvent, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { PlusCircle, TrendingUp, DollarSign, Target } from 'lucide-react';
import { DealCard } from '@/components/DealCard';
import { api } from '@/lib/api-client';
import type { Pipeline, Deal } from '@shared/types';
import { toast } from 'sonner';
const fetchPipeline = async (id: string) => api<Pipeline>(`/api/pipelines/${id}`);
export function Pipeline() {
  const queryClient = useQueryClient();
  const [activePipelineId] = useState('pipeline-1');
  const { data: pipeline, isLoading } = useQuery({
    queryKey: ['pipeline', activePipelineId],
    queryFn: () => fetchPipeline(activePipelineId),
    enabled: !!activePipelineId,
  });
  const deals = useMemo(() => pipeline?.deals ?? [], [pipeline]);
  const dealsByStage = useMemo(() => {
    const grouped: { [key: string]: Deal[] } = {};
    pipeline?.stages.forEach(stage => { grouped[stage] = []; });
    deals.forEach(deal => { if (grouped[deal.stage]) grouped[deal.stage].push(deal); });
    return grouped;
  }, [pipeline, deals]);
  const forecast = useMemo(() => {
    if (!pipeline) return { total: 0, weighted: 0 };
    const total = deals.reduce((sum, d) => sum + d.value, 0);
    // Mock weighting: later stages have higher probability
    const weighted = pipeline.stages.reduce((sum, stage, idx) => {
      const stageDeals = dealsByStage[stage] || [];
      const probability = (idx + 1) / pipeline.stages.length;
      return sum + stageDeals.reduce((s, d) => s + d.value * probability, 0);
    }, 0);
    return { total, weighted };
  }, [pipeline, deals, dealsByStage]);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );
  const updateDealMutation = useMutation({
    mutationFn: ({ id, stage }: { id: string; stage: string }) =>
      api(`/api/deals/${id}`, { method: 'PUT', body: JSON.stringify({ stage }) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pipeline', activePipelineId] });
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
  if (isLoading) return <div className="p-8"><Skeleton className="h-screen w-full" /></div>;
  if (!pipeline) return <div className="p-8 font-black uppercase">Pipeline not found.</div>;
  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="editorial-heading">{pipeline.name}</h1>
            <p className="text-xl font-mono mt-2 uppercase font-bold text-muted-foreground">Sales Velocity & Pipeline.</p>
          </div>
          <Button className="brutalist-button bg-orange-500 text-white">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Deal
          </Button>
        </div>
        {/* Forecasting Widget */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="brutalist-card bg-black text-white flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="font-black uppercase text-xs tracking-widest">Total Pipeline</span>
              <DollarSign className="h-5 w-5 text-orange-500" />
            </div>
            <div className="mt-4">
              <span className="text-4xl font-black">${forecast.total.toLocaleString()}</span>
              <p className="text-[10px] font-mono uppercase mt-1 opacity-60">Gross Value of all active deals</p>
            </div>
          </div>
          <div className="brutalist-card bg-orange-500 text-white flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="font-black uppercase text-xs tracking-widest">Weighted Forecast</span>
              <TrendingUp className="h-5 w-5 text-black" />
            </div>
            <div className="mt-4">
              <span className="text-4xl font-black">${Math.round(forecast.weighted).toLocaleString()}</span>
              <p className="text-[10px] font-mono uppercase mt-1 text-black/60">Probability-adjusted revenue</p>
            </div>
          </div>
          <div className="brutalist-card bg-white border-4 border-black flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="font-black uppercase text-xs tracking-widest">Target Gap</span>
              <Target className="h-5 w-5 text-orange-500" />
            </div>
            <div className="mt-4">
              <span className="text-4xl font-black">12%</span>
              <p className="text-[10px] font-mono uppercase mt-1 text-muted-foreground">To monthly quota</p>
            </div>
          </div>
        </div>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <div className="flex gap-8 overflow-x-auto pb-12 scrollbar-brutalist">
            {pipeline.stages.map((stage, idx) => (
              <div key={stage} className="w-80 flex-shrink-0">
                <div className="mb-4 flex items-center justify-between px-2">
                  <h3 className="font-black uppercase text-sm tracking-tighter">{stage}</h3>
                  <Badge className="bg-black text-white rounded-none border-none text-[10px] font-black">
                    {dealsByStage[stage]?.length || 0}
                  </Badge>
                </div>
                <div className="border-4 border-black bg-muted/20 min-h-[600px] p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                  <SortableContext id={stage} items={dealsByStage[stage]?.map(d => d.id) || []} strategy={verticalListSortingStrategy}>
                    <div className="space-y-4">
                      {dealsByStage[stage]?.map((deal) => (
                        <DealCard key={deal.id} deal={deal} />
                      ))}
                    </div>
                  </SortableContext>
                </div>
              </div>
            ))}
          </div>
        </DndContext>
      </div>
    </div>
  );
}