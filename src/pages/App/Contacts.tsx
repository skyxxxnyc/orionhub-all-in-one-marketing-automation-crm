import React, { useState, useMemo, useRef } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Papa from 'papaparse';
import { useDebounce } from 'react-use';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle, Import, Search, Trash2, Tag, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from '@/components/ui/skeleton';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { toast } from 'sonner';
import { api } from '@/lib/api-client';
import type { Contact } from '@shared/types';
import { OnboardingTooltip } from '@/components/OnboardingTooltip';
const fetchContacts = async ({ pageParam = null, search = '' }: { pageParam?: string | null, search?: string }) => {
  return api<{ items: Contact[]; next: string | null }>('/api/contacts', {
    query: { cursor: pageParam, limit: 20, search },
  });
};
export function Contacts() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);
  const { data, fetchNextPage, hasNextPage, isFetching, isLoading } = useInfiniteQuery({
    queryKey: ['contacts', debouncedSearchTerm],
    queryFn: ({ pageParam }) => fetchContacts({ pageParam, search: debouncedSearchTerm }),
    getNextPageParam: (lastPage) => lastPage.next,
    initialPageParam: null,
  });
  const contacts = useMemo(() => data?.pages.flatMap(page => page.items) ?? [], [data]);
  const deleteMutation = useMutation({
    mutationFn: (ids: string[]) => api('/api/contacts/deleteMany', { method: 'POST', body: JSON.stringify({ ids }) }),
    onSuccess: () => {
      toast.success('Contacts deleted successfully.');
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      setSelected([]);
    },
    onError: () => toast.error('Failed to delete contacts.'),
  });
  const handleSelectAll = (checked: boolean | 'indeterminate') => {
    setSelected(checked === true ? contacts.map(c => c.id) : []);
  };
  const handleSelectRow = (id: string, checked: boolean) => {
    setSelected(prev => checked ? [...prev, id] : prev.filter(rowId => rowId !== id));
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="editorial-heading">Contacts</h1>
            <p className="text-xl font-mono mt-2 uppercase font-bold text-muted-foreground">Relationship Management.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button className="brutalist-button bg-orange-500 text-white" onClick={() => navigate('/app/contacts/new')}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Contact
            </Button>
            <OnboardingTooltip tourId="import-contacts" content="Import from CSV to add multiple contacts at once.">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="brutalist-button"><Import className="mr-2 h-4 w-4" /> Import</Button>
                </SheetTrigger>
                <SheetContent className="border-l-4 border-black">
                  <SheetHeader>
                    <SheetTitle className="text-2xl font-black uppercase">Import Contacts</SheetTitle>
                  </SheetHeader>
                  <div className="py-8 space-y-4">
                    <p className="font-bold uppercase text-sm">Upload a CSV file with 'name' and 'email' columns.</p>
                    <input type="file" accept=".csv" ref={fileInputRef} className="hidden" />
                    <Button className="brutalist-button w-full" onClick={() => fileInputRef.current?.click()}>
                      Choose CSV File
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </OnboardingTooltip>
          </div>
        </div>
        <div className="mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-black" />
            <Input 
              placeholder="SEARCH CONTACTS..." 
              className="brutalist-input pl-12 h-12 uppercase font-black" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
          {selected.length > 0 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 bg-black text-white p-2 border-2 border-black shadow-brutalist">
              <span className="text-xs font-black uppercase px-2">{selected.length} SELECTED</span>
              <Button variant="ghost" size="sm" className="text-white hover:bg-orange-500 h-8 uppercase font-black text-[10px]"><Tag className="mr-1 h-3 w-3" />Tag</Button>
              <Button variant="ghost" size="sm" className="text-white hover:bg-red-600 h-8 uppercase font-black text-[10px]" onClick={() => deleteMutation.mutate(selected)}><Trash2 className="mr-1 h-3 w-3" />Delete</Button>
            </motion.div>
          )}
        </div>
        <div className="border-4 border-black bg-white shadow-brutalist overflow-hidden">
          <Table>
            <TableHeader className="bg-black">
              <TableRow className="hover:bg-black border-b-4 border-black">
                <TableHead className="w-[50px] text-white">
                  <Checkbox
                    className="border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
                    checked={contacts.length > 0 && selected.length === contacts.length ? true : selected.length > 0 ? 'indeterminate' : false}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="text-white font-black uppercase tracking-widest">Name</TableHead>
                <TableHead className="text-white font-black uppercase tracking-widest">Email</TableHead>
                <TableHead className="text-white font-black uppercase tracking-widest">Tags</TableHead>
                <TableHead className="text-white font-black uppercase tracking-widest">Created</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <TableRow key={i} className="border-b-2 border-black">
                    <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                  </TableRow>
                ))
              ) : contacts.length > 0 ? (
                contacts.map((contact, idx) => (
                  <motion.tr
                    key={contact.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="hover:bg-orange-50 cursor-pointer border-b-2 border-black group"
                    onClick={() => navigate(`/app/contacts/${contact.id}`)}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        className="border-black data-[state=checked]:bg-black data-[state=checked]:text-white"
                        checked={selected.includes(contact.id)}
                        onCheckedChange={(checked) => handleSelectRow(contact.id, !!checked)}
                      />
                    </TableCell>
                    <TableCell className="font-black uppercase text-sm">{contact.name}</TableCell>
                    <TableCell className="font-mono text-xs">{contact.email}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {contact.tags.slice(0, 2).map(tag => (
                          <Badge key={tag} className="bg-black text-white rounded-none uppercase text-[10px] border-none">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-[10px] uppercase">{new Date(contact.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-black hover:text-white border-2 border-transparent hover:border-black">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="border-2 border-black shadow-brutalist rounded-none">
                          <DropdownMenuItem className="font-black uppercase text-xs focus:bg-orange-500 focus:text-white" onClick={() => navigate(`/app/contacts/${contact.id}`)}>View Details</DropdownMenuItem>
                          <DropdownMenuItem className="font-black uppercase text-xs focus:bg-orange-500 focus:text-white">Add Note</DropdownMenuItem>
                          <DropdownMenuItem className="font-black uppercase text-xs focus:bg-orange-500 focus:text-white">Start Automation</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-48 text-center font-black uppercase text-muted-foreground">No contacts found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {hasNextPage && (
          <div className="mt-8 text-center">
            <Button className="brutalist-button" onClick={() => fetchNextPage()} disabled={isFetching}>
              {isFetching ? 'LOADING...' : 'LOAD MORE'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}