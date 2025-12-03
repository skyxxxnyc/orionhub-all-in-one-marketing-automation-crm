import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Search, Copy, Download } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { api } from '@/lib/api-client';
import { useAuthStore } from '@/lib/mock-auth';
import type { Project } from '@shared/types';
import { format } from 'date-fns';
const fetchProjects = async (orgId?: string) => api<{ items: Project[] }>('/api/projects', { query: { orgId } });
export function ProjectDashboard() {
  const queryClient = useQueryClient();
  const currentOrg = useAuthStore(s => s.currentOrg);
  const { data, isLoading } = useQuery({
    queryKey: ['projects', currentOrg?.id],
    queryFn: () => fetchProjects(currentOrg?.id),
    enabled: !!currentOrg,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const filteredProjects = useMemo(() => {
    if (!data?.items) return [];
    return data.items.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [data, searchTerm]);
  const duplicateMutation = useMutation({
    mutationFn: (project: Project) => api('/api/projects', {
      method: 'POST',
      body: JSON.stringify({ ...project, name: `${project.name} (Copy)`, id: undefined }),
    }),
    onSuccess: () => {
      toast.success('Project duplicated.');
      queryClient.invalidateQueries({ queryKey: ['projects', currentOrg?.id] });
    },
    onError: () => toast.error('Failed to duplicate project.'),
  });
  return (
    <div className="space-y-6">
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search projects..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={5}><Skeleton className="h-8 w-full" /></TableCell>
                  </TableRow>
                ))
              ) : (
                filteredProjects.map(project => (
                  <motion.tr key={project.id} whileHover={{ scale: 1.01 }} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{project.name}</TableCell>
                    <TableCell><Badge variant="outline" className="capitalize">{project.type}</Badge></TableCell>
                    <TableCell><Badge className="capitalize">{project.status}</Badge></TableCell>
                    <TableCell>{format(new Date(project.createdAt), 'PP')}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => duplicateMutation.mutate(project)}>
                            <Copy className="mr-2 h-4 w-4" /> Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" /> Export
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}