import { useState, useRef, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
import type { Conversation, Contact, Message } from '@shared/types';
interface ConversationThreadProps {
  conversation: Conversation;
  contact?: Contact;
}
export function ConversationThread({ conversation, contact }: ConversationThreadProps) {
  const [reply, setReply] = useState('');
  const queryClient = useQueryClient();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const addMessageMutation = useMutation({
    mutationFn: (text: string) => api(`/api/conversations/${conversation.id}/messages`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inbox'] });
      setReply('');
    },
    onError: () => toast.error('Failed to send message.'),
  });
  const updateStatusMutation = useMutation({
    mutationFn: (status: 'open' | 'closed') => api(`/api/conversations/${conversation.id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inbox'] });
      toast.success('Conversation status updated.');
    },
    onError: () => toast.error('Failed to update status.'),
  });
  const handleSend = () => {
    if (reply.trim()) {
      addMessageMutation.mutate(reply.trim());
    }
  };
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [conversation.messages]);
  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();
  return (
    <>
      <SheetHeader className="p-4 border-b">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${contact?.name}`} />
            <AvatarFallback>{contact ? getInitials(contact.name) : '?'}</AvatarFallback>
          </Avatar>
          <div>
            <SheetTitle>{contact?.name || 'Unknown Contact'}</SheetTitle>
            <SheetDescription>{contact?.email}</SheetDescription>
          </div>
          <div className="ml-auto">
            <Select value={conversation.status} onValueChange={(value: 'open' | 'closed') => updateStatusMutation.mutate(value)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </SheetHeader>
      <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {conversation.messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn('flex items-end gap-2', message.direction === 'out' ? 'justify-end' : 'justify-start')}
            >
              <div className={cn(
                'p-3 rounded-lg max-w-xs',
                message.direction === 'out' ? 'bg-primary text-primary-foreground' : 'bg-muted'
              )}>
                <p className="text-sm">{message.text}</p>
                <p className="text-xs opacity-70 mt-1 text-right">{format(new Date(message.timestamp), 'p')}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
      <div className="p-4 border-t">
        <div className="relative">
          <Textarea
            placeholder="Type your reply..."
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            className="pr-20"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button
            size="sm"
            className="absolute right-2 bottom-2"
            onClick={handleSend}
            disabled={addMessageMutation.isPending || !reply.trim()}
          >
            Send
          </Button>
        </div>
      </div>
    </>
  );
}