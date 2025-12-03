import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { api } from '@/lib/api-client';
import type { Template } from '@shared/types';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useAuthStore } from '@/lib/mock-auth';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner';
const fetchTemplates = async (orgId?: string) => api<{ items: Template[] }>('/api/templates', { query: { orgId } });
interface TemplateGalleryProps {
  onSelect: (template: Template) => void;
}
export function TemplateGallery({ onSelect }: TemplateGalleryProps) {
  const currentOrg = useAuthStore(s => s.currentOrg);
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ['templates', currentOrg?.id],
    queryFn: () => fetchTemplates(currentOrg?.id),
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const filteredTemplates = useMemo(() => {
    if (!data?.items) return [];
    return data.items.filter(template =>
      (activeTab === 'all' || template.type === activeTab) &&
      (template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.category?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [data, searchTerm, activeTab]);
  const handleSelect = (template: Template) => {
    toast.info(`Creating new project from "${template.name}"...`);
    // In a real app, this would be a mutation to create a project from a template
    // For now, we navigate to the relevant section
    switch (template.type) {
      case 'funnel':
      case 'page':
        navigate(`/app/funnels`);
        break;
      case 'automation':
        navigate(`/app/automations`);
        break;
    }
    onSelect(template);
  };
  return (
    <div className="py-4 space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
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
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="funnel">Funnels</TabsTrigger>
          <TabsTrigger value="automation">Automations</TabsTrigger>
          <TabsTrigger value="page">Pages</TabsTrigger>
        </TabsList>
      </Tabs>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } }}
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
              onClick={() => handleSelect(template)}
            >
              <Card className="h-full overflow-hidden">
                <CardHeader>
                  <CardTitle>{template.name}</CardTitle>
                  <CardDescription className="line-clamp-2">{template.description}</CardDescription>
                  <div className="flex gap-2 pt-1 flex-wrap">
                    <Badge variant="outline" className="capitalize">{template.type}</Badge>
                    {template.category && <Badge variant="secondary">{template.category}</Badge>}
                    {template.complexity && <Badge variant="outline">{template.complexity}</Badge>}
                  </div>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground">
                  <p>Used {template.metrics.adoption} times</p>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  );
}