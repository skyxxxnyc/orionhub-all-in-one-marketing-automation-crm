import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MessageSquare, Workflow, StickyNote, Paperclip, Plus } from "lucide-react";
import { api } from "@/lib/api-client";
import type { Contact, ContactActivity } from "@shared/types";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
const fetchContact = async (id: string) => api<Contact>(`/api/contacts/${id}`);
const ActivityIcon = ({ type }: { type: ContactActivity['type'] }) => {
  const iconMap = {
    email: <MessageSquare className="h-4 w-4 text-muted-foreground" />,
    note: <StickyNote className="h-4 w-4 text-muted-foreground" />,
    automation: <Workflow className="h-4 w-4 text-muted-foreground" />,
    sms: <MessageSquare className="h-4 w-4 text-muted-foreground" />,
  };
  return <div className="flex-shrink-0 h-8 w-8 rounded-full bg-muted flex items-center justify-center">{iconMap[type]}</div>;
};
export function ContactDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
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
    onSuccess: () => {
      setNote('');
    }
  });
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12">
        <Skeleton className="h-8 w-48 mb-8" />
        <div className="flex items-center gap-4 mb-8">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }
  if (isError || !contact) {
    return <div className="text-center py-12">Error loading contact.</div>;
  }
  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12">
        <Button variant="ghost" onClick={() => navigate('/app/contacts')} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Contacts
        </Button>
        <div className="flex items-center gap-4 mb-8">
          <Avatar className="h-16 w-16">
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${contact.name}`} alt={contact.name} />
            <AvatarFallback>{getInitials(contact.name)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">{contact.name}</h1>
            <p className="text-muted-foreground">{contact.email}</p>
          </div>
          <div className="ml-auto flex gap-2">
            <Button variant="outline">Send Email</Button>
            <Button>Start Automation</Button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Tabs defaultValue="activity">
              <TabsList>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="deals">Deals</TabsTrigger>
                <TabsTrigger value="automations">Automations</TabsTrigger>
                <TabsTrigger value="notes">Notes & Files</TabsTrigger>
              </TabsList>
              <TabsContent value="activity" className="mt-4">
                <Card>
                  <CardHeader>
                    <form onSubmit={(e) => { e.preventDefault(); if (note.trim()) addNoteMutation.mutate(note.trim()); }}>
                      <Textarea placeholder="Add a note..." value={note} onChange={(e) => setNote(e.target.value)} className="mb-2" />
                      <Button type="submit" size="sm" disabled={addNoteMutation.isPending || !note.trim()}>
                        {addNoteMutation.isPending ? 'Adding...' : 'Add Note'}
                      </Button>
                    </form>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {contact.activities.map((item, index) => (
                        <div key={index} className="flex gap-3">
                          <ActivityIcon type={item.type} />
                          <div>
                            <p>{item.content}</p>
                            <p className="text-sm text-muted-foreground">{formatDistanceToNow(new Date(item.date), { addSuffix: true })}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Contact Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm">Full Name</h4>
                  <p className="text-muted-foreground">{contact.name}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Email</h4>
                  <p className="text-muted-foreground">{contact.email || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Phone</h4>
                  <p className="text-muted-foreground">{contact.phone || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Tags</h4>
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {contact.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                    <Button variant="ghost" size="icon" className="h-6 w-6"><Plus className="h-4 w-4" /></Button>
                  </div>
                </div>
                {Object.entries(contact.customFields).map(([key, value]) => (
                  <div key={key}>
                    <h4 className="font-semibold text-sm capitalize">{key}</h4>
                    <p className="text-muted-foreground">{String(value)}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}