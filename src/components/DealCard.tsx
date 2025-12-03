import React from 'react';
import { motion } from 'framer-motion';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '@/components/ui/card';
import { MoreHorizontal } from 'lucide-react';
import type { Deal } from '@shared/types';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { Contact } from '@shared/types';
interface DealCardProps {
  deal: Deal;
}
const fetchContact = async (id: string) => api<Contact>(`/api/contacts/${id}`);
export function DealCard({ deal }: DealCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: deal.id });
  const { data: contact } = useQuery({
    queryKey: ['contact', deal.contactId],
    queryFn: () => fetchContact(deal.contactId!),
    enabled: !!deal.contactId,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
  };
  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();
  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      layoutId={deal.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="touch-none"
    >
      <Card className="p-3 mb-4 bg-card rounded-lg border shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-semibold text-sm">{deal.title}</h4>
          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
        </div>
        <p className="text-sm font-bold text-foreground">${deal.value.toLocaleString()}</p>
        {contact && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t">
            <Avatar className="h-6 w-6">
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${contact.name}`} />
              <AvatarFallback>{getInitials(contact.name)}</AvatarFallback>
            </Avatar>
            <p className="text-xs text-muted-foreground">{contact.name}</p>
          </div>
        )}
      </Card>
    </motion.div>
  );
}