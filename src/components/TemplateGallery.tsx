import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { api } from '@/lib/api-client';
import type { Template } from '@shared/types';
import { Input } from '@/components/ui/input';
import { Search, Star } from 'lucide-react';
import { useAuthStore } from '@/lib/mock-auth';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
const fetchTemplates = async (orgId?: string) => api<{ items: Template[] }>('/api/templates', { query: { orgId } });
interface TemplateGalleryProps {
  onSelect: (template: Template) => void;
}
export function TemplateGallery({ onSelect }: TemplateGalleryProps) {
  const currentOrg = useAuthStore(s => s.currentOrg);
  const { data, isLoading } = useQuery({
    queryKey: ['templates', currentOrg?.id],
    queryFn: () => fetchTemplates(currentOrg?.id),
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [favorites, setFavorites] = useState<string[]>([]);
  useEffect(() => {
    if (currentOrg) {
      const savedFavorites = localStorage.getItem(`favorites_${currentOrg.id}`);
      if (savedFavorites) {
        try {
          setFavorites(JSON.parse(savedFavorites));
        } catch (e) {
          setFavorites([]);
        }
      }
    }
  }, [currentOrg]);
  const toggleFavorite = (templateId: string) => {
    const newFavorites = favorites.includes(templateId)
      ? favorites.filter(id => id !== templateId)
      : [...favorites, templateId];
    setFavorites(newFavorites);
    if (currentOrg) {
      localStorage.setItem(`favorites_${currentOrg.id}`, JSON.stringify(newFavorites));
    }
  };
  const filteredTemplates = useMemo(() => {
    if (!data?.items) return [];
    return data.items.filter(template =>
      (activeTab === 'all' || template.type === activeTab) &&
      (template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.category?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [data, searchTerm, activeTab]);
  const onDragStart = (event: React.DragEvent<HTMLDivElement>, template: Template) => {
    event.dataTransfer.setData('application/reactflow-template', JSON.stringify(template));
    event.dataTransfer.effectAllowed = 'move';
  };
  return (
    <div className="py-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="SEARCH TEMPLATES..."
            className="brutalist-input pl-10 uppercase font-bold"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted border-2 border-black p-1">
          <TabsTrigger value="all" className="data-[state=active]:bg-black data-[state=active]:text-white uppercase font-bold">All</TabsTrigger>
          <TabsTrigger value="funnel" className="data-[state=active]:bg-black data-[state=active]:text-white uppercase font-bold">Funnels</TabsTrigger>
          <TabsTrigger value="automation" className="data-[state=active]:bg-black data-[state=active]:text-white uppercase font-bold">Automations</TabsTrigger>
          <TabsTrigger value="page" className="data-[state=active]:bg-black data-[state=active]:text-white uppercase font-bold">Pages</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-64 w-full border-2 border-black" />)
        ) : (
          filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="cursor-pointer brutalist-card flex flex-col"
              onClick={() => onSelect(template)}
              draggable
              onDragStart={(e) => onDragStart(e, template)}
            >
              <div className="flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-black uppercase leading-tight">{template.name}</h3>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 hover:bg-transparent"
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(template.id); }}
                  >
                    <Star className={`h-5 w-5 ${favorites.includes(template.id) ? 'text-orange-500 fill-orange-500' : 'text-black'}`} />
                  </Button>
                </div>
                <p className="text-sm font-medium text-muted-foreground mb-4 line-clamp-2">{template.description}</p>
                <div className="flex gap-2 pt-1 flex-wrap">
                  <Badge className="bg-black text-white uppercase text-[10px]">{template.type}</Badge>
                  {template.category && <Badge variant="outline" className="border-black uppercase text-[10px]">{template.category}</Badge>}
                </div>
              </div>
              <div className="mt-4 pt-4 border-t-2 border-black flex justify-between items-center">
                <span className="text-xs font-mono uppercase">Used {template.metrics.adoption}x</span>
                <span className="text-xs font-mono uppercase">{template.complexity}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}