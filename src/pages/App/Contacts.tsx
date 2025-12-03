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
  const importMutation = useMutation({
    mutationFn: (newContacts: Partial<Contact>[]) => api<Contact[]>('/api/contacts/import', { method: 'POST', body: JSON.stringify(newContacts) }),
    onSuccess: (created) => {
      toast.success(`${created.length} contacts imported successfully.`);
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
    onError: () => toast.error('Failed to import contacts.'),
  });
  const handleSelectAll = (checked: boolean | 'indeterminate') => {
    setSelected(checked === true ? contacts.map(c => c.id) : []);
  };
  const handleSelectRow = (id: string, checked: boolean) => {
    setSelected(prev => checked ? [...prev, id] : prev.filter(rowId => rowId !== id));
  };
  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const requiredHeaders = ['name', 'email'];
          const hasHeaders = requiredHeaders.every(h => results.meta.fields?.includes(h));
          if (!hasHeaders) {
            toast.error('CSV must contain "name" and "email" columns.');
            return;
          }
          importMutation.mutate(results.data as Partial<Contact>[]);
        },
        error: () => toast.error('Error parsing CSV file.'),
      });
    }
  };
  const handleExport = () => {
    const csv = Papa.unparse(contacts.map(({ id, activities, ...rest }) => rest));
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'contacts.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Contacts exported.');
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Contacts</h1>
            <p className="text-muted-foreground">Manage your contacts and leads.</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => navigate('/app/contacts/new')}><PlusCircle className="mr-2 h-4 w-4" /> Add Contact</Button>
            <OnboardingTooltip tourId="import-contacts" content="Import from CSV to add multiple contacts at once.">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline"><Import className="mr-2 h-4 w-4" /> Import</Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Import Contacts</SheetTitle>
                  </SheetHeader>
                  <div className="py-4">
                    <p className="text-sm text-muted-foreground mb-4">Upload a CSV file with 'name' and 'email' columns.</p>
                    <input type="file" accept=".csv" ref={fileInputRef} onChange={handleFileImport} className="hidden" />
                    <Button onClick={() => fileInputRef.current?.click()} disabled={importMutation.isPending}>
                      {importMutation.isPending ? 'Importing...' : 'Choose CSV File'}
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </OnboardingTooltip>
            <Button variant="outline" onClick={handleExport}><Download className="mr-2 h-4 w-4" /> Export</Button>
          </div>
        </div>
        <div className="mb-4 flex items-center justify-between gap-2">
          <OnboardingTooltip tourId="search-contacts" content="Search by name, email, or tags.">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search contacts..." className="pl-8" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </OnboardingTooltip>
          {selected.length > 0 && (
            <OnboardingTooltip tourId="bulk-actions" content="Perform actions on multiple contacts at once.">
              <div className="flex items-center gap-2 animate-fade-in">
                <span className="text-sm text-muted-foreground">{selected.length} selected</span>
                <Button variant="outline" size="sm"><Tag className="mr-1 h-4 w-4" />Add Tag</Button>
                <Button variant="destructive" size="sm" onClick={() => deleteMutation.mutate(selected)} disabled={deleteMutation.isPending}>
                  <Trash2 className="mr-1 h-4 w-4" />Delete
                </Button>
              </div>
            </OnboardingTooltip>
          )}
        </div>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={contacts.length > 0 && selected.length === contacts.length ? true : selected.length > 0 ? 'indeterminate' : false}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                  </TableRow>
                ))
              ) : contacts.length > 0 ? (
                contacts.map((contact) => (
                  <motion.tr
                    key={contact.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                    className="hover:bg-muted/50 cursor-pointer"
                    onClick={() => navigate(`/app/contacts/${contact.id}`)}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selected.includes(contact.id)}
                        onCheckedChange={(checked) => handleSelectRow(contact.id, !!checked)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{contact.name}</TableCell>
                    <TableCell className="text-muted-foreground">{contact.email}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {contact.tags.slice(0, 2).map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                        {contact.tags.length > 2 && <Badge variant="outline">+{contact.tags.length - 2}</Badge>}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{new Date(contact.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/app/contacts/${contact.id}`)}>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Add Note</DropdownMenuItem>
                          <DropdownMenuItem>Start Automation</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">No contacts found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {hasNextPage && (
          <div className="mt-4 text-center">
            <Button onClick={() => fetchNextPage()} disabled={isFetching}>
              {isFetching ? 'Loading more...' : 'Load More'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}