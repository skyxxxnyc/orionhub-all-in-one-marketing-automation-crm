import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Search, Mail, MessageSquare } from 'lucide-react';
import { api } from '@/lib/api-client';
import type { Conversation, Contact } from '@shared/types';
import { ConversationThread } from '@/components/ConversationThread';
const fetchInbox = async () => api<{ items: Conversation[] }>('/api/inbox');
const fetchContacts = async () => api<{ items: Contact[] }>('/api/contacts');
export function Inbox() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const { data: inboxData, isLoading: isInboxLoading } = useQuery({
    queryKey: ['inbox'],
    queryFn: fetchInbox,
  });
  const { data: contactsData } = useQuery({
    queryKey: ['contacts'],
    queryFn: fetchContacts,
  });
  const conversations = useMemo(() => inboxData?.items ?? [], [inboxData]);
  const contactsById = useMemo(() => {
    const map = new Map<string, Contact>();
    contactsData?.items.forEach(c => map.set(c.id, c));
    return map;
  }, [contactsData]);
  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Inbox</h1>
            <p className="text-muted-foreground">Manage all your customer conversations in one place.</p>
          </div>
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search conversations..." className="pl-8" />
          </div>
        </div>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contact</TableHead>
                <TableHead>Last Message</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isInboxLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><div className="flex items-center gap-2"><Skeleton className="h-8 w-8 rounded-full" /><Skeleton className="h-4 w-32" /></div></TableCell>
                    <TableCell><Skeleton className="h-4 w-64" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                  </TableRow>
                ))
              ) : conversations.length > 0 ? (
                conversations.map((conv) => {
                  const contact = contactsById.get(conv.contactId);
                  const lastMessage = conv.messages[conv.messages.length - 1];
                  return (
                    <TableRow key={conv.id} onClick={() => setSelectedConversation(conv)} className="cursor-pointer hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${contact?.name}`} />
                            <AvatarFallback>{contact ? getInitials(contact.name) : '?'}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{contact?.name || 'Unknown Contact'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="truncate max-w-xs text-muted-foreground">{lastMessage?.text}</p>
                        <p className="text-xs text-muted-foreground/80">{formatDistanceToNow(new Date(conv.lastMessageAt), { addSuffix: true })}</p>
                      </TableCell>
                      <TableCell>
                        {conv.channel === 'email' ? <Mail className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />}
                      </TableCell>
                      <TableCell><Badge variant={conv.status === 'open' ? 'default' : 'secondary'} className="capitalize">{conv.status}</Badge></TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">No conversations yet.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <Sheet open={!!selectedConversation} onOpenChange={(open) => !open && setSelectedConversation(null)}>
          <SheetContent className="sm:max-w-lg w-full flex flex-col">
            {selectedConversation && <ConversationThread conversation={selectedConversation} contact={contactsById.get(selectedConversation.contactId)} />}
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}