import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, Clock, User, Tag, Trash2, Edit } from 'lucide-react';
import { api } from '@/lib/api-client';
import type { Appointment } from '@shared/types';
import { toast } from 'sonner';
const fetchAppointment = async (id: string) => api<Appointment>(`/api/appointments/${id}`);
interface AppointmentDetailProps {
  appointmentId: string;
}
export function AppointmentDetail({ appointmentId }: AppointmentDetailProps) {
  const queryClient = useQueryClient();
  const { data: appointment, isLoading, isError } = useQuery({
    queryKey: ['appointment', appointmentId],
    queryFn: () => fetchAppointment(appointmentId),
  });
  const cancelMutation = useMutation({
    mutationFn: () => api(`/api/appointments/${appointmentId}`, {
      method: 'PUT',
      body: JSON.stringify({ status: 'cancelled' })
    }),
    onSuccess: () => {
      toast.success('Appointment cancelled.');
      queryClient.invalidateQueries({ queryKey: ['calendarEvents'] });
      queryClient.invalidateQueries({ queryKey: ['appointment', appointmentId] });
    },
    onError: () => toast.error('Failed to cancel appointment.'),
  });
  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="space-y-2 pt-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
        </div>
      </div>
    );
  }
  if (isError || !appointment) {
    return <div className="p-4">Error loading appointment details.</div>;
  }
  return (
    <>
      <SheetHeader className="p-4 border-b">
        <SheetTitle>{appointment.title}</SheetTitle>
        <SheetDescription>Status: <span className="capitalize">{appointment.status}</span></SheetDescription>
      </SheetHeader>
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{format(new Date(appointment.start), 'eeee, MMMM d, yyyy')}</span>
        </div>
        <div className="flex items-center gap-3 text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{`${format(new Date(appointment.start), 'p')} - ${format(new Date(appointment.end), 'p')}`}</span>
        </div>
        {appointment.contactId && (
          <div className="flex items-center gap-3 text-muted-foreground">
            <User className="h-4 w-4" />
            <span>Contact ID: {appointment.contactId}</span>
          </div>
        )}
        <div className="flex items-center gap-3 text-muted-foreground">
          <Tag className="h-4 w-4" />
          <span>Type: {appointment.type}</span>
        </div>
      </div>
      <div className="p-4 mt-auto border-t flex gap-2">
        <Button variant="outline" className="flex-1"><Edit className="mr-2 h-4 w-4" /> Reschedule</Button>
        <Button variant="destructive" className="flex-1" onClick={() => cancelMutation.mutate()} disabled={cancelMutation.isPending}>
          <Trash2 className="mr-2 h-4 w-4" /> Cancel
        </Button>
      </div>
    </>
  );
}