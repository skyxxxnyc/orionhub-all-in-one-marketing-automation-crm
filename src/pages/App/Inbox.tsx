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
const fetchInbox = async ({ pageParam = null, search = '' }: { pageParam?: string | null, search?: string }) =>
  api<{ items: Conversation[]; next: string | null }>('/api/inbox', { query: { cursor: pageParam, search } });
const fetchContacts = async () =>
  api<{ items: Contact[] }>('/api/contacts');
export function Inbox() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [search, setSearch] = useState('');
  const { data: inboxData, isLoading: isInboxLoading } = useInfiniteQuery({
    queryKey: ['inbox', search],
    queryFn: ({ pageParam }) => fetchInbox({ pageParam, search }),
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="editorial-heading">Inbox</h1>
            <p className="text-xl font-mono mt-2 uppercase font-bold text-muted-foreground">Unified communication stream.</p>
          </div>
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-black" />
            <Input
              placeholder="SEARCH CONVERSATIONS..."
              className="brutalist-input pl-12 h-12 uppercase font-black"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="border-4 border-black bg-white shadow-brutalist overflow-hidden">
          <Table>
            <TableHeader className="bg-black">
              <TableRow className="hover:bg-black border-b-4 border-black">
                <TableHead className="w-12 text-white">
                  <Checkbox className="border-white data-[state=checked]:bg-white data-[state=checked]:text-black" />
                </TableHead>
                <TableHead className="text-white font-black uppercase tracking-widest">Contact</TableHead>
                <TableHead className="text-white font-black uppercase tracking-widest">Last Message</TableHead>
                <TableHead className="text-white font-black uppercase tracking-widest">Channel</TableHead>
                <TableHead className="text-white font-black uppercase tracking-widest">Status</TableHead>
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
                      className="cursor-pointer hover:bg-orange-50 border-b-2 border-black transition-colors group"
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox className="border-black data-[state=checked]:bg-black data-[state=checked]:text-white" />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border-2 border-black">
                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${contact?.name}`} />
                            <AvatarFallback className="bg-black text-white font-bold">{contact ? getInitials(contact.name) : '?'}</AvatarFallback>
                          </Avatar>
                          <span className="font-black uppercase text-sm">{contact?.name || 'Unknown'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="truncate max-w-xs font-bold text-sm">{lastMessage?.text}</p>
                        <p className="text-[10px] font-mono uppercase text-muted-foreground">{formatDistanceToNow(new Date(conv.lastMessageAt), { addSuffix: true })}</p>
                      </TableCell>
                      <TableCell>
                        {conv.channel === 'email' ? <Mail className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
                      </TableCell>
                      <TableCell>
                        <Badge className={conv.status === 'open' ? 'bg-orange-500 text-white border-2 border-black' : 'bg-white text-black border-2 border-black'}>
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
                      <p className="font-display font-black text-xl uppercase">No conversations found</p>
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