import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { api } from '@/lib/api-client';
import type { Appointment } from '@shared/types';
import { format } from 'date-fns';
const timeSlots = [
  "09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"
];
export function BookingWidget() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1);
  const queryClient = useQueryClient();
  const createAppointmentMutation = useMutation({
    mutationFn: (newAppointment: Partial<Appointment>) => api('/api/appointments', {
      method: 'POST',
      body: JSON.stringify(newAppointment)
    }),
    onSuccess: () => {
      toast.success('Appointment booked successfully!');
      queryClient.invalidateQueries({ queryKey: ['calendarEvents'] });
      setStep(3);
    },
    onError: () => {
      toast.error('Failed to book appointment.');
    }
  });
  const handleBooking = () => {
    if (!date || !time || !name || !email) {
      toast.error('Please fill all fields.');
      return;
    }
    const [hour, minutePart] = time.split(':');
    const [minute, ampm] = minutePart.split(' ');
    let h = parseInt(hour, 10);
    if (ampm === 'PM' && h < 12) h += 12;
    if (ampm === 'AM' && h === 12) h = 0;
    const start = new Date(date);
    start.setHours(h, parseInt(minute, 10), 0, 0);
    const end = new Date(start.getTime() + 60 * 60 * 1000); // 1 hour duration
    createAppointmentMutation.mutate({
      title: `Booking for ${name}`,
      start: start.getTime(),
      end: end.getTime(),
      type: 'Consultation',
      // In a real app, you'd create/link a contact
    });
  };
  return (
    <div className="p-4">
      {step === 1 && (
        <>
          <h3 className="font-semibold mb-4">Select a Date & Time</h3>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
          <div className="grid grid-cols-3 gap-2 mt-4">
            {timeSlots.map(slot => (
              <Button
                key={slot}
                variant={time === slot ? 'default' : 'outline'}
                onClick={() => setTime(slot)}
              >
                {slot}
              </Button>
            ))}
          </div>
          <Button onClick={() => setStep(2)} disabled={!date || !time} className="w-full mt-4">
            Next
          </Button>
        </>
      )}
      {step === 2 && (
        <>
          <h3 className="font-semibold mb-4">Your Details</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Booking for {date && time ? `${format(date, 'PPP')} at ${time}` : ''}
          </p>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
            <Button onClick={handleBooking} className="flex-grow" disabled={createAppointmentMutation.isPending}>
              {createAppointmentMutation.isPending ? 'Booking...' : 'Confirm Booking'}
            </Button>
          </div>
        </>
      )}
      {step === 3 && (
        <div className="text-center py-8">
          <h3 className="text-xl font-bold">Thank You!</h3>
          <p className="text-muted-foreground">Your appointment has been scheduled.</p>
          <p className="text-sm mt-2">A confirmation has been sent to your email.</p>
          <Button onClick={() => { setStep(1); setTime(null); }} className="mt-4">Book Another</Button>
        </div>
      )}
    </div>
  );
}