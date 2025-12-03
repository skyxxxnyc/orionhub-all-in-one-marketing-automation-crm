import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MessageSquare, Workflow, StickyNote, Sparkles, Plus } from "lucide-react";
import { api } from "@/lib/api-client";
import type { Contact, ContactActivity } from "@shared/types";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useAuthStore } from "@/lib/mock-auth";
import { motion } from "framer-motion";
const fetchContact = async (id: string) => api<Contact>(`/api/contacts/${id}`);
const ActivityIcon = ({ type }: { type: ContactActivity['type'] }) => {
  const iconMap = {
    email: <MessageSquare className="h-4 w-4 text-black" />,
    note: <StickyNote className="h-4 w-4 text-black" />,
    automation: <Workflow className="h-4 w-4 text-black" />,
    sms: <MessageSquare className="h-4 w-4 text-black" />,
  };
  return <div className="flex-shrink-0 h-10 w-10 border-2 border-black bg-white flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">{iconMap[type]}</div>;
};
export function ContactDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const currentOrg = useAuthStore(s => s.currentOrg);
  const [note, setNote] = useState('');
  const { data: contact, isLoading, isError } = useQuery({
    queryKey: ['contact', id],
    queryFn: () => fetchContact(id!),
    enabled: !!id,
  });
  const updateContactMutation = useMutation({
    mutationFn: (updatedContact: Partial<Contact>) => api(`/api/contacts/${id}`, { method: 'PUT', body: JSON.stringify(updatedContact) }),
    onSuccess: () => {
      toast.success("Contact updated.");
      queryClient.invalidateQueries({ queryKey: ['contact', id] });
    },
    onError: () => toast.error("Failed to update contact."),
  });
  const addNoteMutation = useMutation({
    mutationFn: (newNote: string) => {
      const newActivities: ContactActivity[] = [{ type: 'note', content: newNote, date: Date.now() }, ...(contact?.activities ?? [])];
      return updateContactMutation.mutateAsync({ activities: newActivities });
    },
    onSuccess: () => setNote('')
  });
  const enrichMutation = useMutation({
    mutationFn: async (contactId: string) => {
      const res: any = await api('/api/perplexity/completions', {
        method: 'POST',
        body: JSON.stringify({ prompt: `Research prospect: ${contact?.name} (${contact?.email})` }),
        headers: { 'PICA_SECRET_KEY': 'mock-secret' }
      });
      const newFields = { social: 'twitter.com/mock_user', bio: res.choices[0].message.content };
      await updateContactMutation.mutateAsync({ customFields: { ...(contact?.customFields ?? {}), ...newFields } });
    },
    onSuccess: () => toast.success('Prospect enriched successfully!'),
    onError: (error: Error) => toast.error(`Enrichment failed: ${error.message}`),
  });
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Skeleton className="h-12 w-48 mb-8 border-4 border-black" />
        <div className="flex items-center gap-6 mb-12">
          <Skeleton className="h-24 w-24 rounded-full border-4 border-black" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-64 border-2 border-black" />
            <Skeleton className="h-6 w-48 border-2 border-black" />
          </div>
        </div>
      </div>
    );
  }
  if (isError || !contact) return <div className="text-center py-24 font-black uppercase">Error loading contact.</div>;
  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12">
        <Button variant="ghost" onClick={() => navigate('/app/contacts')} className="mb-8 brutalist-button">
          <ArrowLeft className="mr-2 h-4 w-4" /> BACK TO CONTACTS
        </Button>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8 mb-12">
          <Avatar className="h-24 w-24 border-4 border-black shadow-brutalist">
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${contact.name}`} alt={contact.name} />
            <AvatarFallback className="bg-orange-500 text-white text-2xl font-black">{getInitials(contact.name)}</AvatarFallback>
          </Avatar>
          <div className="flex-grow">
            <h1 className="text-5xl font-display font-black uppercase tracking-tighter">{contact.name}</h1>
            <p className="text-xl font-mono uppercase font-bold text-muted-foreground">{contact.email}</p>
          </div>
          <div className="flex gap-3">
            <Button className="brutalist-button bg-orange-500 text-white" onClick={() => enrichMutation.mutate(contact.id)} disabled={enrichMutation.isPending}>
              <Sparkles className="mr-2 h-4 w-4" /> {enrichMutation.isPending ? 'ENRICHING...' : 'ENRICH WITH AI'}
            </Button>
            <Button className="brutalist-button bg-black text-white">START AUTOMATION</Button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <Tabs defaultValue="activity" className="w-full">
              <TabsList className="mb-8 border-4 border-black bg-muted p-1 rounded-none w-fit">
                <TabsTrigger value="activity" className="font-black uppercase text-xs px-8 py-3 data-[state=active]:bg-black data-[state=active]:text-white rounded-none">Activity</TabsTrigger>
                <TabsTrigger value="deals" className="font-black uppercase text-xs px-8 py-3 data-[state=active]:bg-black data-[state=active]:text-white rounded-none">Deals</TabsTrigger>
                <TabsTrigger value="notes" className="font-black uppercase text-xs px-8 py-3 data-[state=active]:bg-black data-[state=active]:text-white rounded-none">Notes</TabsTrigger>
              </TabsList>
              <TabsContent value="activity">
                <div className="brutalist-card bg-white mb-8">
                  <form onSubmit={(e) => { e.preventDefault(); if (note.trim()) addNoteMutation.mutate(note.trim()); }}>
                    <Textarea placeholder="ADD A NOTE TO TIMELINE..." value={note} onChange={(e) => setNote(e.target.value)} className="brutalist-input mb-4 h-24 uppercase font-bold" />
                    <Button type="submit" className="brutalist-button bg-black text-white" disabled={addNoteMutation.isPending || !note.trim()}>
                      {addNoteMutation.isPending ? 'ADDING...' : 'ADD NOTE'}
                    </Button>
                  </form>
                </div>
                <div className="space-y-8">
                  {(contact.activities ?? []).map((item, index) => (
                    <motion.div key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="flex gap-6">
                      <ActivityIcon type={item.type} />
                      <div className="flex-grow brutalist-card bg-white p-4">
                        <p className="font-bold uppercase text-sm">{item.content}</p>
                        <p className="text-[10px] font-mono uppercase mt-2 text-muted-foreground">{formatDistanceToNow(new Date(item.date), { addSuffix: true })}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
          <div>
            <div className="brutalist-card bg-white sticky top-24">
              <h3 className="text-2xl font-black uppercase mb-6 tracking-tighter border-b-4 border-black pb-2">Contact Details</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-black uppercase text-[10px] tracking-widest text-muted-foreground">Full Name</h4>
                  <p className="font-bold uppercase">{contact.name}</p>
                </div>
                <div>
                  <h4 className="font-black uppercase text-[10px] tracking-widest text-muted-foreground">Email</h4>
                  <p className="font-mono text-sm">{contact.email || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="font-black uppercase text-[10px] tracking-widest text-muted-foreground">Phone</h4>
                  <p className="font-mono text-sm">{contact.phone || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="font-black uppercase text-[10px] tracking-widest text-muted-foreground">Tags</h4>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {contact.tags.map(tag => <Badge key={tag} className="bg-black text-white rounded-none uppercase text-[10px]">{tag}</Badge>)}
                    <Button variant="ghost" size="icon" className="h-6 w-6 border-2 border-black hover:bg-orange-500"><Plus className="h-3 w-3" /></Button>
                  </div>
                </div>
                {Object.entries(contact.customFields ?? {}).map(([key, value]) => (
                  <div key={key}>
                    <h4 className="font-black uppercase text-[10px] tracking-widest text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1')}</h4>
                    <p className="font-medium text-sm whitespace-pre-wrap">{String(value)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}