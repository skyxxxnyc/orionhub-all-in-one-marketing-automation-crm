import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { PlusCircle, MoreHorizontal } from 'lucide-react';
import { api } from '@/lib/api-client';
import type { Funnel } from '@shared/types';
import { format } from 'date-fns';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { FunnelSequencer } from '@/components/FunnelSequencer';
import { OnboardingTooltip } from '@/components/OnboardingTooltip';
import { motion } from 'framer-motion';
import { TemplateLibrary } from '@/components/TemplateLibrary';
const fetchFunnels = async () => api<{ items: Funnel[] }>('/api/funnels');
export function Funnels() {
  const navigate = useNavigate();
  const [isSequencerOpen, setSequencerOpen] = useState<Funnel | null>(null);
  const [isTemplateSheetOpen, setTemplateSheetOpen] = useState(false);
  const { data, isLoading } = useQuery({
    queryKey: ['funnels'],
    queryFn: fetchFunnels,
  });
  const funnels = useMemo(() => data?.items ?? [], [data]);
  const handleTemplateSelect = (templateId: string) => {
    // In a real app, this would likely be a mutation to create a new funnel from a template
    console.log("Creating new funnel from template:", templateId);
    setTemplateSheetOpen(false);
    navigate(`/app/funnels/new`, { state: { templateId } });
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Funnels & Pages</h1>
            <p className="text-muted-foreground">Build and manage your marketing funnels and landing pages.</p>
          </div>
          <OnboardingTooltip tourId="new-funnel" content="Build a new marketing funnel to capture leads.">
            <Sheet open={isTemplateSheetOpen} onOpenChange={setTemplateSheetOpen}>
              <SheetTrigger asChild>
                <Button><PlusCircle className="mr-2 h-4 w-4" /> New Funnel</Button>
              </SheetTrigger>
              <SheetContent className="sm:max-w-4xl">
                <SheetHeader>
                  <SheetTitle>Create Funnel from Template</SheetTitle>
                </SheetHeader>
                <TemplateLibrary type="page" onSelect={handleTemplateSelect} />
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
                  <TableHead>Steps</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                    </TableRow>
                  ))
                ) : funnels.length > 0 ? (
                  funnels.map((funnel) => (
                    <motion.tr
                      key={funnel.id}
                      className="cursor-pointer"
                      whileHover={{ scale: 1.01 }}
                    >
                      <TableCell className="font-medium" onClick={() => navigate(`/app/funnels/${funnel.steps[0]?.pageId}`)}>{funnel.name}</TableCell>
                      <TableCell onClick={() => setSequencerOpen(funnel)}>{funnel.steps.length}</TableCell>
                      <TableCell>{format(new Date(funnel.createdAt), 'PP')}</TableCell>
                      <TableCell>--</TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate(`/app/pages/${funnel.steps[0]?.pageId}/edit`)}>Edit First Page</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSequencerOpen(funnel)}>View Steps</DropdownMenuItem>
                            <DropdownMenuItem>View Stats</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">No funnels found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Sheet open={!!isSequencerOpen} onOpenChange={(open) => !open && setSequencerOpen(null)}>
          <SheetContent className="sm:max-w-2xl">
            <SheetHeader>
              <SheetTitle>Funnel: {isSequencerOpen?.name}</SheetTitle>
            </SheetHeader>
            {isSequencerOpen && <FunnelSequencer funnel={isSequencerOpen} />}
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}