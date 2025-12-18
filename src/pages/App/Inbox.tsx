import { useState, useMemo } from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Search, Mail, MessageSquare, Users } from 'lucide-react';
import { api } from '@/lib/api-client';
import type { Conversation, Contact } from '@shared/types';
import { ConversationThread } from '@/components/ConversationThread';
import { Checkbox } from '@/components/ui/checkbox';
const fetchInbox = async ({ pageParam = null }: { pageParam?: string | null }) => 
  api<{ items: Conversation[]; next: string | null }>('/api/inbox', { query: { cursor: pageParam } });
const fetchContacts = async () => 
  api<{ items: Contact[] }>('/api/contacts');
export function Inbox() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const { data: inboxData, isLoading: isInboxLoading } = useInfiniteQuery({
    queryKey: ['inbox', search],
    queryFn: fetchInbox,
    getNextPageParam: (lastPage) => lastPage.next,
    initialPageParam: null
  });
  const { data: contactsData } = useQuery({
    queryKey: ['contacts'],
    queryFn: fetchContacts
  });
  const conversations = useMemo(() => inboxData?.pages.flatMap((page) => page.items) ?? [], [inboxData]);
  const contactsById = useMemo(() => {
    const map = new Map<string, Contact>();
    contactsData?.items.forEach((c) => map.set(c.id, c));
    return map;
  }, [contactsData]);
  const getInitials = (name: string) => name.split(' ').map((n) => n[0]).join('').toUpperCase();
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-5xl font-display font-black uppercase">Inbox</h1>
            <p className="text-muted-foreground font-mono">Unified communication stream.</p>
          </div>
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="SEARCH..." 
              className="brutalist-input pl-10 uppercase font-bold" 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
            />
          </div>
        </div>
        <div className="border-4 border-black bg-white overflow-hidden">
          <Table>
            <TableHeader className="bg-black">
              <TableRow className="hover:bg-black border-b-4 border-black">
                <TableHead className="w-12 text-white"><Checkbox className="border-white" /></TableHead>
                <TableHead className="text-white font-black uppercase">Contact</TableHead>
                <TableHead className="text-white font-black uppercase">Last Message</TableHead>
                <TableHead className="text-white font-black uppercase">Channel</TableHead>
                <TableHead className="text-white font-black uppercase">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isInboxLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-b-2 border-black">
                    <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                    <TableCell><div className="flex items-center gap-2"><Skeleton className="h-8 w-8 rounded-full" /><Skeleton className="h-4 w-32" /></div></TableCell>
                    <TableCell><Skeleton className="h-4 w-64" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                  </TableRow>
                ))
              ) : conversations.length > 0 ? (
                conversations.map((conv) => {
                  const contact = contactsById.get(conv.contactId);
                  const lastMessage = conv.messages[conv.messages.length - 1];
                  return (
                    <TableRow 
                      key={conv.id} 
                      onClick={() => setSelectedConversation(conv)} 
                      className="cursor-pointer hover:bg-orange-50 border-b-2 border-black transition-colors"
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}><Checkbox className="border-black" /></TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border-2 border-black">
                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${contact?.name}`} />
                            <AvatarFallback className="bg-orange-500 text-white font-bold">{contact ? getInitials(contact.name) : '?'}</AvatarFallback>
                          </Avatar>
                          <span className="font-black uppercase">{contact?.name || 'Unknown'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="truncate max-w-xs font-medium">{lastMessage?.text}</p>
                        <p className="text-xs font-mono text-muted-foreground">{formatDistanceToNow(new Date(conv.lastMessageAt), { addSuffix: true })}</p>
                      </TableCell>
                      <TableCell>
                        {conv.channel === 'email' ? <Mail className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
                      </TableCell>
                      <TableCell>
                        <Badge className={conv.status === 'open' ? 'bg-orange-500 text-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-white text-black border-2 border-black'}>
                          {conv.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-48 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <Users className="h-12 w-12 text-muted-foreground" />
                      <p className="font-display font-bold text-xl uppercase">No conversations found</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <Sheet open={!!selectedConversation} onOpenChange={(open) => !open && setSelectedConversation(null)}>
          <SheetContent className="sm:max-w-lg w-full flex flex-col border-l-4 border-black p-0">
            {selectedConversation && <ConversationThread conversation={selectedConversation} contact={contactsById.get(selectedConversation.contactId)} />}
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}